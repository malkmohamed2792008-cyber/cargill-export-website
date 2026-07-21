import { Metadata } from "next"
import { notFound } from "next/navigation"
import ProductHero from "@/components/products/ProductHero"
import ProductGallery from "@/components/products/ProductGallery"
import ProductOverview from "@/components/products/ProductOverview"
import ProductSpecifications from "@/components/products/ProductSpecifications"
import ProductExportSeason from "@/components/products/ProductExportSeason"
import ProductPackaging from "@/components/products/ProductPackaging"
import ProductExportedTo from "@/components/products/ProductExportedTo"
import ProductRelated from "@/components/products/ProductRelated"
import ProductQuote from "@/components/products/ProductQuote"
import ProductSchema from "@/components/products/ProductSchema"
import CategoryPage from "@/components/products/CategoryPage"
import { getProductBySlug, products, productCategories, getProductsByCategory } from "@/lib/products"

// Generate static params for all products and categories
export async function generateStaticParams() {
  // Include both products and categories
  const productParams = products.map((product) => ({
    slug: product.slug,
  }))
  const categoryParams = productCategories.map((category) => ({
    slug: category.slug,
  }))
  return [...productParams, ...categoryParams]
}

// Generate metadata for each product
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  // Check if it's a category
  const category = productCategories.find((c) => c.slug === slug)
  if (category) {
    return {
      title: `${category.name} - CARGILL | Premium Egyptian Products`,
      description: category.description,
      keywords: `${category.name} export, Egyptian ${category.name.toLowerCase()}, CARGILL products`,
      openGraph: {
        title: `${category.name} - CARGILL`,
        description: category.description,
        images: [category.image],
      },
    }
  }

  // Check if it's a product
  const product = getProductBySlug(slug)
  if (!product) {
    return {
      title: "Product Not Found - CARGILL",
    }
  }

  return {
    title: `${product.name} - CARGILL | Premium Egyptian ${product.specifications.category}`,
    description: product.description,
    keywords: `${product.name} export, Egyptian ${product.name.toLowerCase()}, ${product.specifications.category} export, CARGILL products`,
    openGraph: {
      title: `${product.name} - CARGILL`,
      description: product.shortDescription,
      images: [product.image],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // First check if it's a category
  const category = productCategories.find((c) => c.slug === slug)
  if (category) {
    const categoryProducts = getProductsByCategory(category.id)
    return <CategoryPage category={category} products={categoryProducts} />
  }

  // Then check if it's a product
  const product = getProductBySlug(slug)
  if (!product) {
    notFound()
  }

  return (
    <>
      <ProductSchema product={product} />
      <ProductHero product={product} />
      <ProductGallery product={product} />
      <ProductOverview product={product} />
      <ProductSpecifications product={product} />
      <ProductExportSeason product={product} />
      <ProductPackaging product={product} />
      <ProductExportedTo product={product} />
      <ProductRelated product={product} />
      <ProductQuote product={product} />
    </>
  )
}