import { Metadata } from "next"
import ProductsHero from "@/components/products/ProductsHero"
import ProductsSearch from "@/components/products/ProductsSearch"
import ProductsFilterWrapper from "@/components/products/ProductsFilterWrapper"
import ProductsCategories from "@/components/products/ProductsCategories"
import ProductsFeatured from "@/components/products/ProductsFeatured"
import ProductsCTA from "@/components/products/ProductsCTA"
import { seoData } from "@/lib/data"

export const metadata: Metadata = {
  title: seoData.products?.title || "Products - CARGILL | Premium Agricultural & Frozen Food Products",
  description: seoData.products?.description || "Explore our comprehensive range of premium Egyptian agricultural products including fresh fruits, vegetables, frozen foods, dry goods, and canned products.",
  keywords: seoData.products?.keywords || "Fresh Fruits, Fresh Vegetables, Frozen Foods, Dry Foods, Canned Foods, Egyptian Export",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const category = params?.category

  return (
    <>
      <ProductsHero />
      <ProductsSearch />
      <ProductsFilterWrapper />
      <ProductsCategories />
      <ProductsFeatured category={category} />
      <ProductsCTA />
    </>
  )
}