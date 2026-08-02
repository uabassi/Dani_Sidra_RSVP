'use client'

import { useState } from 'react'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Login failed')
        return
      }
      window.location.reload()
    } catch {
      setError('Unable to reach the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-sage/40 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blush/40 blur-3xl" />
        <div className="absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-sky/40 blur-3xl" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-[2rem] border border-border bg-card/90 px-8 py-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] backdrop-blur-sm"
      >
        <p className="text-center font-serif text-sm tracking-wide text-muted-foreground">
          Danieal &amp; Sidra
        </p>
        <h1 className="mt-2 text-center font-serif text-3xl font-light text-foreground">
          RSVP dashboard
        </h1>
        <p className="mt-2 text-center font-sans text-sm text-muted-foreground">
          Enter the admin password to continue
        </p>

        <label className="mt-8 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="mt-2 h-11 w-full rounded-full border border-border bg-background px-4 font-sans text-sm text-foreground outline-none ring-ring focus:ring-2"
          />
        </label>

        {error ? (
          <p className="mt-3 font-sans text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-primary font-sans text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </main>
  )
}
