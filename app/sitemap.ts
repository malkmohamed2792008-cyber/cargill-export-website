import type { MetadataRoute } from "next"
import { getCatalogRepository } from "@/lib/catalog-db"

const baseUrl = "https://cargill-eg.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalogRepository()

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/products",
    "/contact",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }))

  const categories = await catalog.listCategories()
  const products = await catalog.listProducts()

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/products/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
