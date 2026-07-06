"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function CompanyStory() {
  return (
    <section className="pt-32 pb-16 bg-background">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-secondary font-medium uppercase tracking-wider text-sm">
              Our Story
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">
              Building Bridges in Global Trade
            </h1>
            <p className="text-foreground-secondary leading-relaxed">
              Founded in 2024, CARGILL is an Egyptian company specializing in the export
              and import of premium-quality fresh fruits, vegetables, and frozen food
              products. Our mission is to connect Egyptian agricultural excellence with
              international markets by providing reliable sourcing, strict quality control,
              and efficient logistics.
            </p>
            <p className="text-foreground-secondary leading-relaxed">
              We take pride in our ability to source the finest products from Egyptian
              farms and deliver them to clients worldwide. Our team of experts ensures
              that every product meets international quality standards and reaches our
              clients in perfect condition.
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80"
                alt="Fresh fruits and vegetables"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}