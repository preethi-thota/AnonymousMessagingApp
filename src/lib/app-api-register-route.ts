import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { sendVerificationEmail } from '@/lib/email'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const existingUser = await db.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const verificationToken = uuidv4()
    const user = await db.user.create({
      data: {
        email,
        verificationToken,
      },
    })

    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}