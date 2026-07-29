"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function ProductsHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-deep-grove">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1920&q=80"
          alt="Fresh Products"
          fill
          className="object-cover opacity-60"
          priority
          quality={90}
        />
      </div>

      {/* Content */}
      <div className="container-main relative z-10 pt-32 pb-20">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Premium Egyptian Products for Global Markets
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed"
          >
            Discover our comprehensive range of fresh fruits, vegetables, frozen foods, dry goods, and canned products exported worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="#categories" className="btn btn-accent text-center">
              Explore Products
            </Link>
            <Link href="/contact" className="btn btn-outline border-white text-white hover:bg-white hover:text-deep-grove text-center">
              Request a Quote
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Orange Border Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-sun-citrus" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}