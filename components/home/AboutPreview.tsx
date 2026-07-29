"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { aboutData } from "@/lib/data"

export default function AboutPreview() {
  return (
    <section role="region" aria-label="About preview" className="section bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent" />
      </div>

      <div className="container-main relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
            aria-hidden
          >
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80"
                alt="Fresh fruits and vegetables"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 to-transparent" aria-hidden />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-accent rounded-2xl -z-10" aria-hidden />
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary rounded-2xl -z-10" aria-hidden />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <span className="text-secondary font-medium uppercase tracking-wider text-sm">
                About Us
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary leading-tight">
                Connecting Egyptian Excellence to the World
              </h2>
            </div>

            <p className="text-foreground-secondary text-lg leading-relaxed">
              {aboutData.story}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="bg-background-alt p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-heading text-lg font-semibold text-primary mb-3">
                  Vision
                </h3>
                <p className="text-foreground-secondary text-sm leading-relaxed">
                  {aboutData.vision}
                </p>
              </div>
              <div className="bg-background-alt p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <h3 className="font-heading text-lg font-semibold text-primary mb-3">
                  Mission
                </h3>
                <p className="text-foreground-secondary text-sm leading-relaxed">
                  {aboutData.mission}
                </p>
              </div>
            </div>

            <Link href="/about" className="btn btn-accent inline-block" aria-label="Learn more about Cargill">
              Learn More About Us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
