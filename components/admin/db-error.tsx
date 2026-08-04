'use client'

export function AdminDbError({ message }: { message?: string }) {
  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.reload()
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-sage/40 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blush/40 blur-3xl" />
      </div>

      <div className="w-full max-w-md rounded-[2rem] border border-border bg-card/90 px-8 py-10 text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] backdrop-blur-sm">
        <p className="font-serif text-sm tracking-wide text-muted-foreground">
          Danieal &amp; Sidra
        </p>
        <h1 className="mt-2 font-serif text-3xl font-light text-foreground">
          Dashboard unavailable
        </h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">
          {message ??
            'You are signed in, but the guest database could not be reached. Try again in a moment.'}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-all hover:bg-primary/85"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded-full border border-border bg-background px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-foreground transition-all hover:bg-secondary"
          >
            Log out
          </button>
        </div>
      </div>
    </main>
  )
}
