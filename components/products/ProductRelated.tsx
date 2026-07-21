"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Product, getRelatedProducts } from "@/lib/products"
import { FiArrowRight } from "react-icons/fi"

interface ProductRelatedProps {
  product: Product
}

export default function ProductRelated({ product }: ProductRelatedProps) {
  const relatedProducts = getRelatedProducts(product, 4)

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
              <Link href={`/products/${related.slug}`} className="group block">
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg font-semibold text-primary-dark mb-1 group-hover:text-primary transition-colors">
                      {related.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {related.shortDescription}
                    </p>
                  </div>
                </div>
              </Link>
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