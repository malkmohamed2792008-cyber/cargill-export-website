import { NextResponse } from "next/server"
import { getPrismaClient } from "@/lib/prisma"
import { ADMIN_ONLY_ROLES, CONTENT_WRITE_ROLES, requireAdminAuth } from "@/lib/admin-auth"
import { unlink } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdminAuth(ADMIN_ONLY_ROLES)
  if (gate.error) return gate.error

  const { id } = await params
  const prisma = getPrismaClient()

  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 })
  }

  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id } })

    if (!asset) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 })
    }

    if (asset.url.startsWith("/uploads/")) {
      const relativePath = asset.url.replace(/^\//, "")
      const uploadsBaseDir = path.join(process.cwd(), "public", "uploads")
      const filePath = path.normalize(path.join(process.cwd(), "public", relativePath))

      if (filePath.startsWith(uploadsBaseDir) && existsSync(filePath)) {
        try {
          await unlink(filePath)
        } catch (err) {
          console.warn("Could not delete file from disk:", err)
        }
      }
    }

    await prisma.mediaAsset.delete({ where: { id } })

    return NextResponse.json({ message: "Media deleted successfully" })
  } catch (error: unknown) {
    const err = error as Error
    console.error("Delete media error:", err)
    return NextResponse.json({ error: err.message || "Failed to delete media" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdminAuth(CONTENT_WRITE_ROLES)
  if (gate.error) return gate.error

  const { id } = await params
  const body = await request.json()
  const prisma = getPrismaClient()

  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 })
  }

  try {
    const updated = await prisma.mediaAsset.update({
      where: { id },
      data: {
        altText: body.altText !== undefined ? body.altText : undefined,
        folder: body.folder !== undefined ? body.folder : undefined,
      },
    })

    return NextResponse.json({ media: updated, message: "Media updated successfully" })
  } catch (error: unknown) {
    const err = error as Error
    console.error("Update media error:", err)
    return NextResponse.json({ error: err.message || "Failed to update media" }, { status: 500 })
  }
}
