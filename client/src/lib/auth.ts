import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from './queryClient';

export interface User {
  id: number;
  username: string;
  email: string | null;
  role: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        try {
          // First try the auth/login endpoint
          let response = await apiRequest('POST', '/api/auth/login', {
            username,
            password,
            captchaSessionId: 'dev-captcha', // For development, you might need to handle CAPTCHA
            captchaInput: 'dev'
          });
          
          // If that fails, try the regular login endpoint
          if (!response) {
            response = await apiRequest('POST', '/api/login', {
              username,
              password,
              captchaSessionId: 'dev-captcha',
              captchaInput: 'dev'
            });
          }
          
          // Handle the response - the server returns user data directly
          const userData = response;
          
          set({
            user: userData,
            token: null, // Sessions don't use tokens
            isAuthenticated: true,
          });
          
          // Clear any old tokens since we're using sessions
          localStorage.removeItem('auth_token');
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('auth_token');
      },
      
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'cid-auth-storage',
    }
  )
);

// Custom hook for easier usage
export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  return { user, isAuthenticated, login, logout };
};

// Function to get auth headers for API requests
export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
