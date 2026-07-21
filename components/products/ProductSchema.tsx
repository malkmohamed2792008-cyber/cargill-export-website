"use client"

import { Product } from "@/lib/products"

interface ProductSchemaProps {
  product: Product
}

export default function ProductSchema({ product }: ProductSchemaProps) {
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
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: product.exportedTo.map((c) => c.code),
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
    additionalProperty: [
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
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}