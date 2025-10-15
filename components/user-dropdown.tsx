"use client"

import React, { useState } from 'react'
import { User, Settings, Lock, ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProfileEditDialog } from '@/components/profile-edit-dialog'
import { ChangePasswordDialog } from '@/components/change-password-dialog'

interface UserDropdownProps {
  userName: string
}

export function UserDropdown({ userName }: UserDropdownProps) {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-gray-100 rounded-md px-2 py-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
          <User className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-700">{userName}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">Manage your account</p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setProfileDialogOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setPasswordDialogOpen(true)}
          >
            <Lock className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileEditDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <div style={{ display: 'none' }} />
      </ProfileEditDialog>
      
      <ChangePasswordDialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <div style={{ display: 'none' }} />
      </ChangePasswordDialog>
    </>
  )
}