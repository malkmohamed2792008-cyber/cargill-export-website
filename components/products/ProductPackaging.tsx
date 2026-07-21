"use client"

import { motion } from "framer-motion"
import { Product } from "@/lib/products"
import { FiPackage, FiBox, FiShoppingBag } from "react-icons/fi"

interface ProductPackagingProps {
  product: Product
}

export default function ProductPackaging({ product }: ProductPackagingProps) {
  const getIcon = (type: string) => {
    if (type.toLowerCase().includes("box")) return FiBox
    if (type.toLowerCase().includes("bag")) return FiShoppingBag
    return FiPackage
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
            Packaging Options
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer various packaging solutions to meet your specific requirements
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.packaging.map((pack, index) => {
            const Icon = getIcon(pack.type)
            return (
              <motion.div
                key={pack.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary-dark mb-2">
                  {pack.type}
                </h3>
                <p className="text-gray-600">{pack.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Carton Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-white rounded-2xl p-8 shadow-lg"
        >
          <h3 className="font-heading text-xl font-semibold text-primary-dark mb-6 text-center">
            Carton Specifications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Carton Size</p>
              <p className="font-semibold text-primary-dark">{product.cartonSpec.cartonSize}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Net Weight</p>
              <p className="font-semibold text-primary-dark">{product.cartonSpec.netWeight}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Gross Weight</p>
              <p className="font-semibold text-primary-dark">{product.cartonSpec.grossWeight}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Dimensions</p>
              <p className="font-semibold text-primary-dark">{product.cartonSpec.dimensions}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Pieces/Carton</p>
              <p className="font-semibold text-primary-dark">{product.cartonSpec.piecesPerCarton}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Cartons/Pallet</p>
              <p className="font-semibold text-primary-dark">{product.cartonSpec.cartonsPerPallet}</p>
            </div>
          </div>
        </motion.div>

        {/* Storage & Transportation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h4 className="font-heading text-lg font-semibold text-primary-dark mb-4">
              Storage Requirements
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Temperature</span>
                <span className="font-medium text-primary-dark">{product.storage.storageTemperature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Humidity</span>
                <span className="font-medium text-primary-dark">{product.storage.humidity}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h4 className="font-heading text-lg font-semibold text-primary-dark mb-4">
              Transportation
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping Method</span>
                <span className="font-medium text-primary-dark">{product.storage.shippingMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Refrigerated Container</span>
                <span className="font-medium text-primary-dark">{product.storage.refrigeratedContainer}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}