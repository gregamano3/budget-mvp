/**
 * Auth store — manages user authentication state locally.
 * Uses expo-secure-store for persisted token storage.
 */

import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

const AUTH_KEY = "smartinventory_auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    // Check for seed account
    if (email.toLowerCase() === "admin@example.com" && password === "123456789") {
      const user: User = {
        id: "admin-seed-1",
        fullName: "Admin User",
        email: "admin@example.com",
      };
      await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return true;
    }
    
    // For any other offline-first demo accounts created via Sign Up
    const stored = await SecureStore.getItemAsync(AUTH_KEY);
    if (stored) {
      const user = JSON.parse(stored) as User;
      if (user.email === email.toLowerCase()) {
        set({ user, isAuthenticated: true });
        return true;
      }
    }
    
    return false;
  },

  signup: async (fullName: string, email: string, _password: string) => {
    const user: User = {
      id: "local-user-1",
      fullName,
      email: email.toLowerCase(),
    };

    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return true;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(AUTH_KEY);
    set({ user: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    try {
      const stored = await SecureStore.getItemAsync(AUTH_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
