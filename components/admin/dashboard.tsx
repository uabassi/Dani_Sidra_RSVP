'use client'

import { useCallback, useRef, useState } from 'react'
import type { FamilyRow } from '@/lib/admin-data'

export type DashboardStats = {
  families: number
  pending: number
  responded: number
  invitedHeadcount: number
  attendingTotal: number
}

type Props = {
  initialFamilies: FamilyRow[]
  initialStats: DashboardStats
}

export function AdminDashboard({ initialFamilies, initialStats }: Props) {
  const [families, setFamilies] = useState(initialFamilies)
  const [stats, setStats] = useState(initialStats)
  const [importMessage, setImportMessage] = useState('')
  const [importError, setImportError] = useState('')
  const [importing, setImporting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(async () => {
    const res = await fetch('/api/admin/families')
    if (!res.ok) return
    const data = await res.json()
    setFamilies(
      data.families.map(
        (r: FamilyRow & { createdAt?: string | number }) => ({
          ...r,
          createdAt:
            typeof r.createdAt === 'string'
              ? r.createdAt
              : r.createdAt
                ? new Date(r.createdAt).toISOString()
                : '',
        }),
      ),
    )
    setStats(data.stats)
  }, [])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.reload()
  }

  async function handleCsv(file: File) {
    setImporting(true)
    setImportMessage('')
    setImportError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/families', { method: 'POST', body: form })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setImportError(data?.error ?? 'Import failed')
        if (data?.errors?.length) {
          setImportError(`${data.error}: ${data.errors.slice(0, 3).join('; ')}`)
        }
        return
      }
      setImportMessage(
        `Imported ${data.imported}${data.skipped ? `, skipped ${data.skipped} duplicate(s)` : ''}.`,
      )
      await refresh()
    } catch {
      setImportError('Unable to upload CSV')
    } finally {
      setImporting(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleRemove(id: string, name: string) {
    if (!window.confirm(`Remove “${name}” from the guest list?`)) return
    setRemovingId(id)
    try {
      const res = await fetch('/api/admin/families', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        alert(data?.error ?? 'Failed to remove')
        return
      }
      await refresh()
    } finally {
      setRemovingId(null)
    }
  }

  async function copyLink(token: string) {
    const url = `${window.location.origin}/rsvp/${token}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken((t) => (t === token ? null : t)), 2000)
    } catch {
      window.prompt('Copy this invite link:', url)
    }
  }

  const viewSiteHref = families[0] ? `/rsvp/${families[0].token}` : undefined

  return (
    <main className="min-h-svh bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-serif text-sm tracking-wide text-muted-foreground">
              Danieal &amp; Sidra
            </p>
            <h1 className="mt-1 font-serif text-4xl font-light text-foreground sm:text-5xl">
              RSVP dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {viewSiteHref ? (
              <a
                href={viewSiteHref}
                target="_blank"
                rel="noreferrer"
                className="font-sans text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                View site
              </a>
            ) : null}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-foreground px-4 py-2 font-sans text-sm font-semibold text-background transition-opacity hover:opacity-85"
            >
              Log out
            </button>
          </div>
        </header>

        <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Families" value={stats.families} />
          <StatCard label="Pending" value={stats.pending} highlight={stats.pending > 0} />
          <StatCard label="Responded" value={stats.responded} />
          <StatCard label="Invited (headcount)" value={stats.invitedHeadcount} />
          <StatCard label="Attending (total)" value={stats.attendingTotal} />
        </section>

        <section className="mt-10 rounded-[1.5rem] border border-border bg-card/80 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-light text-foreground">Import CSV</h2>
          <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
            Two columns: family name, number invited. Header row optional. Existing families (same
            name, ignoring case/spacing) are skipped.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleCsv(file)
            }}
          />
          <button
            type="button"
            disabled={importing}
            onClick={() => fileRef.current?.click()}
            className="mt-5 rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-all hover:bg-primary/85 disabled:opacity-40"
          >
            {importing ? 'Importing…' : 'Choose CSV'}
          </button>
          {importMessage ? (
            <p className="mt-3 font-sans text-sm text-sage-foreground">{importMessage}</p>
          ) : null}
          {importError ? (
            <p className="mt-3 font-sans text-sm text-destructive" role="alert">
              {importError}
            </p>
          ) : null}
        </section>

        <section className="mt-10 overflow-x-auto rounded-[1.5rem] border border-border bg-card/80">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground">
                <th className="px-4 py-4 font-semibold sm:px-6">Family</th>
                <th className="px-3 py-4 font-semibold">Invited</th>
                <th className="px-3 py-4 font-semibold">Status</th>
                <th className="px-3 py-4 font-semibold">Attending</th>
                <th className="px-3 py-4 font-semibold">#</th>
                <th className="px-3 py-4 font-semibold">Link</th>
                <th className="px-4 py-4 font-semibold sm:px-6">Remove</th>
              </tr>
            </thead>
            <tbody>
              {families.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center font-sans text-sm text-muted-foreground"
                  >
                    No families yet. Import a CSV to get started.
                  </td>
                </tr>
              ) : (
                families.map((family) => (
                  <tr key={family.id} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-4 font-sans text-sm text-foreground sm:px-6">
                      {family.name}
                    </td>
                    <td className="px-3 py-4 font-sans text-sm text-foreground">
                      {family.invitedCount}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={
                          family.status === 'responded'
                            ? 'inline-block rounded-full bg-sage/70 px-2.5 py-0.5 font-sans text-xs text-sage-foreground'
                            : 'inline-block rounded-full bg-blush/70 px-2.5 py-0.5 font-sans text-xs text-blush-foreground'
                        }
                      >
                        {family.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 font-sans text-sm text-foreground">
                      {family.status === 'responded'
                        ? family.attending === 'yes'
                          ? 'Yes'
                          : 'No'
                        : '—'}
                    </td>
                    <td className="px-3 py-4 font-sans text-sm text-foreground">
                      {family.attending === 'yes' ? (family.attendingCount ?? '—') : '—'}
                    </td>
                    <td className="px-3 py-4">
                      <button
                        type="button"
                        onClick={() => void copyLink(family.token)}
                        className="font-sans text-sm text-sky-foreground underline-offset-4 hover:underline"
                      >
                        {copiedToken === family.token ? 'Copied!' : 'Copy link'}
                      </button>
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <button
                        type="button"
                        disabled={removingId === family.id}
                        onClick={() => void handleRemove(family.id, family.name)}
                        className="font-sans text-sm text-destructive underline-offset-4 hover:underline disabled:opacity-40"
                      >
                        {removingId === family.id ? 'Removing…' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div className="rounded-[1.25rem] border border-border bg-card/80 px-4 py-5">
      <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className={
          highlight
            ? 'mt-2 font-serif text-3xl font-light text-destructive'
            : 'mt-2 font-serif text-3xl font-light text-foreground'
        }
      >
        {value}
      </p>
    </div>
  )
}
