"use client"

import { motion } from "framer-motion"
import { Product } from "@/lib/products"
import { FiInfo } from "react-icons/fi"

interface ProductSpecificationsProps {
  product: Product
}

export default function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const specEntries = Object.entries(product.specifications).filter(
    ([, value]) => value !== undefined && value !== ""
  )

  const leftColumn = specEntries.slice(0, Math.ceil(specEntries.length / 2))
  const rightColumn = specEntries.slice(Math.ceil(specEntries.length / 2))

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

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
            Technical Specifications
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Detailed product specifications to help you make informed purchasing decisions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Left Column */}
            <div className="divide-y divide-gray-100">
              {leftColumn.map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-500 font-medium">{formatKey(key)}</span>
                  <span className="text-primary-dark font-semibold text-right">{value as string}</span>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="divide-y divide-gray-100">
              {rightColumn.map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-500 font-medium">{formatKey(key)}</span>
                  <span className="text-primary-dark font-semibold text-right">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex items-start gap-3 bg-primary/5 p-4 rounded-xl"
        >
          <FiInfo className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            Specifications may vary slightly based on seasonal variations and specific client requirements.
            Contact our sales team for customized specifications.
          </p>
        </motion.div>
      </div>
    </section>
  )
}