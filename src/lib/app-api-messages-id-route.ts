import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserIdFromToken } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const messages = await db.message.findMany({
      where: { threadId: params.id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        content: true,
        sender: true,
        createdAt: true,
      },
    })

    return NextResponse.json(messages, { status: 200 })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserIdFromToken(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await request.json()

    const message = await db.message.create({
      data: {
        content,
        threadId: params.id,
        sender: 'user',
      },
    })

    await db.thread.update({
      where: { id: params.id },
      data: { lastMessage: content, updatedAt: new Date() },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}