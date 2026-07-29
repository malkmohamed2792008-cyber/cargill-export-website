import { Metadata } from "next"
import Link from "next/link"
import { getPrismaClient } from "@/lib/prisma"
import { FiMail, FiMessageSquare, FiEye, FiAlertCircle } from "react-icons/fi"
import DataTable, { TablePagination } from "@/components/admin/DataTable"
import { format } from "date-fns"

export const metadata: Metadata = {
  title: "Inquiries | CARGILL Admin",
  description: "Manage quotes and messages",
}

interface Props {
  searchParams: Promise<{ page?: string; type?: string; status?: string }>
}

async function getInquiriesData({
  page = "1",
  type = "quote",
  status,
}: {
  page?: string
  type?: string
  status?: string
}) {
  const prisma = getPrismaClient()
  if (!prisma) {
    return {
      quotes: [],
      messages: [],
      total: 0,
      totalPages: 0,
      page: 1,
      counts: { quotes: 0, messages: 0, unreadMessages: 0, pendingQuotes: 0 },
    }
  }

  const pageNum = parseInt(page) || 1
  const limit = 10
  const skip = (pageNum - 1) * limit

  // Get counts
  const [quoteCount, messageCount, unreadMessageCount, pendingQuoteCount] = await Promise.all([
    prisma.quoteRequest.count({ where: { isArchived: false } }),
    prisma.contactMessage.count({ where: { isArchived: false } }),
    prisma.contactMessage.count({ where: { isRead: false, isArchived: false } }),
    prisma.quoteRequest.count({ where: { status: "PENDING", isArchived: false } }),
  ])

  const counts: { quotes: number; messages: number; unreadMessages: number; pendingQuotes: number } = {
    quotes: quoteCount,
    messages: messageCount,
    unreadMessages: unreadMessageCount,
    pendingQuotes: pendingQuoteCount,
  }

  if (type === "quote") {
    const where: Record<string, unknown> = { isArchived: false }
    if (status && status !== "all") {
      where.status = status.toUpperCase()
    }

    const [quotes, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.quoteRequest.count({ where }),
    ])

    return {
      quotes,
      messages: [],
      total,
      totalPages: Math.ceil(total / limit),
      page: pageNum,
      counts,
    }
  }

  // Messages
  const where: Record<string, unknown> = { isArchived: false }
  if (status === "read") {
    where.isRead = true
  } else if (status === "unread") {
    where.isRead = false
  }

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.contactMessage.count({ where }),
  ])

  return {
    quotes: [],
    messages,
    total,
    totalPages: Math.ceil(total / limit),
    page: pageNum,
    counts,
  }
}

