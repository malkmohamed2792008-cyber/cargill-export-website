export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-ink/60">403</p>
        <h1 className="mb-4 text-3xl font-semibold">Access denied</h1>
        <p className="text-ink/70">
          Your account is authenticated, but it does not have permission to access this area.
        </p>
      </div>
    </div>
  )
}
