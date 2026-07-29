"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { Product, ProductCategory } from "@/lib/products"
import { FiChevronRight, FiCalendar, FiStar, FiMapPin, FiAward, FiClock, FiTruck } from "react-icons/fi"

interface ProductHeroProps {
  product: Product
  category?: ProductCategory
}

export default function ProductHero({ product, category: propCategory }: ProductHeroProps) {
  const category = propCategory

  return (
    <section className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-main">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <FiChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <FiChevronRight className="w-4 h-4" />
          {category && (
            <>
              <Link
                href={`/products?category=${category.slug}`}
                className="hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
              <FiChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-primary-dark font-medium">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Info - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isBestSelling && (
                <span className="bg-accent text-white text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <FiStar className="w-4 h-4" /> Best Seller
                </span>
              )}
              {product.isSeasonal && (
                <span className="bg-orange-500 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" /> In Season
                </span>
              )}
              <span className="text-accent font-medium">
                {product.specifications.category}
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-dark mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{product.shortDescription}</p>

            {/* Quick Info Grid - Icons with Labels */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Origin</p>
                  <p className="font-semibold text-primary-dark text-sm">{product.specifications.origin}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiAward className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Export Grade</p>
                  <p className="font-semibold text-primary-dark text-sm">{product.specifications.exportGrade}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiClock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Shelf Life</p>
                  <p className="font-semibold text-primary-dark text-sm">{product.specifications.shelfLife}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiTruck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Availability</p>
                  <p className="font-semibold text-primary-dark text-sm">{product.specifications.availability}</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#quote" className="btn btn-primary text-center">
                Request a Quote
              </Link>
              <Link href="/contact" className="btn btn-outline border-deep-grove text-deep-grove hover:bg-deep-grove hover:text-white text-center">
                Contact Sales
              </Link>
            </div>
          </motion.div>

          {/* Product Description - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="font-heading text-xl font-semibold text-primary-dark mb-4">
              About This Product
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              {product.description.substring(0, 300)}
              {product.description.length > 300 && "..."}
            </p>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                <span className="font-medium text-primary-dark">Variety:</span> {product.specifications.variety}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">
                <span className="font-medium text-primary-dark">Quality:</span> {product.specifications.qualityGrade}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
