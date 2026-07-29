"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { Product } from "@/lib/products"
import { FiArrowRight } from "react-icons/fi"
import ProductCard from "./ProductCard"

interface ProductRelatedProps {
  relatedProducts: Product[]
}

export default function ProductRelated({ relatedProducts }: ProductRelatedProps) {
  if (relatedProducts.length === 0) return null

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            Related Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            You may also be interested in these products from the same category
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((related, index) => (
            <motion.div
              key={related.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={related} />
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link
            href="/products"
            className="inline-flex items-center text-primary font-medium hover:text-accent transition-colors"
          >
            View All Products <FiArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
