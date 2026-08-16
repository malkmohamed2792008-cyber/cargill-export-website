import { NextResponse } from "next/server"
import { getPrismaClient } from "@/lib/prisma"
import { ALL_ADMIN_ROLES, requireAdminAuth } from "@/lib/admin-auth"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  const gate = await requireAdminAuth(ALL_ADMIN_ROLES)
  if (gate.error) return gate.error

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const folder = searchParams.get("folder") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "24")

  const prisma = getPrismaClient()
  if (!prisma) {
    return NextResponse.json({ error: "Database connection unavailable" }, { status: 500 })
  }

  try {
    const where: Prisma.MediaAssetWhereInput = {}

    if (search) {
      where.OR = [
        { filename: { contains: search, mode: "insensitive" } },
        { originalName: { contains: search, mode: "insensitive" } },
        { altText: { contains: search, mode: "insensitive" } },
      ]
    }

    if (folder && folder !== "all") {
      where.folder = folder
    }

    const total = await prisma.mediaAsset.count({ where })

    const media = await prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const folders = await prisma.mediaAsset.groupBy({
      by: ["folder"],
      _count: { id: true },
    })

    return NextResponse.json({
      media,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      folders: folders.map((f) => ({ name: f.folder, count: f._count.id })),
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error("Error fetching media:", err)
    return NextResponse.json({ error: err.message || "Failed to fetch media" }, { status: 500 })
  }
}
