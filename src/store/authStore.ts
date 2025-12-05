import { create } from "zustand";
import { authService } from "@/services/auth";
import type { User } from "@/types";
import { LoginRequest } from "@/types/auth";
import { trackAuth, setUserId, clearUserId } from "@/utils/analytics";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

// Initialize store with token and user from localStorage if available
const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("auth_token");
  }
  return null;
};

const getStoredUser = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>((set, get) => {
  const storedToken = getStoredToken();
  const storedUser = getStoredUser();
  
  return {
    user: storedUser,
    token: storedToken,
    // Set authenticated if we have both token and user from storage (optimistic)
    // This allows immediate access while checkAuth verifies with server
    isAuthenticated: !!(storedToken && storedUser),
    isLoading: false,
    login: async (data) => {
    const response = await authService.login(data);
    if (response.data.token) {
      const token = response.data.token;
      const user = response.data.user;
      // Store token and user in localStorage for persistence
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      // Set all auth state at once
      set({
        user: user,
        token: token,
        isAuthenticated: true,
        isLoading: false,
      });
      // Track login event
      trackAuth("login", "password", true);
      // Set user ID in GA
      if (user?.id) {
        setUserId(user.id);
      }
    }
  },
  logout: () => {
    // Track logout event
    trackAuth("logout", undefined, true);
    clearUserId();
    authService.logout();
    // Clear token and user from localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    window.location.href = "/auth/login";
  },
  checkAuth: async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null, isLoading: false });
      return;
    }

    // Don't set loading state - check in background without blocking UI
    // Update token if it changed, but don't block UI
    const currentState = get();
    if (currentState.token !== token) {
      set({ token });
    }
    
    // Check auth in background - don't set isLoading to avoid blocking UI

    try {
      // Fetch user data from the server using the stored token
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3011";
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        // Backend returns: { success: true, data: user }
        if (result.success && result.data) {
          let user = result.data;
          // Handle both backend format (name) and frontend format (firstName/lastName)
          if (user && (user as any).name && !(user as any).firstName) {
            const nameParts = (user as any).name.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";
            user = {
              ...user,
              firstName,
              lastName,
            } as User;
          }

          // Store user in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem("auth_user", JSON.stringify(user));
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set user ID in GA
          if (user?.id) {
            setUserId(user.id);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } else if (response.status === 401 || response.status === 403) {
        // 401 (unauthorized) - token is invalid or expired
        // 403 (forbidden) - user is blocked
        const result = await response.json().catch(() => ({}));
        console.warn(response.status === 403 ? "User account has been blocked" : "Token invalid or expired, clearing auth state");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        clearUserId();
      } else {
        // For other errors (network, server errors), keep optimistic auth if we had user before
        // This allows retry without losing the token
        console.error("Auth check failed with status:", response.status);
        const currentState = get();
        set({
          isLoading: false,
          // Keep authenticated if we had user data before (optimistic auth for non-401 errors)
          isAuthenticated: !!(currentState.user && token),
        });
      }
    } catch (error: any) {
      console.error("Failed to check auth:", error);
      // Only clear token on network errors if it's a clear authentication failure
      // For network errors, keep the token and allow retry
      if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        clearUserId();
      } else {
        // Network error - keep token, but try to maintain auth state if we had it before
        // User might be offline or server temporarily unavailable
        console.warn("Network error during auth check, keeping token for retry");
        const currentState = get();
        // If we had a user before, keep authenticated state (optimistic)
        // This allows the app to work offline with cached credentials
        set({
          isLoading: false,
          // Keep authenticated if we had user data before (optimistic auth)
          isAuthenticated: !!(currentState.user && token),
        });
      }
    }
  },
  setUser: (user) => {
    // Handle both backend format (name) and frontend format (firstName/lastName)
    if (user && (user as any).name && !(user as any).firstName) {
      // Backend returns { name: "John Doe" }, convert to { firstName: "John", lastName: "Doe" }
      const nameParts = (user as any).name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      user = {
        ...user,
        firstName,
        lastName,
      } as User;
    }
    // Store user in localStorage for persistence
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem("auth_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("auth_user");
      }
    }
    // When setting user, also check if we have a token to set authenticated
    const currentState = get();
    set({ 
      user, 
      // Set authenticated if user exists and we have a token
      isAuthenticated: !!user && !!currentState.token 
    });
    // Set user ID in GA when user is set
    if (user?.id) {
      setUserId(user.id);
    }
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem("auth_token", token);
      // Set token and maintain current auth state if user exists
      const currentState = get();
      set({ 
        token,
        // Set authenticated if we have both token and user
        isAuthenticated: !!(currentState.user && token)
      });
    } else {
      localStorage.removeItem("auth_token");
      set({ token: null, isAuthenticated: false });
    }
  },
  };
});
