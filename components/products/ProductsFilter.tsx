"use client"

import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import { productCategories } from "@/lib/products"
import { FiX } from "react-icons/fi"

export default function ProductsFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeCategory = searchParams.get("category")

  const handleCategoryClick = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categorySlug) {
      params.set("category", categorySlug)
    } else {
      params.delete("category")
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <section className="py-6 bg-gray-50 border-b">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !activeCategory
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              All Products
            </button>
            {productCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.slug
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-500">
            {activeCategory ? (
              <span>
                Filtering by: <span className="font-medium text-primary">{productCategories.find(c => c.slug === activeCategory)?.name}</span>
              </span>
            ) : (
              <span>Showing all products</span>
            )}
          </div>
        </div>

        {/* Active Filter Indicator */}
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2"
          >
            <span className="text-sm text-gray-600">Active filter:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {productCategories.find(c => c.slug === activeCategory)?.name}
              <button
                onClick={() => handleCategoryClick(null)}
                className="ml-1 hover:text-primary-dark"
                aria-label="Clear filter"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          </motion.div>
        )}
      </div>
    </section>
  )
}