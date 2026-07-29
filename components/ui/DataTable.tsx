import React from 'react'

export default function DataTable({ children, className = '' }: { children: React.ReactNode; className?: string }){
  return (
    <div className={`data-table overflow-auto bg-white rounded-md shadow-sm ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  )
}
