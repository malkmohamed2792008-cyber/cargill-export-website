import React from 'react'

export function Icon({ children, className = 'w-6 h-6' }: { children: React.ReactNode; className?: string }){
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      {children}
    </span>
  )
}

export default Icon
