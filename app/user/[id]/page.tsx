"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postsApi, Post } from '@/lib/api/posts';
import { PostCard } from '@/components/post/post-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, FileText, Image } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar: string;
  user_type: number;
  joined: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!params.id) return;

    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await postsApi.getUserPosts(params.id);
        if (res.success && res.data) {
          setPosts(res.data.posts || []);
          setUserData(res.data.user);
          setPagination(res.data.pagination);
        } else {
          throw new Error(res.message || 'Failed to fetch user profile');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getUserTypeLabel = (userType: number) => {
    switch (userType) {
      case 0: return 'User';
      case 1: return 'Admin';
      default: return 'User';
    }
  };

  const postsWithImages = posts.filter(p => p.content && p.content.length > 0);
  const textOnlyPosts = posts.filter(p => !p.content || p.content.length === 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
                <div className="space-y-3">
                  <div className="h-8 bg-gray-300 rounded w-48"></div>
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="flex space-x-4">
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-6 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Posts skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-20 bg-gray-300 rounded mb-4"></div>
                  <div className="h-32 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.back()} 
              className="flex items-center bg-white hover:bg-gray-50 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <Card className="shadow-lg border-0">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 text-lg font-medium mb-2">Error Loading Profile</div>
              <p className="text-gray-600">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()} 
            className="flex items-center bg-white hover:bg-gray-50 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* User Profile Section */}
        {userData && (
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {userData.avatar && userData.avatar !== 'No avatar' ? (
                      <img
                        src={userData.avatar}
                        alt={userData.username}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg">
                        <User className="w-8 h-8 md:w-12 md:h-12 text-white" />
                      </div>
                    )}
                    <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-medium ${
                      userData.user_type === 1 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-blue-500 text-white'
                    } shadow-lg`}>
                      {getUserTypeLabel(userData.user_type)}
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-grow">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {userData.name || userData.username}
                  </h1>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {formatDate(userData.joined)}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Total Posts</p>
                          <p className="text-2xl font-bold">{pagination?.totalPosts || 0}</p>
                        </div>
                        <FileText className="w-6 h-6 opacity-80" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">With Images</p>
                          <p className="text-2xl font-bold">{postsWithImages.length}</p>
                        </div>
                        <Image className="w-6 h-6 opacity-80" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white col-span-2 md:col-span-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">Text Only</p>
                          <p className="text-2xl font-bold">{textOnlyPosts.length}</p>
                        </div>
                        <FileText className="w-6 h-6 opacity-80" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Section */}
        {posts.length === 0 ? (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Posts Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {userData?.name || userData?.username} hasn't created any posts yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Posts by {userData?.username} ({pagination?.totalPosts || posts.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post._id} className="transform transition-all duration-200 hover:scale-105">
                  <PostCard post={post} viewMode="grid" className="shadow-lg border-0 bg-white/80 backdrop-blur-sm" />
                </div>
              ))}
            </div>

            {/* Pagination Info */}
            {pagination && pagination.totalPages > 1 && (
              <Card className="mt-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}