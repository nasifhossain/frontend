import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { commentsApi } from '@/lib/api/comments';
import { useToast } from '@/hooks/use-toast';

interface CommentFormProps {
  postId: string;
  parentCommentId?: string | null;
  placeholder?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function CommentForm({ 
  postId, 
  parentCommentId = null, 
  placeholder = "Write a comment...",
  onSuccess,
  onCancel,
  className 
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a comment.",
      });
      return;
    }

    setLoading(true);
    
    try {
      const commentData = {
        post: postId,
        content: content.trim(),
        ...(parentCommentId && { parent_comment: parentCommentId })
      };

      await commentsApi.createComment(commentData);

      toast({
        title: "Success",
        description: parentCommentId ? "Reply posted successfully!" : "Comment posted successfully!",
      });

      setContent('');
      onSuccess?.();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post comment. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <div className="space-y-2">
        <Textarea
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          maxLength={500}
          rows={3}
          className="resize-none"
          required
        />
        <div className="text-xs text-gray-500 text-right">
          {content.length}/500
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {parentCommentId ? 'Replying to comment' : 'Commenting on post'}
        </div>
        <div className="flex items-center space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={loading || !content.trim()}
          >
            <Send className="h-4 w-4 mr-1" />
            {loading ? 'Posting...' : (parentCommentId ? 'Reply' : 'Comment')}
          </Button>
        </div>
      </div>
    </form>
  );
}