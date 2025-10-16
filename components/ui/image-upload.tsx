import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cloudinaryService } from '@/lib/utils/cloudinary';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  disabled = false, 
  className 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images per post.`,
      });
      return;
    }

    const tempIds = files.map(() => `temp-${Date.now()}-${Math.random()}`);
    setUploading(prev => [...prev, ...tempIds]);

    try {
      // Upload all files concurrently
      const uploadPromises = files.map(async (file) => {
        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select only image files (JPG, PNG, WEBP).');
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
          throw new Error('Image size must be less than 10MB.');
        }

        // Upload to Cloudinary
        return await cloudinaryService.uploadPostImage(file);
      });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      const uploadedUrls = results.map(result => result.secure_url);

      // Update all images at once
      onImagesChange([...images, ...uploadedUrls]);

      toast({
        title: "Images uploaded",
        description: `${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded successfully!`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload images. Please try again.",
      });
    } finally {
      setUploading(prev => prev.filter(id => !tempIds.includes(id)));
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  const canAddMore = images.length < maxImages && !disabled;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Button */}
      {canAddMore && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || uploading.length > 0}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading.length > 0}
            className="w-full border-dashed border-2 h-20 hover:bg-gray-50"
          >
            <div className="flex flex-col items-center space-y-2">
              {uploading.length > 0 ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">Uploading {uploading.length} image{uploading.length > 1 ? 's' : ''}...</span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload images ({images.length}/{maxImages})
                  </span>
                </>
              )}
            </div>
          </Button>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Error+Loading';
                  }}
                />
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={disabled || uploading.length > 0}
                  className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-70 hover:opacity-100 group-hover:opacity-100 transition-all hover:bg-red-600 disabled:opacity-50 shadow-lg border-2 border-white z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Status */}
      {uploading.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Uploading {uploading.length} image{uploading.length > 1 ? 's' : ''}... Please wait.
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <p>• Supported formats: JPG, PNG, WEBP</p>
        <p>• Maximum file size: 10MB per image</p>
        <p>• Maximum {maxImages} images per post</p>
      </div>
    </div>
  );
}