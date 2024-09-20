"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy, Link as LinkIcon } from "lucide-react"
import Link from 'next/link'

export function Homepage() {
  const [generatedLink, setGeneratedLink] = useState('')
  const [email, setEmail] = useState('')

  const generateLink = () => {
    // In a real app, this would call an API to generate a unique link
    const newLink = `https://yourdomain.com/msg/${Math.random().toString(36).substr(2, 9)}`
    setGeneratedLink(newLink)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
    // You might want to show a toast notification here
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to initiate the signup process
    console.log('Signup initiated with email:', email)
    // Redirect to email verification page would happen here
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Anonymous Messaging App</CardTitle>
          <CardDescription className="text-center">
            Send and receive messages anonymously. Generate a link to share or sign up to manage your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="generate-link">Generate Anonymous Link</Label>
            <div className="flex space-x-2">
              <Input
                id="generate-link"
                placeholder="Click to generate link"
                value={generatedLink}
                readOnly
              />
              <Button onClick={generateLink} size="icon">
                <LinkIcon className="h-4 w-4" />
              </Button>
              {generatedLink && (
                <Button onClick={copyToClipboard} size="icon" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <form onSubmit={handleSignup} className="space-y-2">
            <Label htmlFor="email">Register with Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-blue-600 hover:underline">
            Already have an account? Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}