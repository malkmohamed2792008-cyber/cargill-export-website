import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getPrismaClient } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const prisma = getPrismaClient()

  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 })
  }

  try {
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
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
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

    // Check if product exists
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check for duplicate slug (excluding current product)
    const duplicate = await prisma.product.findFirst({
      where: { slug, NOT: { id } },
    })
    if (duplicate) {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 })
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        categoryId,
        subcategoryId,
        description,
        shortDescription,
        imageUrl,
        isBestSelling: isBestSelling || false,
        isSeasonal: isSeasonal || false,
      },
    })

    // Update specification - delete and recreate
    await prisma.productSpecification.deleteMany({ where: { productId: id } })
    if (specification) {
      await prisma.productSpecification.create({
        data: {
          productId: id,
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
      })
    }

    // Update export season
    await prisma.productExportSeason.deleteMany({ where: { productId: id } })
    if (exportSeason && exportSeason.availableMonths?.length) {
      await prisma.productExportSeason.create({
        data: {
          productId: id,
          availableMonths: exportSeason.availableMonths,
          peakExportMonths: exportSeason.peakExportMonths || [],
          offSeason: exportSeason.offSeason || [],
        },
      })
    }

    // Update packaging
    await prisma.productPackaging.deleteMany({ where: { productId: id } })
    if (packaging && packaging.length > 0 && packaging[0].type) {
      await prisma.productPackaging.createMany({
        data: packaging.map((p: { type: string; description: string; imageUrl: string }) => ({
          productId: id,
          type: p.type,
          description: p.description,
          imageUrl: p.imageUrl,
        })),
      })
    }

    // Update carton specification
    await prisma.productCartonSpecification.deleteMany({ where: { productId: id } })
    if (cartonSpec && cartonSpec.cartonSize) {
      await prisma.productCartonSpecification.create({
        data: {
          productId: id,
          cartonSize: cartonSpec.cartonSize,
          netWeight: cartonSpec.netWeight,
          grossWeight: cartonSpec.grossWeight,
          dimensions: cartonSpec.dimensions,
          piecesPerCarton: cartonSpec.piecesPerCarton,
          cartonsPerPallet: cartonSpec.cartonsPerPallet,
        },
      })
    }

    // Update storage
    await prisma.productStorage.deleteMany({ where: { productId: id } })
    if (storage && storage.storageTemperature) {
      await prisma.productStorage.create({
        data: {
          productId: id,
          storageTemperature: storage.storageTemperature,
          humidity: storage.humidity,
          shippingMethod: storage.shippingMethod,
          refrigeratedContainer: storage.refrigeratedContainer,
          shelfLifeDuringShipping: storage.shelfLifeDuringShipping,
        },
      })
    }

    // Update exported countries
    await prisma.productExportCountry.deleteMany({ where: { productId: id } })
    if (exportedTo && exportedTo.length > 0) {
      await prisma.productExportCountry.createMany({
        data: exportedTo.map((c: { name: string; code: string }) => ({
          productId: id,
          name: c.name,
          code: c.code,
        })),
      })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}
