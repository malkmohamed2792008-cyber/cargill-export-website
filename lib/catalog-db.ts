import { getPrismaClient } from "@/lib/prisma"
import { staticCatalogRepository } from "@/lib/catalog"
import { mapCategoryRecord, mapProductRecord, productRelationsInclude } from "@/lib/catalog-mappers"
import type { Product, ProductCategory } from "@/lib/products"

export interface AsyncCatalogRepository {
  listProducts(): Promise<Product[]>
  listCategories(): Promise<ProductCategory[]>
  getProductBySlug(slug: string): Promise<Product | undefined>
  getProductsByCategory(categoryId: string): Promise<Product[]>
  getProductsBySubcategory(categoryId: string, subcategoryId: string): Promise<Product[]>
  getBestSellingProducts(): Promise<Product[]>
  getSeasonalProducts(): Promise<Product[]>
  getRelatedProducts(product: Product, limit?: number): Promise<Product[]>
  searchProducts(query: string): Promise<Product[]>
}

function normalize(value: string) {
  return value.toLowerCase()
}

function matchesQuery(product: Product, query: string) {
  const needle = normalize(query)
  return [
    product.name,
    product.shortDescription,
    product.description,
    product.categoryId,
    product.subcategoryId,
    product.slug,
    product.specifications.category,
  ].some((value) => normalize(value).includes(needle))
}

function createAsyncFallback(): AsyncCatalogRepository {
  return {
    listProducts: async () => staticCatalogRepository.listProducts(),
    listCategories: async () => staticCatalogRepository.listCategories(),
    getProductBySlug: async (slug) => staticCatalogRepository.getProductBySlug(slug),
    getProductsByCategory: async (categoryId) => staticCatalogRepository.getProductsByCategory(categoryId),
    getProductsBySubcategory: async (categoryId, subcategoryId) =>
      staticCatalogRepository.getProductsBySubcategory(categoryId, subcategoryId),
    getBestSellingProducts: async () => staticCatalogRepository.getBestSellingProducts(),
    getSeasonalProducts: async () => staticCatalogRepository.getSeasonalProducts(),
    getRelatedProducts: async (product, limit) =>
      staticCatalogRepository.getRelatedProducts(product, limit),
    searchProducts: async (query) => staticCatalogRepository.searchProducts(query),
  }
}

async function buildPrismaRepository(): Promise<AsyncCatalogRepository | null> {
  const prisma = getPrismaClient()

  if (!prisma) {
    return null
  }

  const client = prisma

  try {
    const count = await client.product.count()
    if (count === 0) {
      return null
    }
  } catch {
    return null
  }

  async function fetchAllProducts() {
    return client.product.findMany({
      include: productRelationsInclude,
      orderBy: {
        name: "asc",
      },
    })
  }

  async function fetchAllCategories() {
    const [categories, products] = await Promise.all([
      client.productCategory.findMany({
        include: {
          subcategories: {
            orderBy: {
              name: "asc",
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      fetchAllProducts(),
    ])

    const mappedProducts = products.map(mapProductRecord)
    const productsBySubcategory = new Map<string, Product[]>()

    for (const product of mappedProducts) {
      const bucket = productsBySubcategory.get(product.subcategoryId) ?? []
      bucket.push(product)
      productsBySubcategory.set(product.subcategoryId, bucket)
    }

    return categories.map((category) =>
      mapCategoryRecord({
        ...category,
        subcategories: category.subcategories.map((subcategory) => ({
          ...subcategory,
          products: productsBySubcategory.get(subcategory.id) ?? [],
        })),
      })
    )
  }

  return {
    listProducts: async () => {
      const records = await fetchAllProducts()
      return records.map(mapProductRecord)
    },
    listCategories: fetchAllCategories,
    getProductBySlug: async (slug: string) => {
      const record = await prisma.product.findUnique({
        where: { slug },
        include: productRelationsInclude,
      })
      return record ? mapProductRecord(record) : undefined
    },
    getProductsByCategory: async (categoryId: string) => {
      const products = await fetchAllProducts()
      return products.map(mapProductRecord).filter((product) => product.categoryId === categoryId)
    },
    getProductsBySubcategory: async (categoryId: string, subcategoryId: string) => {
      const products = await fetchAllProducts()
      return products
        .map(mapProductRecord)
        .filter((product) => product.categoryId === categoryId && product.subcategoryId === subcategoryId)
    },
    getBestSellingProducts: async () => {
      const products = await fetchAllProducts()
      return products.map(mapProductRecord).filter((product) => product.isBestSelling)
    },
    getSeasonalProducts: async () => {
      const products = await fetchAllProducts()
      return products.map(mapProductRecord).filter((product) => product.isSeasonal)
    },
    getRelatedProducts: async (product: Product, limit = 4) => {
      const products = await fetchAllProducts()
      const mappedProducts = products.map(mapProductRecord)
      const sameSubcategory = mappedProducts.filter(
        (candidate) =>
          candidate.id !== product.id &&
          candidate.categoryId === product.categoryId &&
          candidate.subcategoryId === product.subcategoryId
      )
      const sameCategory = mappedProducts.filter(
        (candidate) => candidate.id !== product.id && candidate.categoryId === product.categoryId
      )
      return [...sameSubcategory, ...sameCategory.filter((candidate) => candidate.subcategoryId !== product.subcategoryId)].slice(0, limit)
    },
    searchProducts: async (query: string) => {
      const products = await fetchAllProducts()
      return products.map(mapProductRecord).filter((product) => matchesQuery(product, query))
    },
  }
}

export async function getCatalogRepository(): Promise<AsyncCatalogRepository> {
  const prismaRepository = await buildPrismaRepository()
  return prismaRepository ?? createAsyncFallback()
}
