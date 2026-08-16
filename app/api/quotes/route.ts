import { NextResponse } from "next/server"
import { getPrismaClient } from "@/lib/prisma"
import { isValidEmail, isValidPhone } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const company = typeof body.company === "string" ? body.company.trim() : ""
    const country = typeof body.country === "string" ? body.country.trim() : ""
    const phone = typeof body.phone === "string" ? body.phone.trim() : ""
    const productId = typeof body.productId === "string" ? body.productId.trim() : ""
    const productName = typeof body.productName === "string" ? body.productName.trim() : ""
    const quantity = typeof body.quantity === "string" ? body.quantity.trim() : ""
    const packaging = typeof body.packaging === "string" ? body.packaging.trim() : ""
    const rawMessage = typeof body.message === "string" ? body.message.trim() : ""

    if (!name || !email || !rawMessage) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 })
    }

    const details: string[] = []
    if (quantity) details.push(`Quantity: ${quantity}`)
    if (packaging) details.push(`Packaging: ${packaging}`)
    const message =
      details.length > 0 ? `${rawMessage}\n\n---\n${details.join("\n")}` : rawMessage

    const prisma = getPrismaClient()
    if (!prisma) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
    }

    const quote = await prisma.quoteRequest.create({
      data: {
        productId: productId || null,
        productName: productName || null,
        name,
        email,
        company: company || null,
        country: country || null,
        phone: phone || null,
        message,
      },
    })

    return NextResponse.json(
      { message: "Quote request submitted successfully", id: quote.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Quote form error:", error)
    return NextResponse.json({ error: "Failed to submit quote request" }, { status: 500 })
  }
}
