"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { Product } from "@/lib/products"
import { FiArrowRight, FiStar, FiCalendar } from "react-icons/fi"
import ProductCard from "./ProductCard"
import { filterCatalogProducts } from "@/lib/product-utils"

interface ProductsFeaturedProps {
  category?: string | null
  subcategory?: string | null
  search?: string | null
  bestSellingProducts: Product[]
  seasonalProducts: Product[]
  allProducts: Product[]
}

export default function ProductsFeatured({
  category,
  subcategory,
  search,
  bestSellingProducts,
  seasonalProducts,
  allProducts,
}: ProductsFeaturedProps) {
  const filterOptions = useMemo(
    () => ({
      category,
      subcategory,
      search,
    }),
    [category, search, subcategory]
  )

  const featured = useMemo(() => {
    const filtered = filterCatalogProducts(allProducts, filterOptions).slice(0, 6)

    if (category) {
      return filtered.length > 0
        ? filtered
        : filterCatalogProducts(allProducts, { category, search }).slice(0, 6)
    }

    return filtered
  }, [category, filterOptions, search, allProducts])

  const visibleBestSelling = useMemo(
    () => filterCatalogProducts(bestSellingProducts, filterOptions).slice(0, 4),
    [bestSellingProducts, filterOptions]
  )

  const visibleSeasonal = useMemo(
    () => filterCatalogProducts(seasonalProducts, filterOptions).slice(0, 4),
    [filterOptions, seasonalProducts]
  )

  return (
    <section className="py-20 bg-white">
      <div className="container-main">
        {/* Best Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiStar className="w-5 h-5 text-accent" />
                <span className="text-accent font-medium">Most Popular</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark">
                Best Selling Products
              </h2>
            </div>
            <Link href="/products/fresh-fruits" className="hidden md:flex items-center text-primary font-medium hover:text-accent transition-colors">
              View All <FiArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleBestSelling.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} showBestSellerBadge />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/products/fresh-fruits"
              className="inline-flex items-center text-primary font-medium hover:text-accent transition-colors"
            >
              View All <FiArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Seasonal Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className="w-5 h-5 text-orange-500" />
                <span className="text-orange-500 font-medium">Currently in Season</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark">
                Seasonal Products
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleSeasonal.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} showSeasonalBadge seasonalBadgeLabel="In Season" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Featured Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our complete selection of premium Egyptian agricultural exports
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} showSeasonRange />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact" className="btn-primary">
              Request Product Catalog
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
