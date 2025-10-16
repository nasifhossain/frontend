"use client";

import React, { useState, useRef } from 'react';
import { Upload, Camera, X, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cloudinaryService } from '@/lib/utils/cloudinary';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarUpload({ 
  currentAvatar, 
  onAvatarChange, 
  disabled = false,
  size = 'md',
  className = ""
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const handleFileSelect = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select a JPG, PNG, or WebP image.",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        variant: "destructive", 
        title: "File too large",
        description: "Avatar must be less than 5MB.",
      });
      return;
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setIsUploading(true);
      
      const result = await cloudinaryService.uploadUserAvatar(file);
      
      if (result.secure_url) {
        onAvatarChange(result.secure_url);
        toast({
          title: "Avatar uploaded",
          description: "Your avatar has been updated successfully.",
        });
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      
      // Revert preview on error
      setPreviewUrl(null);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to upload avatar. Please try again.";
        
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
      // Clean up object URL
      URL.revokeObjectURL(objectUrl);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = () => {
    if (disabled || isUploading) return;
    
    setPreviewUrl(null);
    onAvatarChange('No avatar');
    
    toast({
      title: "Avatar removed",
      description: "Your avatar has been removed.",
    });
  };

  const getDisplayAvatar = () => {
    if (previewUrl) return previewUrl;
    if (currentAvatar && currentAvatar !== 'No avatar') return currentAvatar;
    return null;
  };

  const displayAvatar = getDisplayAvatar();

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Avatar Display */}
      <div className={`relative ${sizeClasses[size]} group`}>
        <div 
          className={`${sizeClasses[size]} rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 cursor-pointer transition-all duration-200 hover:border-blue-400 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleFileSelect}
        >
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Fallback user icon */}
          <div 
            className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${
              displayAvatar ? 'hidden' : ''
            }`}
          >
            <User className={`${iconSizes[size]} text-gray-500`} />
          </div>

          {/* Upload overlay */}
          {!disabled && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {isUploading ? (
                <Loader2 className={`${iconSizes[size]} text-white animate-spin`} />
              ) : (
                <Camera className={`${iconSizes[size]} text-white`} />
              )}
            </div>
          )}
        </div>

        {/* Remove button */}
        {displayAvatar && !disabled && !isUploading && (
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full p-0 shadow-lg border-2 border-white bg-red-500 hover:bg-red-600 z-10"
            onClick={handleRemoveAvatar}
          >
            <X className="w-4 h-4 text-white" />
          </Button>
        )}
      </div>

      {/* Upload button */}
      <div className="flex flex-col items-center space-y-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFileSelect}
          disabled={disabled || isUploading}
          className="flex items-center space-x-2 text-xs"
        >
          {isUploading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Upload className="w-3 h-3" />
          )}
          <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
        </Button>
        
        <p className="text-xs text-gray-500 text-center max-w-28">
          Max 5MB
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}