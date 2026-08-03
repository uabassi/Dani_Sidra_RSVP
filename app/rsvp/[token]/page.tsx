import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { InvitationCard } from '@/components/invitation-card'
import { RsvpForm } from '@/components/rsvp-form'
import { db } from '@/lib/db'
import { families } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ token: string }>
}

export default async function RsvpPage({ params }: Props) {
  const { token } = await params
  const [family] = await db.select().from(families).where(eq(families.token, token)).limit(1)

  if (!family) {
    notFound()
  }

  const guest = {
    name: family.name,
    maxGuests: family.invitedCount,
    token: family.token,
    status: family.status,
    attending: family.attending,
    attendingCount: family.attendingCount,
  }

  return (
    <main className="relative">
      <InvitationCard guest={guest} />

      <div className="pointer-events-none flex flex-col items-center gap-2 pb-6 text-muted-foreground">
        <span className="font-sans text-xs uppercase tracking-[0.3em]">Kindly respond below</span>
        <ChevronDown className="size-5 animate-bounce" />
      </div>

      <section
        id="rsvp"
        className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-20"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-secondary/30" />

        <div className="mb-10 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {guest.name}
          </p>
          <h2 className="mt-4 font-serif text-5xl font-light text-foreground sm:text-6xl">RSVP</h2>
          <p className="mx-auto mt-4 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
            We would be honored to have you celebrate with us. Please let us know if you can make it.
          </p>
        </div>

        <RsvpForm guest={guest} />

        <footer className="mt-14 flex flex-col items-center gap-3 text-center">
          <Image
            src="/floral-sprig.png"
            alt=""
            aria-hidden="true"
            width={200}
            height={64}
            className="h-auto w-32 object-contain opacity-60 mix-blend-multiply"
          />
          <p className="font-serif text-lg text-foreground">Danieal &amp; Sidra</p>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
            08.20.2026 &middot; Sterling, VA
          </p>
        </footer>
      </section>
    </main>
  )
}
