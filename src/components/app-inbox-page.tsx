"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut } from 'lucide-react'

interface Thread {
  id: string
  lastMessage: string
  timestamp: string
}

export function Page() {
  const [threads, setThreads] = useState<Thread[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchThreads()
  }, [])

  const fetchThreads = async () => {
    try {
      const response = await fetch('/api/threads')
      if (response.ok) {
        const data = await response.json()
        setThreads(data)
      } else {
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      console.error('Fetching threads failed:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' })
      if (response.ok) {
        router.push('/login')
      } else {
        // Handle logout error
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <Button onClick={handleLogout} variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-4">
          {threads.map((thread) => (
            <Card key={thread.id} className="cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/thread/${thread.id}`)}>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{thread.lastMessage}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-gray-500">
                {new Date(thread.timestamp).toLocaleString()}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}