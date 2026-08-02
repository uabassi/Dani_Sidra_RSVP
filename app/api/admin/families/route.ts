import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { computeStats, toFamilyRows } from '@/lib/admin-data'
import { db } from '@/lib/db'
import { families } from '@/lib/db/schema'
import {
  createId,
  createInviteToken,
  normalizeFamilyName,
  parseFamiliesCsv,
} from '@/lib/families'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const rows = await db.select().from(families).orderBy(asc(families.name))

  return NextResponse.json({
    families: toFamilyRows(rows),
    stats: computeStats(rows),
  })
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const contentType = request.headers.get('content-type') ?? ''

  let csvText = ''
  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'CSV file required' }, { status: 400 })
    }
    csvText = await file.text()
  } else {
    const body = await request.json().catch(() => null)
    if (!body || typeof body.csv !== 'string') {
      return NextResponse.json({ error: 'CSV content required' }, { status: 400 })
    }
    csvText = body.csv
  }

  const { rows, errors } = parseFamiliesCsv(csvText)
  if (rows.length === 0) {
    return NextResponse.json(
      { error: 'No valid rows found', errors },
      { status: 400 },
    )
  }

  const existing = await db
    .select({ nameNormalized: families.nameNormalized })
    .from(families)
  const existingSet = new Set(existing.map((e) => e.nameNormalized))

  const toInsert: (typeof families.$inferInsert)[] = []
  let skipped = 0
  const seenInBatch = new Set<string>()

  for (const row of rows) {
    const nameNormalized = normalizeFamilyName(row.name)
    if (existingSet.has(nameNormalized) || seenInBatch.has(nameNormalized)) {
      skipped++
      continue
    }
    seenInBatch.add(nameNormalized)
    toInsert.push({
      id: createId(),
      name: row.name.trim().replace(/\s+/g, ' '),
      nameNormalized,
      invitedCount: row.invitedCount,
      token: createInviteToken(),
      status: 'pending',
    })
  }

  if (toInsert.length > 0) {
    await db.insert(families).values(toInsert)
  }

  return NextResponse.json({
    imported: toInsert.length,
    skipped,
    errors,
  })
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const body = await request.json().catch(() => null)
  const id = body?.id
  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ error: 'Family id required' }, { status: 400 })
  }

  const deleted = await db
    .delete(families)
    .where(eq(families.id, id))
    .returning({ id: families.id })
  if (deleted.length === 0) {
    return NextResponse.json({ error: 'Family not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
