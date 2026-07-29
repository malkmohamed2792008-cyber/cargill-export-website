"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function CTA() {
  return (
    <section role="region" aria-label="Call to action" className="section bg-primary-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-0 w-80 h-80 bg-primary/50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMCAwaDYwdjYwSDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat opacity-10" />
      </div>

      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">Ready to Import Premium Egyptian Products?</h2>
          <p className="text-white/80 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto">Our export specialists are ready to help you source premium Egyptian fruits, vegetables, frozen foods, dry foods, and canned products with international quality standards.</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/contact" className="btn btn-accent text-lg px-10 py-5 text-center" aria-label="Request a quote">
              Request a Quote
            </Link>
            <Link href="/contact" className="btn btn-outline bg-white/10 border-white text-white hover:bg-white hover:text-deep-grove text-lg px-10 py-5 text-center" aria-label="Contact sales">
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
