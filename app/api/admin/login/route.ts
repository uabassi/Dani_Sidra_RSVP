import { NextResponse } from 'next/server'
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifyAdminPassword,
} from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const password = typeof body.password === 'string' ? body.password : ''

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions())
    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
