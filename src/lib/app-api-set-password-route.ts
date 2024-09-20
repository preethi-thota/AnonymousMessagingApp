import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const userId = request.headers.get('X-User-Id') // Assume this is set after verification

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hashedPassword = await hash(password, 10)
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: 'Password set successfully' }, { status: 200 })
  } catch (error) {
    console.error('Set password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}