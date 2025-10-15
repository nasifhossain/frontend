import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CommentsList } from './comments-list';
import { Post } from '@/lib/api/posts';

interface CommentsDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentsDialog({ post, open, onOpenChange }: CommentsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Comments for "{post.title}"</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <CommentsList postId={post._id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}