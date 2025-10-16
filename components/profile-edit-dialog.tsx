"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AvatarUpload } from '@/components/ui/avatar-upload'
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
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
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
  const [avatarUrl, setAvatarUrl] = useState<string>('')

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
        setAvatarUrl(profileData.avatar || 'No avatar')
        setValue('username', profileData.username)
        setValue('email', profileData.email)
        setValue('name', profileData.name || '')
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
        name: data.name,
        avatar: avatarUrl, // Use the current avatar URL from state
        password: data.currentPassword, // Backend expects 'password' for current password
        ...(isCurrentUserAdmin ? { user_type: data.user_type || 0 } : {})
      }

      const result = await authApi.updateProfile(user.id, updateData)
      
      if (result.success && result.data) {
        // Update user context with new data
        const updatedUserData = {
          id: result.data.id || result.data._id || user.id,
          email: result.data.email,
          name: result.data.name || result.data.username,
          avatar: result.data.avatar
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

  const handleAvatarChange = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
    setValue('avatar', newAvatarUrl);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto bg-white border border-gray-300 shadow-2xl">
        <DialogHeader className="pb-3 border-b border-gray-200 sticky top-0 bg-white z-10">
          <DialogTitle className="flex items-center gap-2 text-gray-900 text-lg">
            <Settings className="h-5 w-5 text-blue-600" />
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            Update your profile information. Leave password empty to keep current password.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading profile...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3 pb-4">
            {/* Avatar Section - Always at top */}
            <div className="flex justify-center pb-4 border-b border-gray-100">
              <div className="text-center">
                <Label className="text-sm font-medium text-gray-700 block mb-3">
                  Avatar
                </Label>
                <AvatarUpload
                  currentAvatar={avatarUrl}
                  onAvatarChange={handleAvatarChange}
                  disabled={isSubmitting}
                  size="md"
                />
                {/* Hidden input to maintain form validation */}
                <input type="hidden" {...register('avatar')} />
              </div>
            </div>

            {/* Form Fields - Two columns on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                    placeholder="Enter your full name"
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
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
            </div>

            {/* Password and User Type - Full width */}
            <div className="space-y-4">
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
            </div>

            <DialogFooter className="pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 w-full">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}