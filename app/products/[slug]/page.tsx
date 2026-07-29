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
import { getCatalogRepository } from "@/lib/catalog-db"

// Generate static params for all products and categories
export async function generateStaticParams() {
  const catalog = await getCatalogRepository()
  // Include both products and categories
  const productParams = (await catalog.listProducts()).map((product) => ({
    slug: product.slug,
  }))
  const categoryParams = (await catalog.listCategories()).map((category) => ({
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
  const catalog = await getCatalogRepository()

  // Check if it's a category
  const category = (await catalog.listCategories()).find((c) => c.slug === slug)
  if (category) {
    return {
      title: `${category.name} - CARGILL | Premium Egyptian Products`,
      description: category.description,
      keywords: `${category.name} export, Egyptian ${category.name.toLowerCase()}, CARGILL products`,
      alternates: {
        canonical: `/products/${category.slug}`,
      },
      openGraph: {
        title: `${category.name} - CARGILL`,
        description: category.description,
        url: `/products/${category.slug}`,
        siteName: "CARGILL",
        type: "website",
        images: [
          {
            url: category.image,
            width: 1200,
            height: 630,
            alt: category.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${category.name} - CARGILL`,
        description: category.description,
      },
    }
  }

  // Check if it's a product
  const product = await catalog.getProductBySlug(slug)
  if (!product) {
    return {
      title: "Product Not Found - CARGILL",
    }
  }

  return {
    title: `${product.name} - CARGILL | Premium Egyptian ${product.specifications.category}`,
    description: product.description,
    keywords: `${product.name} export, Egyptian ${product.name.toLowerCase()}, ${product.specifications.category} export, CARGILL products`,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} - CARGILL`,
      description: product.shortDescription,
      url: `/products/${product.slug}`,
      siteName: "CARGILL",
      type: "article",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - CARGILL`,
      description: product.shortDescription,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const catalog = await getCatalogRepository()

  // First check if it's a category
  const category = (await catalog.listCategories()).find((c) => c.slug === slug)
  if (category) {
    const categoryProducts = await catalog.getProductsByCategory(category.id)
    return <CategoryPage category={category} products={categoryProducts} />
  }

  // Then check if it's a product
  const product = await catalog.getProductBySlug(slug)
  if (!product) {
    notFound()
  }

  // Get related products
  const relatedProducts = await catalog.getRelatedProducts(product, 4)

  return (
    <>
      <ProductSchema product={product} category={category ?? undefined} />
      <ProductHero product={product} category={category} />
      <ProductGallery product={product} />
      <ProductOverview product={product} />
      <ProductSpecifications product={product} />
      <ProductExportSeason product={product} />
      <ProductPackaging product={product} />
      <ProductExportedTo product={product} />
      <ProductRelated relatedProducts={relatedProducts} />
      <ProductQuote product={product} />
    </>
  )
}
