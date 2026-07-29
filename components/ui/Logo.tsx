import React from 'react'

export default function Logo({ className = 'w-44' }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <img src="/هوية بصرية cargill/cargill-logo.svg" alt="CARGILL" />
    </div>
  )
}
