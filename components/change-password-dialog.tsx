"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Key } from 'lucide-react'

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
import { api } from '@/lib/api'

// Validation schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

interface ChangePasswordDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ChangePasswordDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: ChangePasswordDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Use external open state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalOnOpenChange || setInternalOpen
  const { user } = useAuth()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!user) return

    console.log('Changing password for user:', user.id)
    
    try {
      const result = await api.put(`/api/users/${user.id}/password`, {
        current_password: data.currentPassword,
        new_password: data.newPassword
      }, {
        showErrorToast: false
      })
      
      if (result.success) {
        toast({
          title: "Password changed",
          description: "Your password has been successfully updated.",
          duration: 3000,
        })
        
        reset() // Clear the form
        setOpen(false)
      } else {
        toast({
          title: "Password change failed",
          description: result.message || "Failed to change password. Please try again.",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error: any) {
      console.error('Password change error:', error)
      
      let errorMessage = "An unexpected error occurred. Please try again."
      
      // Handle different error formats
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

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      reset() // Clear form when dialog closes
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border border-gray-300 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Key className="h-5 w-5" />
            Change Password
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter your current password and choose a new password for your account.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
              Current Password
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
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                placeholder="Enter your new password"
                {...register('newPassword')}
              />
              <button
                type="button"
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                placeholder="Confirm your new password"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Changing Password...' : 'Change Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}