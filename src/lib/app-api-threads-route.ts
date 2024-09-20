import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserIdFromToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const userId = await getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const threads = await db.thread.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        lastMessage: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(threads, { status: 200 })
  } catch (error) {
    console.error('Fetch threads error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}