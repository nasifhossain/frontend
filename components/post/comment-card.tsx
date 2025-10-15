import React, { useState } from 'react';
import { MessageCircle, User, Reply, ThumbsUp, MoreVertical } from 'lucide-react';
import { Comment } from '@/lib/api/comments';
import { CommentForm } from './comment-form';

interface CommentCardProps {
  comment: Comment;
  postId: string;
  depth?: number;
  onReply?: (parentId: string) => void;
  onCommentAdded?: () => void;
  className?: string;
}

export function CommentCard({ comment, postId, depth = 0, onReply, onCommentAdded, className }: CommentCardProps) {
  const [showReplies, setShowReplies] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getAvatarSrc = (avatar: string) => {
    if (!avatar || avatar === 'No avatar') {
      return null;
    }
    return avatar;
  };

  const getUserTypeLabel = (userType: number) => {
    switch (userType) {
      case 0: return 'User';
      case 1: return 'Admin';
      default: return 'User';
    }
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onCommentAdded?.();
  };

  const handleReplyClick = () => {
    if (onReply) {
      onReply(comment._id);
    } else {
      setShowReplyForm(!showReplyForm);
    }
  };

  const indentLevel = Math.min(depth, 3); // Limit indentation to avoid too much nesting
  
  const getIndentClass = (level: number) => {
    switch (level) {
      case 0: return '';
      case 1: return 'pl-4';
      case 2: return 'pl-8';
      case 3: return 'pl-12';
      default: return 'pl-12';
    }
  };

  return (
    <div className={`${className}`}>
      <div 
        className={`${getIndentClass(indentLevel)} ${depth > 0 ? 'border-l-2 border-gray-100 ml-4' : ''}`}
      >
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
          {/* Comment Header */}
          <div className="flex items-start space-x-3 mb-3">
            <div className="flex-shrink-0">
              {getAvatarSrc(comment.user.avatar) ? (
                <img
                  src={getAvatarSrc(comment.user.avatar)!}
                  alt={`${comment.user.username}'s avatar`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-gray-900 text-sm truncate">
                  {comment.user.username}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  comment.user.user_type === 1 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}>
                  {getUserTypeLabel(comment.user.user_type)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.commented_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Comment Content */}
          <div className="mb-3">
            <p className="text-gray-700 text-sm leading-relaxed">
              {comment.content}
            </p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center space-x-4 text-xs">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
              <ThumbsUp className="w-3 h-3" />
              <span>{comment.upvotes}</span>
            </button>
            
            <button
              onClick={handleReplyClick}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Reply className="w-3 h-3" />
              <span>Reply</span>
            </button>

            {comment.replyCount > 0 && (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                <span>{showReplies ? 'Hide' : 'Show'} {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <CommentForm
              postId={postId}
              parentCommentId={comment._id}
              placeholder={`Reply to ${comment.user.username}...`}
              onSuccess={handleReplySuccess}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {/* Nested Replies */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply._id}
                comment={reply}
                postId={postId}
                depth={depth + 1}
                onCommentAdded={onCommentAdded}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}