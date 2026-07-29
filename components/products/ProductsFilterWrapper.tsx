"use client"

import { Suspense } from "react"
import ProductsFilter from "./ProductsFilter"
import type { ProductCategory } from "@/lib/products"

interface ProductsFilterWrapperProps {
  categories: ProductCategory[]
}

export default function ProductsFilterWrapper({ categories }: ProductsFilterWrapperProps) {
  return (
    <Suspense fallback={<div className="py-6 bg-gray-50 border-b animate-pulse" />}>
      <ProductsFilter categories={categories} />
    </Suspense>
  )
}
