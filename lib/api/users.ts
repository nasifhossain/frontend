import { api } from "./index";

export interface User {
  _id: string;
  username: string;
  email: string;
  name?: string;
  avatar: string;
  user_type: number;
  joined: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  name?: string;
  avatar?: string;
  user_type: number;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
}

export const usersApi = {
  getAllUsers: async (): Promise<UsersResponse> => {
    const res = await api.get("/api/users", {
      requireAuth: true,
      showErrorToast: true
    });
    return res;
  },

  createUser: async (userData: CreateUserPayload): Promise<CreateUserResponse> => {
    const res = await api.post("/api/users/admin", userData, {
      requireAuth: true,
      showErrorToast: true,
      showSuccessToast: true,
      successMessage: "User created successfully!"
    });
    return res;
  }
};

export default usersApi;
