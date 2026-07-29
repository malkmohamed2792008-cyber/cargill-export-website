"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FaArrowRight } from "react-icons/fa"
import { services } from "@/lib/data"

export default function ServicesOverview() {
  return (
    <section role="region" aria-label="Services overview" className="section bg-background-alt relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute top-20 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
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
          <span className="text-secondary font-medium uppercase tracking-wider text-sm">Our Services</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
            Comprehensive Trading Solutions
          </h2>
          <p className="text-foreground-secondary">
            We offer end-to-end services for fresh produce and frozen food trade,
            ensuring quality from farm to table.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 6).map((service, index) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              aria-labelledby={`service-title-${service.id}`}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden" aria-hidden>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent" aria-hidden />
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 id={`service-title-${service.id}`} className="font-heading text-xl font-semibold text-primary mb-3 group-hover:text-secondary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-foreground-secondary text-sm mb-5 leading-relaxed">{service.shortDescription}</p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:text-secondary transition-colors duration-300"
                  aria-label={`Learn more about ${service.title}`}
                >
                  <span>Learn More</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/services" className="btn btn-accent" aria-label="View all services">
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
