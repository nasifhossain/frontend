"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, Grid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostList } from './post-list';
import { CreatePostDialog } from './create-post-dialog';
import { postsApi, Post } from '@/lib/api/posts';
import { useToast } from '@/hooks/use-toast';

interface PostsSectionProps {
  className?: string;
}

export function PostsSection({ className }: PostsSectionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchPosts = async (showRefreshMessage = false) => {
    try {
      setError(null);
      if (!showRefreshMessage) {
        setLoading(true);
      }
      
      const response = await postsApi.getAllPosts();
      
      if (response.success && response.data?.post) {
        setPosts(response.data.post);
        if (showRefreshMessage) {
          toast({
            title: "Posts refreshed",
            description: `Loaded ${response.data.post.length} posts`,
          });
        }
      } else {
        throw new Error(response.message || 'Failed to fetch posts');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load posts';
      setError(errorMessage);
      console.error('Error fetching posts:', err);
      
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
    fetchPosts();
  }, []);

  const handleRefresh = () => {
    fetchPosts(true);
  };

  const handlePostCreated = () => {
    setCreateDialogOpen(false);
    fetchPosts(true); // Refresh posts list
    toast({
      title: "Post created successfully",
      description: "Your new post has been published",
    });
  };

  if (error && !loading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-white rounded-lg border p-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-medium text-gray-900">Error Loading Posts</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-1 border rounded-lg p-1 bg-white">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setCreateDialogOpen(true)}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      <PostList posts={posts} loading={loading} viewMode={viewMode} />
      
      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}