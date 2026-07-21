"use client"

import { motion } from "framer-motion"
import { Product } from "@/lib/products"
import { FiAward, FiGlobe, FiTruck } from "react-icons/fi"

interface ProductOverviewProps {
  product: Product
}

export default function ProductOverview({ product }: ProductOverviewProps) {
  const features = [
    {
      icon: FiAward,
      title: "Premium Quality",
      description: "Rigorous quality control ensures only the finest products reach our clients",
    },
    {
      icon: FiGlobe,
      title: "Global Standards",
      description: "Compliant with international export certifications and regulations",
    },
    {
      icon: FiTruck,
      title: "Reliable Logistics",
      description: "Efficient cold chain management ensuring product freshness",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl font-bold text-primary-dark mb-6">
              Product Overview
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            <p className="text-gray-600 leading-relaxed">
              Our commitment to quality starts from the farm and extends to your doorstep.
              Every product undergoes strict inspection to ensure it meets international
              standards for freshness, appearance, and taste.
            </p>
          </motion.div>

          {/* Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-heading text-xl font-semibold text-primary-dark mb-6">
              Why Choose Our {product.name}?
            </h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-dark mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}