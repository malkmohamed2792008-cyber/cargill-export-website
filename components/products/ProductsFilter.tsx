"use client"

import { motion } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import type { ProductCategory } from "@/lib/products"
import { FiX } from "react-icons/fi"
import { getProductCollectionHref } from "@/lib/product-utils"

interface ProductsFilterProps {
  categories: ProductCategory[]
}

export default function ProductsFilter({ categories }: ProductsFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeCategory = searchParams.get("category")
  const activeSubcategory = searchParams.get("subcategory")
  const categoryData = categories.find((category) => category.slug === activeCategory)

  const handleCategoryClick = (categorySlug: string | null) => {
    if (!categorySlug) {
      router.push("/products")
      return
    }

    router.push(getProductCollectionHref(categorySlug))
  }

  const handleSubcategoryClick = (subcategorySlug: string | null) => {
    router.push(getProductCollectionHref(activeCategory, subcategorySlug))
  }

  return (
    <section className="py-6 bg-gray-50 border-b">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategoryClick(null)}
              aria-pressed={!activeCategory}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !activeCategory
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                aria-pressed={activeCategory === category.slug}
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
                Filtering by: <span className="font-medium text-primary">{categories.find(c => c.slug === activeCategory)?.name}</span>
              </span>
            ) : (
              <span>Showing all products</span>
            )}
          </div>
        </div>

        {categoryData?.subcategories && categoryData.subcategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {categoryData.subcategories.map((subcategory) => (
              <button
                type="button"
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory.slug)}
                aria-pressed={activeSubcategory === subcategory.slug}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeSubcategory === subcategory.slug
                    ? "bg-accent text-primary-dark"
                    : "bg-white text-gray-600 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {subcategory.name}
              </button>
            ))}
            {activeSubcategory && (
              <button
                type="button"
                onClick={() => handleSubcategoryClick(null)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-600 hover:bg-primary/10 hover:text-primary"
              >
                Clear subcategory
              </button>
            )}
          </div>
        )}

        {/* Active Filter Indicator */}
        {(activeCategory || activeSubcategory) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2"
          >
            <span className="text-sm text-gray-600">Active filter:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {activeCategory && categories.find((c) => c.slug === activeCategory)?.name}
              {activeCategory && activeSubcategory ? " / " : ""}
              {activeSubcategory && categoryData?.subcategories?.find((s) => s.slug === activeSubcategory)?.name}
              <button
                type="button"
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
