"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { FiArrowLeft, FiCheck, FiX, FiMail, FiMessageSquare, FiArchive } from "react-icons/fi"

interface QuoteData {
  id: string
  name: string
  email: string
  company?: string
  country?: string
  phone?: string
  productName?: string
  message: string
  status: string
  createdAt: string
}

interface MessageData {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

function InquiryDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const typeParam = searchParams.get("type") as "quote" | "message" | null

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [data, setData] = useState<QuoteData | MessageData | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!id || !typeParam) return

      try {
        const response = await fetch(`/api/admin/inquiries?type=${typeParam}&id=${id}`)
        if (response.ok) {
          const result = await response.json()
          setData(typeParam === "quote" ? result.quote : result.message)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, typeParam])

  const isQuote = typeParam === "quote"

  const handleStatusChange = async (newStatus: string) => {
    if (!id || !isQuote) return

    setUpdating(true)
    try {
      await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "quote", id, status: newStatus }),
      })
      // Refresh data
      const response = await fetch(`/api/admin/inquiries?type=${typeParam}&id=${id}`)
      if (response.ok) {
        const result = await response.json()
        setData(isQuote ? result.quote : result.message)
      }
    } catch (err) {
      console.error("Error updating status:", err)
    } finally {
      setUpdating(false)
    }
  }

  const handleMarkAsRead = async () => {
    if (!id || isQuote) return

    setUpdating(true)
    try {
      await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "message", id, isRead: true }),
      })
      // Refresh data
      const response = await fetch(`/api/admin/inquiries?type=${typeParam}&id=${id}`)
      if (response.ok) {
        const result = await response.json()
        setData(isQuote ? result.quote : result.message)
      }
    } catch (err) {
      console.error("Error marking as read:", err)
    } finally {
      setUpdating(false)
    }
  }

  const handleArchive = async () => {
    if (!id || !typeParam) return

    setUpdating(true)
    try {
      await fetch(`/api/admin/inquiries?id=${id}&type=${typeParam}`, {
        method: "DELETE",
      })
      router.push("/admin/inquiries")
    } catch (err) {
      console.error("Error archiving:", err)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Data not found</p>
        <Link href="/admin/inquiries" className="text-primary hover:underline mt-2 inline-block">
          Back to Inquiries
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/admin/inquiries?type=${typeParam}`}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to {isQuote ? "Quotes" : "Messages"}
        </Link>
        <button
          onClick={handleArchive}
          disabled={updating}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <FiArchive className="w-4 h-4" />
          Archive
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isQuote ? "bg-primary/10" : "bg-secondary/10"
              }`}>
                {isQuote ? (
                  <FiMessageSquare className="w-5 h-5 text-primary" />
                ) : (
                  <FiMail className="w-5 h-5 text-secondary" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isQuote ? "Quote Request" : "Contact Message"}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {data.createdAt ? new Date(data.createdAt as string).toLocaleDateString() : ""}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            {isQuote && (data as QuoteData).status ? (
              <div className="flex gap-2">
                {((data as QuoteData).status as string) === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleStatusChange("PROCESSED")}
                      disabled={updating}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                      <FiCheck className="w-4 h-4" />
                      Mark Processed
                    </button>
                    <button
                      onClick={() => handleStatusChange("CANCELLED")}
                      disabled={updating}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                    >
                      <FiX className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
                {((data as QuoteData).status as string) === "PROCESSED" && (
                  <button
                    onClick={() => handleStatusChange("COMPLETED")}
                    disabled={updating}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    <FiCheck className="w-4 h-4" />
                    Mark Completed
                  </button>
                )}
              </div>
            ) : (
              !isQuote && !(data as MessageData).isRead && (
                <button
                  onClick={handleMarkAsRead}
                  disabled={updating}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  <FiCheck className="w-4 h-4" />
                  Mark as Read
                </button>
              )
            )}
          </div>

          {/* Status */}
          {isQuote && (data as QuoteData).status && (
            <div className="mt-4">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                ((data as QuoteData).status as string) === "PENDING" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                ((data as QuoteData).status as string) === "PROCESSED" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                ((data as QuoteData).status as string) === "COMPLETED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
              }`}>
                {(data as QuoteData).status as string}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Name
              </label>
              <p className="text-gray-900 dark:text-white">{data.name as string}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Email
              </label>
              <p className="text-gray-900 dark:text-white">
                <a href={`mailto:${data.email}`} className="text-primary hover:underline">
                  {data.email as string}
                </a>
              </p>
            </div>
            {data.company && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Company
                </label>
                <p className="text-gray-900 dark:text-white">{data.company as string}</p>
              </div>
            )}
            {isQuote && (data as QuoteData).country && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Country
                </label>
                <p className="text-gray-900 dark:text-white">{(data as QuoteData).country}</p>
              </div>
            )}
            {data.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Phone
                </label>
                <p className="text-gray-900 dark:text-white">{data.phone as string}</p>
              </div>
            )}
            {isQuote && (data as QuoteData).productName && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Product
                </label>
                <p className="text-gray-900 dark:text-white">{(data as QuoteData).productName}</p>
              </div>
            )}
            {!isQuote && (data as MessageData).subject && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Subject
                </label>
                <p className="text-gray-900 dark:text-white">{(data as MessageData).subject}</p>
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {isQuote ? "Requirements / Message" : "Message"}
            </label>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{data.message as string}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InquiryDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <InquiryDetailContent />
    </Suspense>
  )
}
