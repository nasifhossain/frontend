"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, User, MessageCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PostImageGallery } from '@/components/ui/post-image-gallery';
import { CommentCard } from '@/components/post/comment-card';
import { CommentForm } from '@/components/post/comment-form';
import { postsApi, Post } from '@/lib/api/posts';
import { useToast } from '@/hooks/use-toast';

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchPost = async (showRefreshMessage = false) => {
    try {
      setError(null);
      if (!showRefreshMessage) {
        setLoading(true);
      }
      
      const response = await postsApi.getPostById(params.id);
      
      if (response.success && response.data?.post) {
        setPost(response.data.post);
        if (showRefreshMessage) {
          toast({
            title: "Post refreshed",
            description: "Post details have been updated",
          });
        }
      } else {
        throw new Error(response.message || 'Failed to fetch post');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load post';
      setError(errorMessage);
      console.error('Error fetching post:', err);
      
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
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const handleRefresh = () => {
    fetchPost(true);
  };

  const handleUserClick = () => {
    if (post) {
      router.push(`/user/${post.user_id._id}`);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
              <div className="h-6 bg-gray-300 rounded w-32"></div>
            </div>
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-white rounded-lg border p-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-medium text-gray-900">Error Loading Post</h3>
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex items-center justify-center space-x-4">
                <Button onClick={() => router.back()} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-white rounded-lg border p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Post Not Found</h3>
              <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
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

        {/* Post Details */}
        <Card className={`mb-8 ${
          (!post.content || post.content.length === 0) 
            ? 'bg-gradient-to-br from-gray-50 to-white border-gray-200' 
            : 'bg-white'
        }`}>
          <CardHeader className="pb-4">
            <div className="flex items-start space-x-4">
              <div 
                className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleUserClick}
              >
                {getAvatarSrc(post.user_id.avatar) ? (
                  <img
                    src={getAvatarSrc(post.user_id.avatar)!}
                    alt={`${post.user_id.username}'s avatar`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 hover:border-blue-300 transition-colors"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 
                    className="font-semibold text-gray-900 text-lg cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={handleUserClick}
                  >
                    {post.user_id.username}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    post.user_id.user_type === 1 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}>
                    {getUserTypeLabel(post.user_id.user_type)}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  {post.createdAt !== post.updatedAt && (
                    <span className="text-gray-400">• Edited</span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Post Content */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed">
                {post.caption}
              </p>
            </div>
            
            {/* Images Gallery - Only show if content exists and has images */}
            {post.content && post.content.length > 0 && (
              <PostImageGallery 
                images={post.content}
                alt={`Images for ${post.title}`}
                className="max-w-2xl"
              />
            )}

            {/* Post Stats */}
            <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{post.comment_count}</span>
                <span>{post.comment_count === 1 ? 'comment' : 'comments'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Comments ({post.comments?.length || 0})
            </h2>
          </div>

          {/* Add Comment Form */}
          <div className="bg-gray-50 rounded-lg p-4">
            <CommentForm
              postId={post._id}
              parentCommentId={null}
              placeholder="Write a comment..."
              onSuccess={() => fetchPost(true)}
            />
          </div>

          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  onCommentAdded={() => fetchPost(true)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg border p-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Comments Yet</h3>
                <p className="text-gray-500">Be the first to comment on this post!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}