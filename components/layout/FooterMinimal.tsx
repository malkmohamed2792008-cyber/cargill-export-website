import React from 'react'

export default function FooterMinimal(){
  return (
    <footer className="bg-paper-husk border-t border-stone mt-12">
      <div className="container-main py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/هوية بصرية cargill/cargill-logo.svg" alt="CARGILL" className="w-28" />
            <div>
              <div className="text-sm text-text-muted">CARGILL</div>
              <div className="text-xs text-text-muted">© {new Date().getFullYear()} CARGILL</div>
            </div>
          </div>
          <div className="text-sm text-text-muted">Contact: contact@cargill-eg.com</div>
        </div>
      </div>
    </footer>
  )
}
