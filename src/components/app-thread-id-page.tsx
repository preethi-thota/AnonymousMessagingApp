"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'guest'
  timestamp: string
}

export function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const { id } = useParams()

  useEffect(() => {
    fetchMessages()
  }, [id])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${id}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else {
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      console.error('Fetching messages failed:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      })
      if (response.ok) {
        setNewMessage('')
        fetchMessages()
      } else {
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      console.error('Sending message failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-[calc(100vh-200px)] overflow-y-auto">
          {messages.map((message) => (
            <Card key={message.id} className={`mb-2 ${message.sender === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'}`}>
              <CardContent className="p-2">
                <p>{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(message.timestamp).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}