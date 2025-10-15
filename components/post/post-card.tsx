import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PostImageGallery } from '@/components/ui/post-image-gallery';
import { CommentsDialog } from './comments-dialog';
import { Post } from '@/lib/api/posts';

interface PostCardProps {
  post: Post;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export function PostCard({ post, viewMode = 'grid', className }: PostCardProps) {
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const router = useRouter();

  const handlePostClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the comment button
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
      className={`hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full flex flex-col cursor-pointer border border-gray-200 hover:border-gray-300 bg-white ${className}`}
      onClick={handlePostClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getAvatarSrc(post.user_id.avatar) ? (
              <img
                src={getAvatarSrc(post.user_id.avatar)!}
                alt={post.user_id.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm ${getAvatarSrc(post.user_id.avatar) ? 'hidden' : ''}`}
            >
              {post.user_id.username.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {post.user_id.username}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
                post.user_id.user_type === 1 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {getUserTypeLabel(post.user_id.user_type)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-grow flex flex-col">
        <div className="space-y-3 flex-grow">
          <h2 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
          
          <p className="text-gray-700 leading-relaxed line-clamp-3">
            {post.caption}
          </p>
          
          {/* Images Gallery - Only show if content exists and has images */}
          {post.content && post.content.length > 0 ? (
            <div onClick={(e) => e.stopPropagation()}>
              <PostImageGallery 
                images={post.content}
                alt={`Images for ${post.title}`}
                className="mt-3"
                compact={true}
              />
            </div>
          ) : (
            /* Add visual interest for text-only posts in grid view */
            viewMode === 'grid' && (
              <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Join the discussion
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setCommentsDialogOpen(true);
              }}
              className="flex items-center space-x-1 h-auto p-1 text-gray-500 hover:text-blue-600"
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <span>{post.comment_count}</span>
              <span className="hidden sm:inline">{post.comment_count === 1 ? 'comment' : 'comments'}</span>
            </Button>
          </div>
          
          <div className="text-xs text-gray-400">
            {post.createdAt !== post.updatedAt && (
              <span className="truncate">Edited</span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CommentsDialog
        post={post}
        open={commentsDialogOpen}
        onOpenChange={setCommentsDialogOpen}
      />
    </Card>
  );
}