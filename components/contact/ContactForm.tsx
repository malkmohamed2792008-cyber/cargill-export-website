"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaPaperPlane, FaCheck } from "react-icons/fa"
import { isValidEmail, isValidPhone } from "@/lib/utils"

interface ContactField {
  name: string
  label: string
  type: string
  required: boolean
  placeholder: string
  rows?: number
}

interface ContactFormProps {
  fields: ContactField[]
}

export default function ContactForm({ fields }: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.website) {
      return
    }

    if (!isValidEmail(formData.email || "")) {
      setErrorMessage("Please enter a valid email address.")
      return
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      setErrorMessage("Please enter a valid phone number.")
      return
    }

    setErrorMessage("")
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({})

    // Reset after showing success message
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="alert alert-success"
        style={{ textAlign: "center", padding: "32px" }}
      >
        <div style={{
          width: "64px",
          height: "64px",
          background: "var(--success-light)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px"
        }}>
          <FaCheck style={{ width: "32px", height: "32px", color: "var(--success)" }} />
        </div>
        <h3 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "20px",
          fontWeight: "600",
          color: "var(--success)",
          margin: "0 0 8px"
        }}>
          Message Sent Successfully!
        </h3>
        <p style={{ color: "var(--success)", margin: 0 }}>
          Thank you for contacting us. We will get back to you soon.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="card"
      style={{ padding: "32px" }}
    >
      <h2 style={{
        fontFamily: "var(--font-heading)",
        fontSize: "24px",
        fontWeight: "600",
        color: "var(--deep-grove)",
        margin: "0 0 8px"
      }}>
        Send Us a Message
      </h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
        Fill out the form below and we&apos;ll get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <input
          type="text"
          name="website"
          value={formData.website || ""}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
          {fields.slice(0, 2).map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="label"
              >
                {field.label}
                {field.required && <span style={{ color: "var(--danger)" }}> *</span>}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="input"
              />
            </div>
          ))}
        </div>

        {fields.slice(2, 4).map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="label"
            >
              {field.label}
              {field.required && <span style={{ color: "var(--danger)" }}> *</span>}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className="input"
            />
          </div>
        ))}

        {fields.slice(4).map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="label"
            >
              {field.label}
              {field.required && <span style={{ color: "var(--danger)" }}> *</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                rows={field.rows || 5}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="c-textarea"
                style={{ maxWidth: "100%" }}
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                required={field.required}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              />
            )}
          </div>
        ))}

        {errorMessage && (
          <p className="c-error-msg" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          {isSubmitting ? (
            <>
              <span style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              Sending...
            </>
          ) : (
            <>
              <FaPaperPlane style={{ width: "14px", height: "14px" }} />
              Send Message
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}
