"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { getBestSellingProducts, getSeasonalProducts, products } from "@/lib/products"
import { FiArrowRight, FiStar, FiCalendar } from "react-icons/fi"

interface ProductsFeaturedProps {
  category?: string | null
}

export default function ProductsFeatured({ category }: ProductsFeaturedProps) {
  const bestSelling = getBestSellingProducts()
  const seasonal = getSeasonalProducts()

  // Filter by category if active
  let featured = products.slice(0, 6)
  if (category) {
    featured = products.filter(p => p.categoryId === category).slice(0, 6)
  }

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
            <Link
              href="/products/fresh-fruits"
              className="hidden md:flex items-center text-primary font-medium hover:text-accent transition-colors"
            >
              View All <FiArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestSelling.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
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
            {seasonal.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} showSeasonal />
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
                <ProductCard product={product} />
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

// Product Card Component
function ProductCard({
  product,
  showSeasonal = false,
}: {
  product: ReturnType<typeof getBestSellingProducts>[0]
  showSeasonal?: boolean
}) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-primary/30">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isBestSelling && !showSeasonal && (
              <span className="bg-accent text-white text-xs font-medium px-2 py-1 rounded-full">
                Best Seller
              </span>
            )}
            {showSeasonal && (
              <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                In Season
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-heading text-lg font-semibold text-primary-dark mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {product.shortDescription}
          </p>

          {/* Export Season */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FiCalendar className="w-3 h-3" />
            <span>
              {months[product.exportSeason.availableMonths[0] - 1]} - {months[product.exportSeason.availableMonths[product.exportSeason.availableMonths.length - 1] - 1]}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}