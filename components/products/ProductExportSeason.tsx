"use client"

import { motion } from "framer-motion"
import { Product } from "@/lib/products"

interface ProductExportSeasonProps {
  product: Product
}

export default function ProductExportSeason({ product }: ProductExportSeasonProps) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  const getMonthClass = (month: number) => {
    const isAvailable = product.exportSeason.availableMonths.includes(month)
    const isPeak = product.exportSeason.peakExportMonths.includes(month)
    const isOff = product.exportSeason.offSeason.includes(month)

    if (isPeak) return "bg-green-500 text-white"
    if (isAvailable) return "bg-green-100 text-green-700"
    if (isOff) return "bg-gray-100 text-gray-400"
    return "bg-gray-50 text-gray-300"
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark text-center mb-4">
            Export Season
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Know the best time to source {product.name} from Egypt
          </p>

          {/* Calendar Grid */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {months.map((month, index) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-center p-2 ${getMonthClass(index + 1)}`}
                >
                  <span className="text-xs font-medium">{month}</span>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-sm text-gray-600">Peak Export</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded" />
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded" />
                <span className="text-sm text-gray-600">Off Season</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}