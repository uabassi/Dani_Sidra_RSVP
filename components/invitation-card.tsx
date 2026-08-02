import Image from 'next/image'
import type { GuestInvite } from '@/lib/guest-types'

export function InvitationCard({ guest }: { guest: GuestInvite }) {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* soft color-band backdrop echoing the palette */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-sage/40 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blush/40 blur-3xl" />
        <div className="absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-sky/40 blur-3xl" />
      </div>

      <div className="w-full max-w-xl">
        <div className="relative rounded-[2rem] border border-border bg-card/80 px-6 py-14 text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:px-14">
          <Image
            src="/floral-wreath.png"
            alt=""
            aria-hidden="true"
            width={520}
            height={520}
            priority
            className="pointer-events-none absolute inset-0 m-auto h-full w-full max-w-[420px] object-contain opacity-70 mix-blend-multiply"
          />

          <div className="relative">
            <p dir="rtl" lang="ar" className="font-[family-name:var(--font-arabic)] text-2xl leading-relaxed text-foreground sm:text-3xl">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <p className="mt-4 font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
              In the name of Allah, the most gracious and the most merciful
            </p>

            <h1 className="mt-8 font-serif text-6xl font-light leading-none text-foreground sm:text-7xl">
              Danieal
              <span className="mx-3 inline-block align-middle text-4xl text-blush-foreground/70 sm:text-5xl">
                &
              </span>
              Sidra
            </h1>

            <p className="mx-auto mt-8 max-w-sm font-serif text-xl italic leading-relaxed text-muted-foreground">
              invite you to celebrate their Walima on
            </p>

            <div className="mt-10 flex items-center justify-center gap-6 font-sans">
              <div className="text-right">
                <p className="text-2xl font-light text-foreground">Thu</p>
              </div>
              <div className="border-x border-border px-6 text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">August</p>
                <p className="font-serif text-5xl font-light leading-tight text-foreground">20</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">2026</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-light text-foreground">6pm</p>
              </div>
            </div>

            <p className="mt-8 font-serif text-lg text-foreground">Cherry Blossom Banquet Hall</p>
            <p className="font-sans text-sm text-muted-foreground">
              466110 Lake Center Plaza, Sterling, VA 20165
            </p>
          </div>
        </div>

        <p className="mt-8 text-center font-sans text-sm text-muted-foreground">
          Addressed to <span className="font-semibold text-foreground">{guest.name}</span>
        </p>
      </div>
    </section>
  )
}
