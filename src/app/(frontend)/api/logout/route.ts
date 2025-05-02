// app/api/logout/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL('/login', req.nextUrl.origin)

  const response = NextResponse.redirect(url)

  response.cookies.set('payload-token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  })

  return response
}