"use client"

import React from 'react'
import { LogOut, User, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth'

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
              <h1 className="text-xl font-semibold text-gray-900">Home Page</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Welcome, {user.name}!
              </CardTitle>
              <CardDescription className="text-lg">
                This is your home page dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-blue-800">
                    You are successfully logged in to the application!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  User Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Active</div>
                <p className="text-xs text-gray-500">Currently logged in</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-gray-900 truncate">
                  {user.email}
                </div>
                <p className="text-xs text-gray-500">Your account email</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">Secure</div>
                <p className="text-xs text-gray-500">Authentication verified</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <User className="h-6 w-6 mb-2" />
                  Profile
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col">
                  <Home className="h-6 w-6 mb-2" />
                  Dashboard
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col">
                  <div className="h-6 w-6 mb-2 bg-gray-300 rounded" />
                  Settings
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col">
                  <div className="h-6 w-6 mb-2 bg-gray-300 rounded" />
                  Help
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
