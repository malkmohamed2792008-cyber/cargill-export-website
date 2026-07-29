import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getPrismaClient } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") // "quote" or "message"
  const id = searchParams.get("id")
  const status = searchParams.get("status")
  const page = searchParams.get("page") || "1"

  const prisma = getPrismaClient()

  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 })
  }

  try {
    const limit = 10
    const skip = (parseInt(page) - 1) * limit

    // Get single quote
    if (type === "quote" && id) {
      const quote = await prisma.quoteRequest.findUnique({
        where: { id },
      })
      if (!quote) {
        return NextResponse.json({ error: "Quote not found" }, { status: 404 })
      }
      return NextResponse.json({ quote })
    }

    // Get single message
    if (type === "message" && id) {
      const message = await prisma.contactMessage.findUnique({
        where: { id },
      })
      if (!message) {
        return NextResponse.json({ error: "Message not found" }, { status: 404 })
      }
      return NextResponse.json({ message })
    }

    // Get quotes list
    if (type === "quote") {
      const where: Record<string, unknown> = {}
      if (status && status !== "all") {
        where.status = status.toUpperCase()
      }

      const [quotes, total] = await Promise.all([
        prisma.quoteRequest.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.quoteRequest.count({ where }),
      ])

      return NextResponse.json({
        quotes,
        total,
        totalPages: Math.ceil(total / limit),
        page: parseInt(page),
      })
    }

    // Get messages list
    if (type === "message") {
      const where: Record<string, unknown> = {}
      if (status === "read") {
        where.isRead = true
      } else if (status === "unread") {
        where.isRead = false
      }

      const [messages, total] = await Promise.all([
        prisma.contactMessage.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.contactMessage.count({ where }),
      ])

      return NextResponse.json({
        messages,
        total,
        totalPages: Math.ceil(total / limit),
        page: parseInt(page),
      })
    }

    // Get counts
    const [quoteCount, messageCount, unreadMessageCount] = await Promise.all([
      prisma.quoteRequest.count({ where: { isArchived: false } }),
      prisma.contactMessage.count({ where: { isArchived: false } }),
      prisma.contactMessage.count({ where: { isRead: false, isArchived: false } }),
    ])

    return NextResponse.json({
      counts: {
        quotes: quoteCount,
        messages: messageCount,
        unreadMessages: unreadMessageCount,
      },
    })
  } catch (error) {
    console.error("Error fetching data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

// Update quote or message
export async function PUT(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const prisma = getPrismaClient()

  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { type, id, status, isRead, isArchived } = body

    if (type === "quote") {
      const quote = await prisma.quoteRequest.update({
        where: { id },
        data: {
          status: status || undefined,
          isArchived: isArchived !== undefined ? isArchived : undefined,
        },
      })
      return NextResponse.json({ quote })
    }

    if (type === "message") {
      const message = await prisma.contactMessage.update({
        where: { id },
        data: {
          isRead: isRead !== undefined ? isRead : undefined,
          isArchived: isArchived !== undefined ? isArchived : undefined,
        },
      })
      return NextResponse.json({ message })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("Error updating:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

// Delete quote or message (archive)
export async function DELETE(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const type = searchParams.get("type")
  const permanent = searchParams.get("permanent") === "true"

  const prisma = getPrismaClient()

  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 })
  }

  if (!id || !type) {
    return NextResponse.json({ error: "ID and type required" }, { status: 400 })
  }

  try {
    if (permanent) {
      // Permanent delete
      if (type === "quote") {
        await prisma.quoteRequest.delete({ where: { id } })
      } else if (type === "message") {
        await prisma.contactMessage.delete({ where: { id } })
      }
    } else {
      // Archive
      if (type === "quote") {
        await prisma.quoteRequest.update({
          where: { id },
          data: { isArchived: true },
        })
      } else if (type === "message") {
        await prisma.contactMessage.update({
          where: { id },
          data: { isArchived: true },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
