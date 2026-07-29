"use client"

import Link from "next/link"
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa"
import { companyInfo, quickLinks, services } from "@/lib/data"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-deep-grove-900 text-white">
      {/* Main Footer */}
      <div className="section bg-deep-grove-900">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-2xl">C</span>
                </div>
                <span className="font-heading text-2xl font-bold text-white">
                  {companyInfo.name}
                </span>
              </Link>
              <p className="text-white/70 leading-relaxed">
                {companyInfo.description}
              </p>
              <div className="flex gap-4">
                <a
                  href={companyInfo.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sun-citrus hover:text-deep-grove-900 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href={companyInfo.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sun-citrus hover:text-deep-grove-900 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href={companyInfo.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sun-citrus hover:text-deep-grove-900 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-semibold text-sun-citrus">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-sun-citrus transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-semibold text-sun-citrus">Our Services</h3>
              <ul className="space-y-3">
                {services.slice(0, 4).map((service) => (
                  <li key={service.id}>
                    <Link
                      href="/services"
                      className="text-white/70 hover:text-sun-citrus transition-colors duration-200"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-semibold text-sun-citrus">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-sun-citrus mt-1 flex-shrink-0" />
                  <span className="text-white/70">{companyInfo.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhone className="text-sun-citrus flex-shrink-0" />
                  <a href={`tel:${companyInfo.phone}`} className="text-white/70 hover:text-sun-citrus transition-colors duration-200">
                    {companyInfo.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <FaWhatsapp className="text-sun-citrus flex-shrink-0" />
                  <a href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, "")}`} className="text-white/70 hover:text-sun-citrus transition-colors duration-200">
                    {companyInfo.whatsapp}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-sun-citrus flex-shrink-0" />
                  <a href={`mailto:${companyInfo.email}`} className="text-white/70 hover:text-sun-citrus transition-colors duration-200">
                    {companyInfo.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <FaClock className="text-sun-citrus mt-1 flex-shrink-0" />
                  <span className="text-white/70">{companyInfo.businessHours}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-main py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {currentYear} {companyInfo.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-white/50">
              <Link href="/contact" className="hover:text-sun-citrus transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/contact" className="hover:text-sun-citrus transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
