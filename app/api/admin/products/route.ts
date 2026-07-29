import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getPrismaClient } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  const prisma = getPrismaClient()

  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 })
  }

  try {
    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          subcategory: true,
          gallery: { orderBy: { position: "asc" } },
          specification: true,
          exportSeason: true,
          packaging: true,
          cartonSpecification: true,
          storage: true,
          exportedCountries: true,
        },
      })

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      return NextResponse.json({ product })
    }

    return NextResponse.json({ error: "Product ID required" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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
    const {
      name,
      slug,
      categoryId,
      subcategoryId,
      description,
      shortDescription,
      imageUrl,
      isBestSelling,
      isSeasonal,
      specification,
      exportSeason,
      packaging,
      cartonSpec,
      storage,
      exportedTo,
    } = body

    // Check for duplicate slug
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 })
    }

    // Generate unique ID
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create product with related records
    const product = await prisma.product.create({
      data: {
        id: productId,
        name,
        slug,
        categoryId,
        subcategoryId,
        description,
        shortDescription,
        imageUrl,
        isBestSelling: isBestSelling || false,
        isSeasonal: isSeasonal || false,
        specification: specification
          ? {
              create: {
                productName: specification.productName || name,
                scientificName: specification.scientificName,
                category: specification.category || "",
                origin: specification.origin || "",
                countryOfOrigin: specification.countryOfOrigin || "Egypt",
                variety: specification.variety,
                color: specification.color,
                shape: specification.shape,
                size: specification.size,
                diameter: specification.diameter,
                weight: specification.weight,
                taste: specification.taste,
                texture: specification.texture,
                moistureLevel: specification.moistureLevel,
                maturity: specification.maturity,
                qualityGrade: specification.qualityGrade || "Grade A",
                exportGrade: specification.exportGrade || "Grade A",
                shelfLife: specification.shelfLife || "",
                storageTemperature: specification.storageTemperature || "",
                humidityRecommendation: specification.humidityRecommendation,
                transportationMethod: specification.transportationMethod || "Sea",
                availability: specification.availability || "In Stock",
              },
            }
          : undefined,
        exportSeason:
          exportSeason && exportSeason.availableMonths?.length
            ? {
                create: {
                  availableMonths: exportSeason.availableMonths,
                  peakExportMonths: exportSeason.peakExportMonths || [],
                  offSeason: exportSeason.offSeason || [],
                },
              }
            : undefined,
        packaging:
          packaging && packaging.length > 0 && packaging[0].type
            ? {
                create: packaging.map((p: { type: string; description: string; imageUrl: string }) => ({
                  type: p.type,
                  description: p.description,
                  imageUrl: p.imageUrl,
                })),
              }
            : undefined,
        cartonSpecification: cartonSpec?.cartonSize
          ? {
              create: {
                cartonSize: cartonSpec.cartonSize,
                netWeight: cartonSpec.netWeight,
                grossWeight: cartonSpec.grossWeight,
                dimensions: cartonSpec.dimensions,
                piecesPerCarton: cartonSpec.piecesPerCarton,
                cartonsPerPallet: cartonSpec.cartonsPerPallet,
              },
            }
            : undefined,
        storage: storage?.storageTemperature
          ? {
              create: {
                storageTemperature: storage.storageTemperature,
                humidity: storage.humidity,
                shippingMethod: storage.shippingMethod,
                refrigeratedContainer: storage.refrigeratedContainer,
                shelfLifeDuringShipping: storage.shelfLifeDuringShipping,
              },
            }
          : undefined,
        exportedCountries:
          exportedTo && exportedTo.length > 0
            ? {
                create: exportedTo.map((c: { name: string; code: string }) => ({
                  name: c.name,
                  code: c.code,
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        subcategory: true,
      },
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
