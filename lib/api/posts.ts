import { api } from "./index";
import { Comment } from "./comments";

export interface PostUser {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  user_type: number;
  joined: string;
}

export interface Post {
  _id: string;
  user_id: PostUser;
  title: string;
  caption: string;
  content: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  comment_count: number;
  comments?: Comment[]; // Optional, only included in detailed post view
}

export interface PostsResponse {
  success: boolean;
  message: string;
  data: {
    post: Post[];
  };
}

export const postsApi = {
  getAllPosts: async (): Promise<PostsResponse> => {
    const res = await api.get("/api/posts", {
      requireAuth: true,
      showErrorToast: true
    });
    return res;
  },

  getPostById: async (postId: string): Promise<{ success: boolean; message: string; data: { post: Post } }> => {
    const res = await api.get(`/api/posts/${postId}`, {
      requireAuth: true,
      showErrorToast: true
    });
    return res;
  },

  createPost: async (postData: { title: string; caption: string; content: string[] }): Promise<{ success: boolean; message: string; data: { post: Post } }> => {
    const res = await api.post("/api/posts", postData, {
      requireAuth: true,
      showErrorToast: false,
      showSuccessToast: true,
      successMessage: "Post created successfully!"
    });
    return res;
  },

  updatePost: async (postId: string, postData: { title?: string; caption?: string; content?: string[] }): Promise<{ success: boolean; message: string; data: { post: Post } }> => {
    const res = await api.put(`/api/posts/${postId}`, postData, {
      requireAuth: true,
      showErrorToast: false,
      showSuccessToast: true,
      successMessage: "Post updated successfully!"
    });
    return res;
  },

  deletePost: async (postId: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/api/posts/${postId}`, {
      requireAuth: true,
      showErrorToast: false,
      showSuccessToast: true,
      successMessage: "Post deleted successfully!"
    });
    return res;
  }
,

  // Fetch posts for a specific user (paginated)
  getUserPosts: async (userId: string, page: number = 1): Promise<{ success: boolean; message: string; data: { posts: Post[]; user?: any; pagination?: any } }> => {
    const res = await api.get(`/api/posts/user/${userId}?page=${page}`, {
      requireAuth: true,
      showErrorToast: true
    });
    return res;
  }
};

export default postsApi;