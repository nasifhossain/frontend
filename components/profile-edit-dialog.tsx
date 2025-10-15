"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/hooks/use-toast'
import { authApi } from '@/lib/api/auth'

// Validation schema
const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
  email: z.string().email("Please enter a valid email address"),
  currentPassword: z.string().min(1, "Current password is required to update profile"),
  avatar: z.string().optional(),
  user_type: z.number().min(0).max(1).optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileEditDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProfileEditDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: ProfileEditDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserType, setCurrentUserType] = useState<number>(0)

  // Use external open state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalOnOpenChange || setInternalOpen
  const { user, setUser } = useAuth()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  // Load user profile when dialog opens
  useEffect(() => {
    if (open && user) {
      loadProfile()
    }
  }, [open, user])

  const loadProfile = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const result = await authApi.getProfile()
      if (result.success && result.data) {
        const profileData = result.data
        setCurrentUserType(profileData.user_type || 0)
        setValue('username', profileData.username)
        setValue('email', profileData.email)
        setValue('avatar', profileData.avatar || 'No avatar')
        setValue('user_type', profileData.user_type || 0)
        setValue('currentPassword', '') // Clear current password field
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return

    const isCurrentUserAdmin = currentUserType === 1

    console.log('Updating profile with data:', { ...data, currentPassword: '***' })
    
    try {
      const updateData = {
        username: data.username,
        email: data.email,
        avatar: data.avatar || 'No avatar',
        password: data.currentPassword, // Backend expects 'password' for current password
        ...(isCurrentUserAdmin ? { user_type: data.user_type || 0 } : {})
      }

      const result = await authApi.updateProfile(user.id, updateData)
      
      if (result.success && result.data) {
        // Update user context with new data
        const updatedUserData = {
          id: result.data.id || result.data._id || user.id,
          email: result.data.email,
          name: result.data.username
        }
        
        setUser(updatedUserData)
        localStorage.setItem('user', JSON.stringify(updatedUserData))
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
          duration: 3000,
        })
        
        setOpen(false)
      } else {
        toast({
          title: "Update failed",
          description: result.message || "Failed to update profile. Please try again.",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      
      // Extract error message from different possible formats
      let errorMessage = "An unexpected error occurred. Please try again."
      
      if (error && typeof error === 'object') {
        if (error.message) {
          errorMessage = error.message
        } else if (error.details?.message) {
          errorMessage = error.details.message
        } else if (error.details?.error) {
          errorMessage = error.details.error
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white border border-gray-300 shadow-2xl">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Settings className="h-5 w-5 text-blue-600" />
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update your profile information. Leave password empty to keep current password.
            {currentUserType === 1 ? ' As an admin, you can modify user types.' : ' Only admins can modify user types.'}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading profile...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  placeholder="Enter your username"
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  placeholder="Enter your email"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                Current Password (required)
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  placeholder="Enter your current password"
                  {...register('currentPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar" className="text-sm font-medium text-gray-700">
                Avatar
              </Label>
              <Input
                id="avatar"
                type="text"
                placeholder="Avatar URL (will integrate Cloudinary later)"
                disabled
                {...register('avatar')}
                className="bg-gray-100 border-gray-300 text-gray-500"
              />
              <p className="text-xs text-gray-500">Avatar editing will be available after Cloudinary integration</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_type" className="text-sm font-medium text-gray-700">
                User Type
              </Label>
              {currentUserType === 1 ? (
                // Admin can edit user types
                <select
                  id="user_type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  {...register('user_type', { valueAsNumber: true })}
                >
                  <option value={0}>User</option>
                  <option value={1}>Admin</option>
                </select>
              ) : (
                // Regular users can only view their user type
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {currentUserType === 0 ? 'User' : 'Admin'}
                  <input type="hidden" {...register('user_type', { valueAsNumber: true })} />
                </div>
              )}
              {currentUserType !== 1 && (
                <p className="text-xs text-gray-500">Only admins can modify user types</p>
              )}
              {errors.user_type && (
                <p className="text-sm text-red-600">{errors.user_type.message}</p>
              )}
            </div>

            <DialogFooter className="pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}