import { NextResponse } from "next/server"
import { getPrismaClient } from "@/lib/prisma"
import { CONTENT_WRITE_ROLES, requireAdminAuth } from "@/lib/admin-auth"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import crypto from "crypto"

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
}

const ALLOWED_TYPES = Object.keys(MIME_TO_EXT)
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(request: Request) {
  const gate = await requireAdminAuth(CONTENT_WRITE_ROLES)
  if (gate.error) return gate.error

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const rawFolder = (formData.get("folder") as string) || "general"
    const altText = (formData.get("altText") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type === "image/svg+xml") {
      return NextResponse.json(
        { error: "SVG files are blocked for security reasons to prevent XSS vulnerabilities." },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type '${file.type}' is not supported. Allowed formats: JPG, PNG, WebP, GIF, AVIF.` },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 10 MB limit." }, { status: 400 })
    }

    // Sanitize folder name to prevent path traversal
    const safeFolder = rawFolder.toLowerCase().replace(/[^a-z0-9_-]/g, "_") || "general"
    const uploadsBaseDir = path.join(process.cwd(), "public", "uploads")
    const uploadDir = path.join(uploadsBaseDir, safeFolder)

    if (!uploadDir.startsWith(uploadsBaseDir)) {
      return NextResponse.json({ error: "Invalid upload directory target" }, { status: 400 })
    }

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const ext = MIME_TO_EXT[file.type] || ".jpg"
    const baseName = path.basename(file.name, path.extname(file.name)).replace(/[^a-zA-Z0-9_-]/g, "_") || "image"
    const uniqueHash = crypto.randomBytes(6).toString("hex")
    const filename = `${baseName}_${uniqueHash}${ext}`
    const filepath = path.join(uploadDir, filename)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await writeFile(filepath, buffer)

    const publicUrl = `/uploads/${safeFolder}/${filename}`

    const prisma = getPrismaClient()
    if (!prisma) {
      return NextResponse.json(
        {
          message: "File uploaded successfully (database unavailable)",
          url: publicUrl,
        },
        { status: 201 }
      )
    }

    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        filename,
        originalName: file.name,
        url: publicUrl,
        mimeType: file.type,
        size: file.size,
        altText: altText || baseName,
        folder: safeFolder,
      },
    })

    return NextResponse.json({ media: mediaAsset, message: "File uploaded successfully" }, { status: 201 })
  } catch (error: unknown) {
    const err = error as Error
    console.error("Upload error:", err)
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 })
  }
}
