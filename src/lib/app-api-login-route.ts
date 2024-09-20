import { NextResponse } from 'next/server'
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { db } from '@/lib/db'
import rateLimiter from '@/lib/rate-limiter'

export async function POST(request: Request) {
  try {
    await rateLimiter(request, NextResponse)

    const { email, password } = await request.json()
    const user = await db.user.findUnique({ where: { email } })

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    const token = sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' })

    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 })
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}