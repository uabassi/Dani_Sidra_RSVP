import Image from 'next/image'
import type { GuestInvite } from '@/lib/guest-types'

export function InvitationCard({ guest }: { guest: GuestInvite }) {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-3 py-10 sm:px-4 sm:py-14">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-sage/30 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blush/35 blur-3xl" />
        <div className="absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-sky/30 blur-3xl" />
      </div>

      <div className="w-full max-w-lg sm:max-w-xl">
        <Image
          src="/invitation.png"
          alt="Valima invitation for Danieal and Sidra — August 20, 2026 at Cherry Blossom Banquet Hall, Sterling, VA"
          width={1080}
          height={1620}
          priority
          className="h-auto w-full object-contain shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]"
          sizes="(max-width: 640px) 100vw, 576px"
        />

        <p className="mt-8 text-center font-sans text-sm text-muted-foreground">
          Addressed to <span className="font-semibold text-foreground">{guest.name}</span>
        </p>
      </div>
    </section>
  )
}
