"use client"

import { motion } from "framer-motion"
import { FaCommentDots, FaCheckCircle, FaClipboardCheck, FaBoxOpen, FaFileAlt, FaShip, FaTruckLoading } from "react-icons/fa"
import { exportProcess } from "@/lib/data"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  inquiry: FaCommentDots,
  selection: FaCheckCircle,
  quality: FaClipboardCheck,
  packaging: FaBoxOpen,
  document: FaFileAlt,
  shipping: FaShip,
  delivery: FaTruckLoading,
}

export default function ExportProcess() {
  return (
    <section className="section bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium uppercase tracking-wider text-sm">
            How We Work
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">
            Our Export Process
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto text-lg leading-relaxed">
            A streamlined 7-step process ensuring your products reach global markets safely and efficiently
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8">
            {exportProcess.map((process, index) => {
              const Icon = iconMap[process.icon] || FaCheckCircle
              return (
                <motion.div
                  key={process.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Step Circle */}
                  <div className="w-24 h-24 bg-white border-4 border-primary/20 rounded-full flex items-center justify-center mb-6 relative z-10 group-hover:border-accent group-hover:scale-110 transition-all duration-300 shadow-xl">
                    <span className="absolute -top-3 -right-3 w-10 h-10 bg-accent text-primary-dark rounded-full flex items-center justify-center font-bold text-sm">
                      {process.step}
                    </span>
                    <Icon className="w-10 h-10 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>

                  {/* Content Card */}
                  <div className="bg-background-alt p-6 rounded-2xl w-full group-hover:shadow-2xl transition-all duration-300">
                    <h3 className="font-heading text-lg font-semibold text-primary mb-3">
                      {process.title}
                    </h3>
                    <p className="text-foreground-secondary text-sm leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}