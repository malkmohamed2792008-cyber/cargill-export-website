import { NextResponse } from "next/server"
import { getPrismaClient } from "@/lib/prisma"
import { isValidEmail, isValidPhone } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Honeypot
    if (body.website) {
      return NextResponse.json({ message: "Message sent successfully" }, { status: 201 })
    }

    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const phone = typeof body.phone === "string" ? body.phone.trim() : ""
    const company = typeof body.company === "string" ? body.company.trim() : ""
    const subject = typeof body.subject === "string" ? body.subject.trim() : ""
    const message = typeof body.message === "string" ? body.message.trim() : ""

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Name, email, subject, and message are required" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 })
    }

    const prisma = getPrismaClient()
    if (!prisma) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject,
        message,
      },
    })

    return NextResponse.json(
      { message: "Message sent successfully", id: contactMessage.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
