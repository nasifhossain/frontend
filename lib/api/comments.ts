import { api } from "./index";

export interface CommentUser {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  user_type: number;
}

export interface Comment {
  _id: string;
  post: string;
  upvotes: number;
  content: string;
  user: CommentUser;
  parent_comment: string | null;
  commented_at: string;
  __v: number;
  replies: Comment[];
  replyCount: number;
}

export interface CommentsResponse {
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
    post: {
      id: string;
      title: string;
      user_id: string;
    };
    pagination: {
      currentPage: number;
      totalPages: number;
      totalComments: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export const commentsApi = {
  getCommentsByPost: async (postId: string): Promise<CommentsResponse> => {
    const res = await api.get(`/api/comments/post/${postId}`, {
      requireAuth: true,
      showErrorToast: true
    });
    return res;
  },

  createComment: async (commentData: { 
    post: string; 
    content: string; 
    parent_comment?: string 
  }): Promise<{ success: boolean; message: string; data: { comment: Comment } }> => {
    const res = await api.post("/api/comments", commentData, {
      requireAuth: true,
      showErrorToast: false,
      showSuccessToast: true,
      successMessage: "Comment posted successfully!"
    });
    return res;
  },

  updateComment: async (commentId: string, content: string): Promise<{ success: boolean; message: string; data: { comment: Comment } }> => {
    const res = await api.put(`/api/comments/${commentId}`, { content }, {
      requireAuth: true,
      showErrorToast: false,
      showSuccessToast: true,
      successMessage: "Comment updated successfully!"
    });
    return res;
  },

  deleteComment: async (commentId: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/api/comments/${commentId}`, {
      requireAuth: true,
      showErrorToast: false,
      showSuccessToast: true,
      successMessage: "Comment deleted successfully!"
    });
    return res;
  }
};

export default commentsApi;