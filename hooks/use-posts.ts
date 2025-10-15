"use client";

import { useState, useEffect, useCallback } from 'react';
import { postsApi, Post, PostsResponse } from '@/lib/api/posts';

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  fetchPosts: () => Promise<void>;
}

export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      const response: PostsResponse = await postsApi.getAllPosts();
      
      if (response.success && response.data?.post) {
        setPosts(response.data.post);
      } else {
        throw new Error(response.message || 'Failed to fetch posts');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load posts';
      setError(errorMessage);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refresh,
    fetchPosts
  };
}