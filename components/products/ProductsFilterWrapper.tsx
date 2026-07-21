"use client"

import { Suspense } from "react"
import ProductsFilter from "./ProductsFilter"

export default function ProductsFilterWrapper() {
  return (
    <Suspense fallback={<div className="py-6 bg-gray-50 border-b animate-pulse" />}>
      <ProductsFilter />
    </Suspense>
  )
}