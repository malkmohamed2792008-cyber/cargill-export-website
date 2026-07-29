import { Metadata } from "next"
import ProductsHero from "@/components/products/ProductsHero"
import ProductsSearch from "@/components/products/ProductsSearch"
import ProductsFilterWrapper from "@/components/products/ProductsFilterWrapper"
import ProductsCategories from "@/components/products/ProductsCategories"
import ProductsFeatured from "@/components/products/ProductsFeatured"
import ProductsCTA from "@/components/products/ProductsCTA"
import { seoData } from "@/lib/data"
import { getCatalogRepository } from "@/lib/catalog-db"

export const metadata: Metadata = {
  title: seoData.products?.title || "Products - CARGILL | Premium Agricultural & Frozen Food Products",
  description: seoData.products?.description || "Explore our comprehensive range of premium Egyptian agricultural products including fresh fruits, vegetables, frozen foods, dry goods, and canned products.",
  keywords: seoData.products?.keywords || "Fresh Fruits, Fresh Vegetables, Frozen Foods, Dry Foods, Canned Foods, Egyptian Export",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: seoData.products?.title || "Products - CARGILL",
    description: seoData.products?.description || "Explore our comprehensive range of premium Egyptian agricultural products including fresh fruits, vegetables, frozen foods, dry goods, and canned products.",
    url: "/products",
    siteName: "CARGILL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seoData.products?.title || "Products - CARGILL",
    description: seoData.products?.description || "Explore our comprehensive range of premium Egyptian agricultural products including fresh fruits, vegetables, frozen foods, dry goods, and canned products.",
  },
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subcategory?: string; search?: string }>
}) {
  const params = await searchParams
  const category = params?.category
  const subcategory = params?.subcategory
  const search = params?.search

  const catalog = await getCatalogRepository()
  const [categories, bestSellingProducts, seasonalProducts, allProducts] = await Promise.all([
    catalog.listCategories(),
    catalog.getBestSellingProducts(),
    catalog.getSeasonalProducts(),
    catalog.listProducts(),
  ])

  return (
    <>
      <ProductsHero />
      <ProductsSearch products={allProducts} />
      <ProductsFilterWrapper categories={categories} />
      <ProductsCategories categories={categories} />
      <ProductsFeatured
        category={category}
        subcategory={subcategory}
        search={search}
        bestSellingProducts={bestSellingProducts}
        seasonalProducts={seasonalProducts}
        allProducts={allProducts}
      />
      <ProductsCTA />
    </>
  )
}
