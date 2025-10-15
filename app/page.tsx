"use client"

import React from 'react'
import { LogOut, User, Home, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth'
import { ProfileEditDialog } from '@/components/profile-edit-dialog'
import { ChangePasswordDialog } from '@/components/change-password-dialog'
import { UserDropdown } from '@/components/user-dropdown'
import { PostsSection } from '@/components/post/posts-section'

export default function HomePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Please log in to continue</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Posts</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <UserDropdown userName={user.name} />
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600">
                Discover and share amazing content with the community
              </p>
            </div>
          </div>

          {/* Posts Section */}
          <PostsSection />
        </div>
      </main>
    </div>
  )
}
