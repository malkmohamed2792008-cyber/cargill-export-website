"use client"

import { motion } from "framer-motion"
import { Product, exportedCountries } from "@/lib/products"
import { FiGlobe } from "react-icons/fi"

interface ProductExportedToProps {
  product: Product
}

export default function ProductExportedTo({ product }: ProductExportedToProps) {
  const getCountryInfo = (code: string) => {
    return exportedCountries.find((c) => c.code === code)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiGlobe className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">Global Reach</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            Countries Currently Exported To
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We successfully export {product.name} to the following countries and continue to expand our global reach
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {product.exportedTo.map((exported, index) => {
            const countryInfo = getCountryInfo(exported.code)
            return (
              <motion.div
                key={exported.code}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 bg-gray-50 rounded-full px-5 py-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">{countryInfo?.flag || "🏳️"}</span>
                <span className="font-medium text-primary-dark">{exported.name}</span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <p className="text-gray-600">
            Don&apos;t see your country?{" "}
            <a href="/contact" className="text-primary font-medium hover:underline">
              Contact us
            </a>{" "}
            to discuss export options to your location.
          </p>
        </motion.div>
      </div>
    </section>
  )
}