import {
  exportedCountries,
  getBestSellingProducts,
  getProductBySlug,
  getProductsByCategory,
  getProductsBySubcategory,
  getRelatedProducts,
  getSeasonalProducts,
  productCategories,
  products,
  searchProducts,
  type Product,
  type ProductCategory,
} from "@/lib/products"

export interface CatalogRepository {
  listProducts(): Product[]
  listCategories(): ProductCategory[]
  getProductBySlug(slug: string): Product | undefined
  getProductsByCategory(categoryId: string): Product[]
  getProductsBySubcategory(categoryId: string, subcategoryId: string): Product[]
  getBestSellingProducts(): Product[]
  getSeasonalProducts(): Product[]
  getRelatedProducts(product: Product, limit?: number): Product[]
  searchProducts(query: string): Product[]
}

export const staticCatalogRepository: CatalogRepository = {
  listProducts: () => products,
  listCategories: () => productCategories,
  getProductBySlug,
  getProductsByCategory,
  getProductsBySubcategory,
  getBestSellingProducts,
  getSeasonalProducts,
  getRelatedProducts,
  searchProducts,
}

export const catalogRepository = staticCatalogRepository

export { exportedCountries }
