"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { postsApi } from '@/lib/api/posts';
import { useToast } from '@/hooks/use-toast';

interface CreatePostDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onPostCreated?: () => void;
}

export function CreatePostDialog({ open: controlledOpen, onOpenChange, onPostCreated }: CreatePostDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    content: [] // Dummy Cloudinary image
  });
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      caption: '',
      content: [] // Reset to dummy image
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.caption.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in both title and caption fields.",
      });
      return;
    }

    setLoading(true);
    
    try {
      await postsApi.createPost({
        title: formData.title.trim(),
        caption: formData.caption.trim(),
        content: formData.content
      });

      toast({
        title: "Success",
        description: "Your post has been created successfully!",
      });

      resetForm();
      setOpen(false);
      onPostCreated?.();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Post</span>
          </DialogTitle>
          <DialogDescription>
            Share your thoughts and ideas with the community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter post title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={loading}
              maxLength={100}
              required
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.title.length}/100
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption *</Label>
            <Textarea
              id="caption"
              placeholder="What's on your mind?"
              value={formData.caption}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('caption', e.target.value)}
              disabled={loading}
              maxLength={500}
              rows={4}
              required
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.caption.length}/500
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
              Content will contain Cloudinary image links. Currently using dummy image:
              <div className="mt-2 text-xs font-mono text-gray-500 break-all">
                {formData.content[0]}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.caption.trim()}
            >
              {loading ? 'Creating...' : 'Create Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}