import { api, setToken as setTokenInStorage, clearTokenCache } from "./index";

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface BackendUser {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  avatar?: string;
  user_type?: number;
  joined?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: BackendUser;
  };
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user: BackendUser;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await api.post("/api/users/login", credentials, { 
      requireAuth: false,
      showErrorToast: false  // We'll handle errors manually in the login form
    });

    if (res?.data?.token) {
      setTokenInStorage(res.data.token);
    }

    return res;
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    const res = await api.post("/api/users", credentials, { 
      requireAuth: false,
      showErrorToast: false  // We'll handle errors manually in the register form
    });

    // Registration typically doesn't return a token immediately
    // User might need to verify email or login separately
    return res;
  },

  logout: async (): Promise<void> => {
    // clear token locally
    clearTokenCache();
    try {
      // call backend logout endpoint if exists
      await api.post("/api/users/logout", {}, { requireAuth: false });
    } catch (e) {
      // ignore network errors for logout
    }
  },

  getProfile: async (): Promise<BackendUser | null> => {
    try {
      const res = await api.get("/api/users/me");
      return res?.data?.user ?? null;
    } catch (e) {
      return null;
    }
  },
};

export default authApi;
