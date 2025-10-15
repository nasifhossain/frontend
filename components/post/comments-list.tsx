import React, { useState, useEffect } from 'react';
import { MessageCircle, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { CommentCard } from './comment-card';
import { CommentForm } from './comment-form';
import { Button } from '@/components/ui/button';
import { commentsApi, Comment } from '@/lib/api/comments';
import { useToast } from '@/hooks/use-toast';

interface CommentsListProps {
  postId: string;
  className?: string;
}

export function CommentsList({ postId, className }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { toast } = useToast();

  const fetchComments = async (showRefreshMessage = false) => {
    try {
      setError(null);
      if (!showRefreshMessage) {
        setLoading(true);
      }
      
      const response = await commentsApi.getCommentsByPost(postId);
      
      if (response.success && response.data?.comments) {
        setComments(response.data.comments);
        if (showRefreshMessage) {
          toast({
            title: "Comments refreshed",
            description: `Loaded ${response.data.comments.length} comments`,
          });
        }
      } else {
        throw new Error(response.message || 'Failed to fetch comments');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load comments';
      setError(errorMessage);
      console.error('Error fetching comments:', err);
      
      if (showRefreshMessage) {
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleRefresh = () => {
    fetchComments(true);
  };

  const handleReply = (parentId: string) => {
    // Reply functionality is handled directly in CommentCard component
    // This is just a fallback that shouldn't be needed
    console.log('Reply to comment:', parentId);
  };

  const handleCommentSuccess = () => {
    setShowCommentForm(false);
    fetchComments(true);
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-medium text-gray-900">Error Loading Comments</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="bg-gray-50 rounded-lg p-6">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Comments Yet</h3>
          <p className="text-gray-500">Be the first to comment on this post!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowCommentForm(!showCommentForm)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{showCommentForm ? 'Cancel' : 'Add Comment'}</span>
          </Button>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <CommentForm
            postId={postId}
            parentCommentId={null}
            placeholder="Write a comment..."
            onSuccess={handleCommentSuccess}
            onCancel={() => setShowCommentForm(false)}
          />
        </div>
      )}
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            postId={postId}
            onCommentAdded={() => fetchComments(true)}
          />
        ))}
      </div>
    </div>
  );
}