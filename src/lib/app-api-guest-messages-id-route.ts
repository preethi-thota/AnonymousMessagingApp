import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
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
    console.error('Fetch guest messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { content } = await request.json()

    const message = await db.message.create({
      data: {
        content,
        threadId: params.id,
        sender: 'guest',
      },
    })

    await db.thread.update({
      where: { id: params.id },
      data: { lastMessage: content, updatedAt: new Date() },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Send guest message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}