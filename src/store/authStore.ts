import { create } from "zustand";
import { authService } from "@/services/auth";
import type { User } from "@/types";
import { LoginRequest } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (data) => {
    const response = await authService.login(data);
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      });
    }
  },
  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = "/login";
  },
  checkAuth: () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Here you would typically decode the token to get user info and check expiration
      // For simplicity, we'll just set isAuthenticated to true if a token exists.
      // A more robust solution would be to fetch user profile from the server.
      set({ isAuthenticated: true, token });
    }
  },
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
    set({ token, isAuthenticated: !!token });
  },
}));
