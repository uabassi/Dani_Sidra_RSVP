import { NextResponse } from 'next/server'
import { requireAdmin, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth'

export async function POST() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0))
  return response
}
