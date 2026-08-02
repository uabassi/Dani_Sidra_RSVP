'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CalendarPlus, Check, Heart, Minus, Plus, X } from 'lucide-react'
import { downloadIcsFile, getGoogleCalendarUrl } from '@/lib/event'
import { cn } from '@/lib/utils'
import type { GuestInvite } from '@/lib/guest-types'

type Attendance = 'yes' | 'no' | null

export function RsvpForm({ guest }: { guest: GuestInvite }) {
  const alreadyResponded = guest.status === 'responded' && guest.attending !== null
  const [attending, setAttending] = useState<Attendance>(
    alreadyResponded ? guest.attending : null,
  )
  const [count, setCount] = useState(
    alreadyResponded && guest.attending === 'yes' ? (guest.attendingCount ?? 1) : 1,
  )
  const [submitted, setSubmitted] = useState(alreadyResponded)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!attending) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/rsvp/${guest.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attending,
          count: attending === 'yes' ? count : undefined,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Could not save your response')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Unable to reach the server')
    } finally {
      setLoading(false)
    }
  }

  if (submitted && attending) {
    return (
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-border bg-card px-8 py-14 text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage text-sage-foreground">
          <Heart className="size-6" />
        </div>
        <h3 className="mt-6 font-serif text-3xl font-light text-foreground">
          {attending === 'yes' ? "We can't wait to see you!" : 'Thank you for letting us know'}
        </h3>
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
          {attending === 'yes'
            ? `Your response for ${count} ${count === 1 ? 'guest' : 'guests'} has been recorded. Danieal & Sidra are so grateful you'll be joining them.`
            : `We'll miss you dearly, ${guest.name}, but thank you for your reply. You'll be in our hearts on the day.`}
        </p>

        {attending === 'yes' ? (
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={downloadIcsFile}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary font-sans text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-all hover:bg-primary/85"
            >
              <CalendarPlus className="size-4" />
              Add to calendar
            </button>
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noreferrer"
              className="font-sans text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Open in Google Calendar
            </a>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-8 font-sans text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Change my response
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md rounded-[2rem] border border-border bg-card px-6 py-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] sm:px-10"
    >
      <fieldset>
        <legend className="mb-4 block text-center font-sans text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Will you be attending?
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAttending('yes')}
            aria-pressed={attending === 'yes'}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl border px-4 py-6 font-sans transition-all',
              attending === 'yes'
                ? 'border-transparent bg-sage text-sage-foreground shadow-md'
                : 'border-border bg-background text-muted-foreground hover:border-sage hover:text-foreground',
            )}
          >
            <span
              className={cn(
                'flex size-9 items-center justify-center rounded-full',
                attending === 'yes' ? 'bg-sage-foreground/10' : 'bg-muted',
              )}
            >
              <Check className="size-5" />
            </span>
            <span className="font-serif text-lg">Joyfully accepts</span>
          </button>

          <button
            type="button"
            onClick={() => setAttending('no')}
            aria-pressed={attending === 'no'}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl border px-4 py-6 font-sans transition-all',
              attending === 'no'
                ? 'border-transparent bg-blush text-blush-foreground shadow-md'
                : 'border-border bg-background text-muted-foreground hover:border-blush hover:text-foreground',
            )}
          >
            <span
              className={cn(
                'flex size-9 items-center justify-center rounded-full',
                attending === 'no' ? 'bg-blush-foreground/10' : 'bg-muted',
              )}
            >
              <X className="size-5" />
            </span>
            <span className="font-serif text-lg">Regretfully declines</span>
          </button>
        </div>
      </fieldset>

      <div
        className={cn(
          'grid transition-all duration-300',
          attending === 'yes' ? 'mt-6 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="rounded-2xl bg-sky/40 px-5 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-sans text-sm font-semibold text-foreground">Number of guests</p>
                <p className="font-sans text-xs text-muted-foreground">
                  Up to {guest.maxGuests} reserved for you
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCount((c) => Math.max(1, c - 1))}
                  disabled={count <= 1}
                  aria-label="Decrease guest count"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <Minus className="size-4" />
                </button>
                <span
                  aria-live="polite"
                  className="w-6 text-center font-serif text-2xl font-light text-foreground"
                >
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => setCount((c) => Math.min(guest.maxGuests, c + 1))}
                  disabled={count >= guest.maxGuests}
                  aria-label="Increase guest count"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-center font-sans text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!attending || loading}
        className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-sans text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? 'Sending…' : 'Send response'}
      </button>

      <Image
        src="/floral-sprig.png"
        alt=""
        aria-hidden="true"
        width={220}
        height={70}
        className="mx-auto mt-8 h-auto w-40 object-contain opacity-80 mix-blend-multiply"
      />
    </form>
  )
}
