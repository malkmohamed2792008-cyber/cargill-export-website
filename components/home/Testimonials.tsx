"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { FaQuoteLeft } from "react-icons/fa"
import { testimonials } from "@/lib/data"

export default function Testimonials() {
  return (
    <section className="section bg-background-alt relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-secondary font-medium uppercase tracking-wider text-sm">
            Testimonials
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-foreground-secondary">
            We value long-term partnerships and take pride in our clients&apos; success.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="text-accent mb-6">
                <FaQuoteLeft className="w-10 h-10" />
              </div>

              {/* Quote */}
              <p className="text-foreground-secondary mb-8 leading-relaxed italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border-light">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-primary">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-foreground-secondary">
                    {testimonial.position}, {testimonial.company}
                  </p>
                  <p className="text-xs text-accent font-medium mt-1">{testimonial.country}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}