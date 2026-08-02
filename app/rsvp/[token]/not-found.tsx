import Link from 'next/link'

export default function RsvpNotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-serif text-sm tracking-wide text-muted-foreground">Danieal &amp; Sidra</p>
      <h1 className="mt-3 font-serif text-4xl font-light text-foreground">Invitation not found</h1>
      <p className="mt-3 max-w-sm font-sans text-sm text-muted-foreground">
        This RSVP link is invalid or has been removed. Please contact the couple for a new invite.
      </p>
      <Link
        href="/"
        className="mt-8 font-sans text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Admin login
      </Link>
    </main>
  )
}
