"use client"

import { motion } from "framer-motion"
import { FaIndustry, FaShoppingCart, FaHotel, FaUtensils, FaWarehouse, FaTruckLoading } from "react-icons/fa"
import { industries } from "@/lib/data"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  import: FaTruckLoading,
  wholesale: FaShoppingCart,
  cart: FaShoppingCart,
  hotel: FaHotel,
  restaurant: FaUtensils,
  factory: FaWarehouse,
}

export default function IndustriesWeServe() {
  return (
    <section className="section bg-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium uppercase tracking-wider text-sm">
            Our Clients
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
            Industries We Serve
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto text-lg leading-relaxed">
            We provide premium agricultural products to a diverse range of industries worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => {
            const Icon = iconMap[industry.icon] || FaIndustry
            return (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-background-alt p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-accent group-hover:text-primary-dark transition-all duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary mb-3 group-hover:text-secondary transition-colors duration-300">
                  {industry.name}
                </h3>
                <p className="text-foreground-secondary leading-relaxed">
                  {industry.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}