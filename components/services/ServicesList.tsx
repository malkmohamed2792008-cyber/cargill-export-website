"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FaCheck } from "react-icons/fa"

interface Service {
  id: string
  title: string
  shortDescription: string
  description: string
  features: string[]
  image: string
}

interface ServicesListProps {
  services: Service[]
}

export default function ServicesList({ services }: ServicesListProps) {
  return (
    <section role="region" aria-label="Our services" className="section bg-background">
      <div className="container-main">
        <div className="space-y-24">
          {services.map((service, index) => (
            <motion.article
              key={service.id}
              role="article"
              aria-labelledby={`service-${service.id}-title`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div
                className={`relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image src={service.image} alt={service.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/30 to-transparent" aria-hidden />
              </div>

              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="space-y-2">
                  <span className="text-secondary font-medium uppercase tracking-wider text-sm">Service</span>
                  <h2 id={`service-${service.id}-title`} className="font-heading text-3xl md:text-4xl font-bold text-primary">{service.title}</h2>
                </div>

                <p className="text-foreground-secondary leading-relaxed text-lg">{service.description}</p>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list" aria-label={`${service.title} features`}>
                  {service.features.slice(0, 6).map((feature, fIndex) => (
                    <div key={fIndex} role="listitem" className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden>
                        <FaCheck className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-foreground-secondary text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/contact" className="btn btn-accent inline-block" aria-label={`Request quote for ${service.title}`}>
                  Request Quote
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
