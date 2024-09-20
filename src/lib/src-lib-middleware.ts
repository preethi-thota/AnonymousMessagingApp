import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Verify the token here
    // If verification fails, it will throw an error
    // which will be caught in the catch block
    return NextResponse.next()
  } catch {
    // We're not using 'error', so we can omit it
    return NextResponse.redirect(new URL('/login', request.url))
  }
}