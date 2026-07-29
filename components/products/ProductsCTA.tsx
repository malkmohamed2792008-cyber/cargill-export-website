"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function ProductsCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Source Premium Egyptian Products?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Our export specialists are ready to help you find the perfect products for your market. Contact us today for personalized quotations and product samples.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-accent text-center">
              Request a Quote
            </Link>
            <Link
              href="/contact"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-deep-grove text-center"
            >
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}