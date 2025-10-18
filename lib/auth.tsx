"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from './api/auth'

// Types
interface User {
  id: string
  email: string
  name: string
  avatar?: string
  user_type?: number
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>
  register: (username: string, email: string, name: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>
  logout: () => void
  isLoading: boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (identifier: string, password: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    console.log('Auth login function called with:', { identifier, password: '***' })
    setIsLoading(true)
    
    try {
      console.log('Calling authApi.login...')
      const result = await authApi.login({ identifier, password })
      console.log('Auth API result received:', result)
      
      if (result.success && result.data) {
        console.log('Login successful, setting user data')
        const userData: User = {
          id: result.data.user.id || result.data.user._id || '',
          email: result.data.user.email,
          name: result.data.user.username,
          avatar: result.data.user.avatar,
          user_type: result.data.user.user_type
        }
        
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        setIsLoading(false)
        return { success: true }
      } else {
        console.log('Login failed, no success or data')
        setIsLoading(false)
        return { success: false, error: result.message || 'Invalid credentials' }
      }
    } catch (error) {
      console.error('Login catch block error:', error)
      setIsLoading(false)
      
      // Extract error message from the error object
      let errorMessage = 'An error occurred during login'
      
      if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message
        } else if ('details' in error && error.details && typeof error.details === 'object') {
          if ('message' in error.details) {
            errorMessage = error.details.message as string
          } else if ('error' in error.details) {
            errorMessage = error.details.error as string
          }
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const register = async (username: string, email: string, name: string, password: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    console.log('Auth register function called with:', { username, email, name, password: '***' })
    setIsLoading(true)
    
    try {
      console.log('Calling authApi.register...')
      const result = await authApi.register({ username, email, name, password })
      console.log('Register API result received:', result)
      
      if (result.success) {
        console.log('Registration successful')
        setIsLoading(false)
        return { success: true, message: result.message || 'Registration successful' }
      } else {
        console.log('Registration failed, no success')
        setIsLoading(false)
        return { success: false, error: result.message || 'Registration failed' }
      }
    } catch (error) {
      console.error('Register catch block error:', error)
      setIsLoading(false)
      
      // Extract error message from the error object
      let errorMessage = 'An error occurred during registration'
      
      if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message
        } else if ('details' in error && error.details && typeof error.details === 'object') {
          if ('message' in error.details) {
            errorMessage = error.details.message as string
          } else if ('error' in error.details) {
            errorMessage = error.details.error as string
          }
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/login')
  }

  const value: AuthContextType = {
    user,
    setUser,
    login,
    register,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/login')
      }
    }, [user, isLoading, router])

    if (isLoading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (!user) {
      return null
    }

    return <Component {...props} />
  }
}