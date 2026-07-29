"use client"

import type { Product, ProductCategory } from "@/lib/products"
import { generateBreadcrumbSchema } from "@/lib/utils"

interface ProductSchemaProps {
  product: Product
  category?: ProductCategory
}

export default function ProductSchema({ product, category }: ProductSchemaProps) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    {
      name: "Home",
      url: "https://cargill-eg.com",
    },
    {
      name: "Products",
      url: "https://cargill-eg.com/products",
    },
    ...(category
      ? [
          {
            name: category.name,
            url: `https://cargill-eg.com/products/${category.slug}`,
          },
        ]
      : []),
    {
      name: product.name,
      url: `https://cargill-eg.com/products/${product.slug}`,
    },
  ])

  const additionalProperties = [
    {
      "@type": "PropertyValue",
      name: "Quality Grade",
      value: product.specifications.qualityGrade,
    },
    {
      "@type": "PropertyValue",
      name: "Export Grade",
      value: product.specifications.exportGrade,
    },
    {
      "@type": "PropertyValue",
      name: "Shelf Life",
      value: product.specifications.shelfLife,
    },
    {
      "@type": "PropertyValue",
      name: "Storage Temperature",
      value: product.specifications.storageTemperature,
    },
    {
      "@type": "PropertyValue",
      name: "Variety",
      value: product.specifications.variety,
    },
    {
      "@type": "PropertyValue",
      name: "Origin",
      value: product.specifications.origin,
    },
  ].filter((property) => Boolean(property.value))

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "CARGILL",
    },
    manufacturer: {
      "@type": "Organization",
      name: "CARGILL",
      address: {
        "@type": "PostalAddress",
        addressCountry: "EG",
      },
    },
    countryOfOrigin: {
      "@type": "Country",
      name: "Egypt",
    },
    category: product.specifications.category,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: product.exportedTo.map((country) => ({
          "@type": "DefinedRegion",
          addressCountry: country.code,
        })),
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
    additionalProperty: additionalProperties,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
