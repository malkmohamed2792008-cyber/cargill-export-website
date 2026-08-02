"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { heroData } from "@/lib/data"

export default function Hero(): JSX.Element {
  return (
    <section
      role="region"
      aria-labelledby="hero-title"
      className="relative min-h-[84vh] flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image
          src={heroData.backgroundImage}
          alt={heroData.backgroundAlt ?? "CARGILL Egypt export background"}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark overlay to guarantee text contrast (WCAG) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(6,18,12,0.64), rgba(6,18,12,0.56) 35%, rgba(6,18,12,0.48) 70%, rgba(6,18,12,0.36))",
          }}
        />
      </div>

      {/* Content */}
      <div className="container-main relative z-10 py-28 sm:py-32">
        <div className="max-w-3xl">
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-heading font-extrabold text-[28px] sm:text-[36px] md:text-[44px] lg:text-[56px] leading-tight text-white mb-4"
            style={{ lineHeight: 1.04 }}
          >
            {heroData.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-[16px] sm:text-[18px] md:text-[20px] text-[#FDFBF7] max-w-2xl mb-8 leading-relaxed"
          >
            {heroData.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <Link
              href="/contact"
              aria-label="Request a quote from CARGILL Egypt"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 min-h-[46px] bg-[var(--sun-citrus)] text-[var(--ink)] font-semibold shadow-md hover:bg-[var(--sun-citrus-600)] transition-colors focus-visible:outline-none"
            >
              Request a Quote
            </Link>

            <Link
              href="/contact"
              aria-label="Contact CARGILL Egypt sales"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 min-h-[46px] text-white bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] font-medium hover:bg-white hover:text-[var(--deep-grove)] transition-colors focus-visible:outline-none"
            >
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative orange accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[var(--sun-citrus)]" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95, duration: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        aria-hidden
      >
        <div className="w-7 h-11 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
          <motion.span
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-white rounded-full block"
          />
        </div>
      </motion.div>
    </section>
  )
}
