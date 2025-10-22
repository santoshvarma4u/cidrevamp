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
      
      logout: async () => {
        try {
          // Call server logout endpoint to destroy session
          await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include', // Include cookies
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('Logout API call failed:', error);
          // Continue with client-side cleanup even if server call fails
        }
        
        // Clear client-side state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        
        // Clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        
        // Clear any other auth-related storage
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user');
        
        // Redirect to home page
        window.location.href = '/';
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
