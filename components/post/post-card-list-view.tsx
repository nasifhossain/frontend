import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Clock, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CommentsList } from './comments-list';
import { Post } from '@/lib/api/posts';

interface PostCardListViewProps {
  post: Post;
  className?: string;
}

export function PostCardListView({ post, className }: PostCardListViewProps) {
  const [showComments, setShowComments] = useState(false);
  const router = useRouter();

  const handlePostClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/posts/${post._id}`);
  };

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

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${className}`}
      onClick={handlePostClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getAvatarSrc(post.user_id.avatar) ? (
              <img
                src={getAvatarSrc(post.user_id.avatar)!}
                alt={`${post.user_id.username}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {post.user_id.name || post.user_id.username}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                post.user_id.user_type === 1 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}>
                {getUserTypeLabel(post.user_id.user_type)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{formatDate(post.createdAt)}</span>
              {post.createdAt !== post.updatedAt && (
                <span className="text-gray-400">• Edited</span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 leading-tight hover:text-blue-600 transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {post.caption}
            </p>
          </div>
          
          {post.content && post.content.length > 0 && (
            <div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {post.content.slice(0, 4).map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={imageUrl}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Image+Not+Found';
                    }}
                  />
                  {index === 3 && post.content.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        +{post.content.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-600"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comment_count}</span>
            <span>{post.comment_count === 1 ? 'comment' : 'comments'}</span>
            {showComments ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          
          <div className="text-xs text-gray-400">
            {post.createdAt !== post.updatedAt && (
              <span className="truncate">Edited</span>
            )}
          </div>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <CommentsList postId={post._id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}