import type { Prisma } from "@prisma/client"
import type { Product, ProductCategory } from "@/lib/products"

export const productRelationsInclude = {
  gallery: {
    orderBy: {
      position: "asc" as const,
    },
  },
  specification: true,
  exportSeason: true,
  packaging: true,
  cartonSpecification: true,
  storage: true,
  exportedCountries: true,
} as const

type ProductRecord = Prisma.ProductGetPayload<{
  include: typeof productRelationsInclude
}>

type ProductImageRecord = NonNullable<ProductRecord["gallery"]>[number]
type ProductPackagingRecord = NonNullable<ProductRecord["packaging"]>[number]

type CategoryRecordLike = {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  subcategories?: Array<{
    id: string
    name: string
    slug: string
    products?: Product[]
  }>
}

function toOptionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined
}

export function mapProductRecord(record: ProductRecord): Product {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    categoryId: record.categoryId,
    subcategoryId: record.subcategoryId,
    description: record.description,
    shortDescription: record.shortDescription,
    image: record.imageUrl,
    gallery: Array.isArray(record.gallery) ? record.gallery.map((image: ProductImageRecord) => image.url) : undefined,
    specifications: {
      productName: record.specification?.productName ?? record.name,
      scientificName: toOptionalString(record.specification?.scientificName),
      category: record.specification?.category ?? "",
      origin: record.specification?.origin ?? "",
      countryOfOrigin: record.specification?.countryOfOrigin ?? "",
      variety: toOptionalString(record.specification?.variety),
      color: toOptionalString(record.specification?.color),
      shape: toOptionalString(record.specification?.shape),
      size: toOptionalString(record.specification?.size),
      diameter: toOptionalString(record.specification?.diameter),
      weight: toOptionalString(record.specification?.weight),
      taste: toOptionalString(record.specification?.taste),
      texture: toOptionalString(record.specification?.texture),
      moistureLevel: toOptionalString(record.specification?.moistureLevel),
      maturity: toOptionalString(record.specification?.maturity),
      qualityGrade: record.specification?.qualityGrade ?? "",
      exportGrade: record.specification?.exportGrade ?? "",
      shelfLife: record.specification?.shelfLife ?? "",
      storageTemperature: record.specification?.storageTemperature ?? "",
      humidityRecommendation: toOptionalString(record.specification?.humidityRecommendation),
      transportationMethod: record.specification?.transportationMethod ?? "",
      availability: record.specification?.availability ?? "",
    },
    exportSeason: {
      availableMonths: record.exportSeason?.availableMonths ?? [],
      peakExportMonths: record.exportSeason?.peakExportMonths ?? [],
      offSeason: record.exportSeason?.offSeason ?? [],
    },
    packaging: Array.isArray(record.packaging)
      ? record.packaging.map((packaging: ProductPackagingRecord) => ({
          type: packaging.type,
          description: packaging.description,
          image: toOptionalString(packaging.imageUrl),
        }))
      : [],
    cartonSpec: {
      cartonSize: record.cartonSpecification?.cartonSize ?? "",
      netWeight: record.cartonSpecification?.netWeight ?? "",
      grossWeight: record.cartonSpecification?.grossWeight ?? "",
      dimensions: record.cartonSpecification?.dimensions ?? "",
      piecesPerCarton: record.cartonSpecification?.piecesPerCarton ?? "",
      cartonsPerPallet: record.cartonSpecification?.cartonsPerPallet ?? "",
    },
    storage: {
      storageTemperature: record.storage?.storageTemperature ?? "",
      humidity: record.storage?.humidity ?? "",
      shippingMethod: record.storage?.shippingMethod ?? "",
      refrigeratedContainer: record.storage?.refrigeratedContainer ?? "",
      shelfLifeDuringShipping: record.storage?.shelfLifeDuringShipping ?? "",
    },
    exportedTo: Array.isArray(record.exportedCountries)
      ? record.exportedCountries.map((country) => ({
          name: country.name,
          code: country.code,
        }))
      : [],
    isBestSelling: Boolean(record.isBestSelling),
    isSeasonal: Boolean(record.isSeasonal),
  }
}

export function mapCategoryRecord(record: CategoryRecordLike): ProductCategory {
  const subcategories = Array.isArray(record.subcategories)
    ? record.subcategories.map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        products: Array.isArray(subcategory.products) ? subcategory.products : [],
      }))
    : []

  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    image: record.imageUrl,
    subcategories,
  }
}
