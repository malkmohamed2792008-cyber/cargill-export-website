"use client"

import { motion } from "framer-motion"
import { FaMapMarkerAlt, FaPhone, FaWhatsapp, FaEnvelope, FaClock, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa"

interface CompanyInfo {
  name: string
  email: string
  phone: string
  whatsapp: string
  address: string
  businessHours: string
  socialMedia: {
    facebook: string
    linkedin: string
    instagram: string
  }
}

interface ContactInfoProps {
  companyInfo: CompanyInfo
}

export default function ContactInfo({ companyInfo }: ContactInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary mb-2">
          Get In Touch
        </h2>
        <p className="text-foreground-secondary">
          We&apos;re here to answer any questions you may have about our products and services.
        </p>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
            <FaMapMarkerAlt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-1">Office Address</h3>
            <p className="text-foreground-secondary">{companyInfo.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
            <FaPhone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-1">Phone</h3>
            <a
              href={`tel:${companyInfo.phone}`}
              className="text-foreground-secondary hover:text-primary transition-colors"
            >
              {companyInfo.phone}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
            <FaWhatsapp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-1">WhatsApp</h3>
            <a
              href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, "")}`}
              className="text-foreground-secondary hover:text-green-600 transition-colors"
            >
              {companyInfo.whatsapp}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
            <FaEnvelope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-1">Email</h3>
            <a
              href={`mailto:${companyInfo.email}`}
              className="text-foreground-secondary hover:text-primary transition-colors"
            >
              {companyInfo.email}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
            <FaClock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-1">Business Hours</h3>
            <p className="text-foreground-secondary">{companyInfo.businessHours}</p>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-primary-dark rounded-2xl p-8">
        <h3 className="font-heading text-lg font-semibold text-white mb-4">
          Follow Us
        </h3>
        <div className="flex gap-4">
          <a
            href={companyInfo.socialMedia.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-primary-dark transition-all duration-300"
            aria-label="Facebook"
          >
            <FaFacebookF className="w-5 h-5" />
          </a>
          <a
            href={companyInfo.socialMedia.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-primary-dark transition-all duration-300"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn className="w-5 h-5" />
          </a>
          <a
            href={companyInfo.socialMedia.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-primary-dark transition-all duration-300"
            aria-label="Instagram"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}