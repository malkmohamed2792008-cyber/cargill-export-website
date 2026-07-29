import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { companyInfo, certifications } from "@/lib/data"
import { products, productCategories, exportedCountries } from "@/lib/products"

function createClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to seed the database.")
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  })
}

const prisma = createClient()

async function seedCategories() {
  for (const category of productCategories) {
    await prisma.productCategory.upsert({
      where: { id: category.id },
      create: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.image,
      },
      update: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.image,
      },
    })

    for (const subcategory of category.subcategories ?? []) {
      await prisma.productSubcategory.upsert({
        where: { id: subcategory.id },
        create: {
          id: subcategory.id,
          name: subcategory.name,
          slug: subcategory.slug,
          categoryId: category.id,
        },
        update: {
          name: subcategory.name,
          slug: subcategory.slug,
          categoryId: category.id,
        },
      })
    }
  }
}

async function seedCertifications() {
  for (const certification of certifications) {
    await prisma.certification.upsert({
      where: { name: certification.name },
      create: {
        name: certification.name,
        issuer: certification.issuer,
        productId: null,
      },
      update: {
        issuer: certification.issuer,
        productId: null,
      },
    })
  }
}

async function seedProducts() {
  for (const product of products) {
    await prisma.$transaction(async (tx) => {
      await tx.product.upsert({
        where: { id: product.id },
        create: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          description: product.description,
          shortDescription: product.shortDescription,
          imageUrl: product.image,
          isBestSelling: product.isBestSelling,
          isSeasonal: product.isSeasonal,
        },
        update: {
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          description: product.description,
          shortDescription: product.shortDescription,
          imageUrl: product.image,
          isBestSelling: product.isBestSelling,
          isSeasonal: product.isSeasonal,
        },
      })

      if (product.gallery?.length) {
        await tx.productImage.deleteMany({
          where: { productId: product.id },
        })
        await tx.productImage.createMany({
          data: product.gallery.map((url, index) => ({
            productId: product.id,
            url,
            alt: `${product.name} image ${index + 1}`,
            position: index,
          })),
        })
      }

      await tx.productSpecification.upsert({
        where: { productId: product.id },
        create: {
          productId: product.id,
          productName: product.specifications.productName,
          scientificName: product.specifications.scientificName,
          category: product.specifications.category,
          origin: product.specifications.origin,
          countryOfOrigin: product.specifications.countryOfOrigin,
          variety: product.specifications.variety,
          color: product.specifications.color,
          shape: product.specifications.shape,
          size: product.specifications.size,
          diameter: product.specifications.diameter,
          weight: product.specifications.weight,
          taste: product.specifications.taste,
          texture: product.specifications.texture,
          moistureLevel: product.specifications.moistureLevel,
          maturity: product.specifications.maturity,
          qualityGrade: product.specifications.qualityGrade,
          exportGrade: product.specifications.exportGrade,
          shelfLife: product.specifications.shelfLife,
          storageTemperature: product.specifications.storageTemperature,
          humidityRecommendation: product.specifications.humidityRecommendation,
          transportationMethod: product.specifications.transportationMethod,
          availability: product.specifications.availability,
        },
        update: {
          productName: product.specifications.productName,
          scientificName: product.specifications.scientificName,
          category: product.specifications.category,
          origin: product.specifications.origin,
          countryOfOrigin: product.specifications.countryOfOrigin,
          variety: product.specifications.variety,
          color: product.specifications.color,
          shape: product.specifications.shape,
          size: product.specifications.size,
          diameter: product.specifications.diameter,
          weight: product.specifications.weight,
          taste: product.specifications.taste,
          texture: product.specifications.texture,
          moistureLevel: product.specifications.moistureLevel,
          maturity: product.specifications.maturity,
          qualityGrade: product.specifications.qualityGrade,
          exportGrade: product.specifications.exportGrade,
          shelfLife: product.specifications.shelfLife,
          storageTemperature: product.specifications.storageTemperature,
          humidityRecommendation: product.specifications.humidityRecommendation,
          transportationMethod: product.specifications.transportationMethod,
          availability: product.specifications.availability,
        },
      })

      await tx.productExportSeason.upsert({
        where: { productId: product.id },
        create: {
          productId: product.id,
          availableMonths: product.exportSeason.availableMonths,
          peakExportMonths: product.exportSeason.peakExportMonths,
          offSeason: product.exportSeason.offSeason,
        },
        update: {
          availableMonths: product.exportSeason.availableMonths,
          peakExportMonths: product.exportSeason.peakExportMonths,
          offSeason: product.exportSeason.offSeason,
        },
      })

      await tx.productCartonSpecification.upsert({
        where: { productId: product.id },
        create: {
          productId: product.id,
          cartonSize: product.cartonSpec.cartonSize,
          netWeight: product.cartonSpec.netWeight,
          grossWeight: product.cartonSpec.grossWeight,
          dimensions: product.cartonSpec.dimensions,
          piecesPerCarton: product.cartonSpec.piecesPerCarton,
          cartonsPerPallet: product.cartonSpec.cartonsPerPallet,
        },
        update: {
          cartonSize: product.cartonSpec.cartonSize,
          netWeight: product.cartonSpec.netWeight,
          grossWeight: product.cartonSpec.grossWeight,
          dimensions: product.cartonSpec.dimensions,
          piecesPerCarton: product.cartonSpec.piecesPerCarton,
          cartonsPerPallet: product.cartonSpec.cartonsPerPallet,
        },
      })

      await tx.productStorage.upsert({
        where: { productId: product.id },
        create: {
          productId: product.id,
          storageTemperature: product.storage.storageTemperature,
          humidity: product.storage.humidity,
          shippingMethod: product.storage.shippingMethod,
          refrigeratedContainer: product.storage.refrigeratedContainer,
          shelfLifeDuringShipping: product.storage.shelfLifeDuringShipping,
        },
        update: {
          storageTemperature: product.storage.storageTemperature,
          humidity: product.storage.humidity,
          shippingMethod: product.storage.shippingMethod,
          refrigeratedContainer: product.storage.refrigeratedContainer,
          shelfLifeDuringShipping: product.storage.shelfLifeDuringShipping,
        },
      })

      await tx.productPackaging.deleteMany({
        where: { productId: product.id },
      })
      if (product.packaging.length > 0) {
        await tx.productPackaging.createMany({
          data: product.packaging.map((packaging) => ({
            productId: product.id,
            type: packaging.type,
            description: packaging.description,
            imageUrl: packaging.image ?? null,
          })),
        })
      }

      await tx.productExportCountry.deleteMany({
        where: { productId: product.id },
      })
      if (product.exportedTo.length > 0) {
        await tx.productExportCountry.createMany({
          data: product.exportedTo.map((country) => {
            const match = exportedCountries.find((item) => item.code === country.code)
            return {
              productId: product.id,
              name: country.name,
              code: country.code,
              flag: match?.flag ?? null,
            }
          }),
        })
      }
    })
  }
}

async function main() {
  await seedCategories()
  await seedCertifications()
  await seedProducts()

  const [
    categoryCount,
    subcategoryCount,
    productCount,
    packagingCount,
    storageCount,
    certificationCount,
  ] = await Promise.all([
    prisma.productCategory.count(),
    prisma.productSubcategory.count(),
    prisma.product.count(),
    prisma.productPackaging.count(),
    prisma.productStorage.count(),
    prisma.certification.count(),
  ])

  console.log(
    JSON.stringify(
      {
        company: companyInfo.name,
        categories: categoryCount,
        subcategories: subcategoryCount,
        products: productCount,
        packagingRecords: packagingCount,
        storageRecords: storageCount,
        certifications: certificationCount,
      },
      null,
      2
    )
  )
}

main()
  .catch(async (error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
