"use client"

import { motion } from "framer-motion"
import { FaAward } from "react-icons/fa"
import { coreValues } from "@/lib/data"

export default function CoreValues() {
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
            Our Core Values
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            The principles that guide everything we do at CARGILL
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <FaAward className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                {value.title}
              </h3>
              <p className="text-foreground-secondary leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}