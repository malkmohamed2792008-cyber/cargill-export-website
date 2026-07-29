"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { heroData } from "@/lib/data"

export default function Hero() {
  return (
    <section
      role="region"
      aria-label="Hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-deep-grove"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image
          src={heroData.backgroundImage}
          alt="Hero Background"
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
            {heroData.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed"
          >
            {heroData.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/contact" className="btn btn-accent text-center" aria-label="Request a Quote">
              Request a Quote
            </Link>
            <Link
              href="/contact"
              className="btn btn-outline bg-white/10 border-white text-white hover:bg-white hover:text-deep-grove text-center"
              aria-label="Contact Sales"
            >
              Contact Sales
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
