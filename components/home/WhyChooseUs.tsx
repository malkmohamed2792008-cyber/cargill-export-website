"use client"

import { motion } from "framer-motion"
import { FaTrophy, FaDollarSign, FaTruck, FaCertificate, FaGlobe, FaHeart } from "react-icons/fa"
import { whyChooseUs } from "@/lib/data"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: FaTrophy,
  price: FaDollarSign,
  truck: FaTruck,
  certificate: FaCertificate,
  globe: FaGlobe,
  heart: FaHeart,
}

export default function WhyChooseUs() {
  return (
    <section className="section bg-primary-dark relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
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
          <span className="text-accent font-medium uppercase tracking-wider text-sm">
            Why Choose Us
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
            Your Trusted Partner in Global Trade
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            We combine industry expertise with unwavering commitment to quality
            and customer satisfaction.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUs.map((item, index) => {
            const IconComponent = iconMap[item.icon] || FaTrophy
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-primary-dark transition-all duration-300">
                  <span className="w-8 h-8 flex items-center justify-center text-accent group-hover:text-primary-dark">
                    <IconComponent className="w-8 h-8" />
                  </span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-white/60 text-base leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}