"use client"

import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { FaGlobe, FaShip, FaCheckCircle, FaHeadset, FaCalendar, FaUsers } from "react-icons/fa"
import { statistics } from "@/lib/data"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: FaCalendar,
  globe: FaGlobe,
  users: FaUsers,
  ship: FaShip,
  check: FaCheckCircle,
  support: FaHeadset,
}

interface AnimatedCounterProps {
  value: number
  suffix: string
  label: string
  icon: string
}

function AnimatedCounter({ value, suffix, label, icon }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 2000 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (inView) {
      motionValue.set(value)
    }
  }, [inView, value, motionValue])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest))
    })
  }, [springValue])

  const IconComponent = iconMap[icon] || FaGlobe

  return (
    <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
        {IconComponent && <span className="w-8 h-8 flex items-center justify-center text-accent group-hover:text-primary-dark"><IconComponent className="w-8 h-8" /></span>}
      </div>
      <span ref={ref} className="font-heading text-4xl md:text-5xl font-bold text-primary block">
        {displayValue}{suffix}
      </span>
      <p className="text-foreground-secondary mt-2 font-medium">
        {label}
      </p>
    </div>
  )
}

export default function Statistics() {
  return (
    <section className="section bg-background-alt relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                icon={stat.icon}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}