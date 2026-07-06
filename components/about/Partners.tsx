"use client"

import { motion } from "framer-motion"
import { FaGlobeAsia } from "react-icons/fa"
import { partners } from "@/lib/data"

export default function Partners() {
  return (
    <section className="section bg-background-alt">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Business Partners
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            Trusted partnerships across continents
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mx-auto mb-4">
                <FaGlobeAsia className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-sm font-semibold text-primary text-center mb-1">
                {partner.name}
              </h3>
              <p className="text-foreground-muted text-xs text-center">
                {partner.country}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}