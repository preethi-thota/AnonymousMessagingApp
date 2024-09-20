import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { otp } = await request.json()
    const user = await db.user.findFirst({ where: { verificationToken: otp } })

    if (!user) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    await db.user.update({
      where: { id: user.id },
      data: { verified: true, verificationToken: null },
    })

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}