export default async function AdminInquiriesPage({ searchParams }: Props) {
  const params = await searchParams
  const { quotes, messages, totalPages, page, counts } = await getInquiriesData(params)

  const activeType = params.type || "quote"

  const quoteColumns = [
    {
      key: "name",
      header: "Name",
      render: (quote: typeof quotes[0]) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{quote.name}</p>
          <p className="text-sm text-gray-500">{quote.email}</p>
        </div>
      ),
    },
    {
      key: "product",
      header: "Product",
      render: (quote: typeof quotes[0]) => quote.productName || "-",
    },
    {
      key: "company",
      header: "Company",
      render: (quote: typeof quotes[0]) => quote.company || "-",
    },
    {
      key: "country",
      header: "Country",
      render: (quote: typeof quotes[0]) => quote.country || "-",
    },
    {
      key: "status",
      header: "Status",
      render: (quote: typeof quotes[0]) => {
        const statusColors: Record<string, string> = {
          PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          PROCESSED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          CANCELLED: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
        }
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[quote.status] || statusColors.PENDING}`}>
            {quote.status}
          </span>
        )
      },
    },
    {
      key: "createdAt",
      header: "Date",
      render: (quote: typeof quotes[0]) => quote.createdAt ? format(new Date(quote.createdAt), "MMM d, yyyy") : "-",
    },
    {
      key: "actions",
      header: "",
      render: (quote: typeof quotes[0]) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/inquiries/${quote.id}?type=quote`}
            className="p-2 text-gray-500 hover:text-primary transition-colors"
            title="View"
          >
            <FiEye className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ]

  const messageColumns = [
    {
      key: "name",
      header: "From",
      render: (message: typeof messages[0]) => (
        <div className={!message.isRead ? "font-semibold" : ""}>
          <p className="text-gray-900 dark:text-white">{message.name}</p>
          <p className="text-sm text-gray-500">{message.email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (message: typeof messages[0]) => (
        <span className={!message.isRead ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}>
          {message.subject}
        </span>
      ),
    },
    {
      key: "isRead",
      header: "Status",
      render: (message: typeof messages[0]) => (
        message.isRead ? (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full">
            Read
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
            Unread
          </span>
        )
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (message: typeof messages[0]) => message.createdAt ? format(new Date(message.createdAt), "MMM d, yyyy") : "-",
    },
    {
      key: "actions",
      header: "",
      render: (message: typeof messages[0]) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/inquiries/${message.id}?type=message`}
            className="p-2 text-gray-500 hover:text-primary transition-colors"
            title="View"
          >
            <FiEye className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inquiries</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage quote requests and contact messages
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/inquiries?type=quote"
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FiMessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Quote Requests</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{counts.quotes}</p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/inquiries?type=quote&status=PENDING"
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-yellow-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Quotes</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{counts.pendingQuotes}</p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/inquiries?type=message"
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <FiMail className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Messages</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{counts.messages}</p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/inquiries?type=message&status=unread"
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FiMail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unread Messages</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{counts.unreadMessages}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-6">
          <Link
            href="/admin/inquiries?type=quote"
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeType === "quote"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Quotes ({counts.quotes})
          </Link>
          <Link
            href="/admin/inquiries?type=message"
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeType === "message"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Messages ({counts.messages})
          </Link>
        </nav>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        {activeType === "quote" ? (
          <div className="flex gap-2">
            <Link
              href="/admin/inquiries?type=quote"
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                !params.status || params.status === "all"
                  ? "bg-primary text-white border-primary"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              All
            </Link>
            <Link
              href="/admin/inquiries?type=quote&status=PENDING"
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                params.status === "PENDING"
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              Pending
            </Link>
            <Link
              href="/admin/inquiries?type=quote&status=PROCESSED"
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                params.status === "PROCESSED"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              Processed
            </Link>
            <Link
              href="/admin/inquiries?type=quote&status=COMPLETED"
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                params.status === "COMPLETED"
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              Completed
            </Link>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/admin/inquiries?type=message"
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                !params.status || params.status === "all"
                  ? "bg-primary text-white border-primary"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              All
            </Link>
            <Link
              href="/admin/inquiries?type=message&status=unread"
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                params.status === "unread"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              Unread
            </Link>
            <Link
              href="/admin/inquiries?type=message&status=read"
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                params.status === "read"
                  ? "bg-gray-500 text-white border-gray-500"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              Read
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      {activeType === "quote" ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {quotes.length > 0 ? (
            <>
              <DataTable
                columns={quoteColumns}
                data={quotes}
                keyExtractor={(quote) => quote.id}
                emptyMessage="No quotes found"
              />
              <TablePagination
                page={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  const sp = new URLSearchParams()
                  sp.set("page", String(newPage))
                  sp.set("type", "quote")
                  if (params.status) sp.set("status", params.status)
                  window.location.href = `/admin/inquiries?${sp.toString()}`
                }}
              />
            </>
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No quotes found.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {messages.length > 0 ? (
            <>
              <DataTable
                columns={messageColumns}
                data={messages}
                keyExtractor={(message) => message.id}
                emptyMessage="No messages found"
              />
              <TablePagination
                page={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  const sp = new URLSearchParams()
                  sp.set("page", String(newPage))
                  sp.set("type", "message")
                  if (params.status) sp.set("status", params.status)
                  window.location.href = `/admin/inquiries?${sp.toString()}`
                }}
              />
            </>
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No messages found.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
