import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { families } from '@/lib/db/schema'

type Params = { params: Promise<{ token: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { token } = await params
  const [family] = await db.select().from(families).where(eq(families.token, token)).limit(1)

  if (!family) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  }

  return NextResponse.json({
    name: family.name,
    maxGuests: family.invitedCount,
    status: family.status,
    attending: family.attending,
    attendingCount: family.attendingCount,
  })
}

export async function POST(request: Request, { params }: Params) {
  const { token } = await params
  const [family] = await db.select().from(families).where(eq(families.token, token)).limit(1)

  if (!family) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  }

  const body = await request.json().catch(() => null)
  const attending = body?.attending
  if (attending !== 'yes' && attending !== 'no') {
    return NextResponse.json({ error: 'attending must be yes or no' }, { status: 400 })
  }

  let attendingCount: number | null = null
  if (attending === 'yes') {
    const count = Number(body?.count)
    if (!Number.isFinite(count) || count < 1 || count > family.invitedCount) {
      return NextResponse.json(
        { error: `count must be between 1 and ${family.invitedCount}` },
        { status: 400 },
      )
    }
    attendingCount = count
  }

  const [updated] = await db
    .update(families)
    .set({
      status: 'responded',
      attending,
      attendingCount,
    })
    .where(eq(families.token, token))
    .returning()

  return NextResponse.json({
    name: updated.name,
    maxGuests: updated.invitedCount,
    status: updated.status,
    attending: updated.attending,
    attendingCount: updated.attendingCount,
  })
}
