import React, { useState } from 'react';
import { Post } from '@/lib/api/posts';
import { PostCard } from './post-card';
import { PostCardListView } from './post-card-list-view';
import { CommentsList } from './comments-list';

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  viewMode?: 'list' | 'grid';
  className?: string;
}

export function PostList({ posts, loading = false, viewMode = 'list', className }: PostListProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };
  if (loading) {
    const skeletonItems = [...Array(3)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-grow space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-12"></div>
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <div className={`${viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-6'
      } ${className}`}>
        {skeletonItems}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-white rounded-lg border p-8">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500">
            There are no posts to display at the moment. Check back later for new content!
          </p>
        </div>
      </div>
    );
  }

  const containerClass = viewMode === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
    : 'space-y-6';

  return (
    <div className={`${containerClass} ${className}`}>
      {posts.map((post) => (
        viewMode === 'grid' ? (
          <PostCard key={post._id} post={post} viewMode="grid" />
        ) : (
          <PostCardListView key={post._id} post={post} />
        )
      ))}
    </div>
  );
}