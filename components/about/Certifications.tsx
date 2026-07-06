"use client"

import { motion } from "framer-motion"
import { FaCertificate } from "react-icons/fa"
import { certifications } from "@/lib/data"

export default function Certifications() {
  return (
    <section className="section bg-white">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Certifications
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            Internationally recognized certifications that ensure quality and safety
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background-alt p-6 rounded-xl text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto mb-4">
                <FaCertificate className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                {cert.name}
              </h3>
              <p className="text-foreground-secondary text-sm">
                {cert.issuer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}