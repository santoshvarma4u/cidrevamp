import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      console.log("Fetching user data from /api/auth/user");
      const res = await fetch("/api/auth/user", {
        credentials: "include",
      });
      
      console.log("Auth response status:", res.status);
      
      if (res.status === 401) {
        console.log("User not authenticated (401)");
        return null; // User not authenticated
      }
      
      if (!res.ok) {
        console.error("Auth request failed:", res.status, res.statusText);
        throw new Error("Failed to fetch user");
      }
      
      const userData = await res.json();
      console.log("User data received:", userData);
      return userData;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logout = async () => {
    try {
      // Call server logout endpoint to destroy session
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with client-side cleanup even if server call fails
    }
    
    // Clear client-side state
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Invalidate auth query to refresh state
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    
    // Redirect to home page
    window.location.href = '/';
  };

  const refreshAuth = () => {
    // Invalidate and refetch auth query immediately
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    // Also remove any cached data to force fresh fetch
    queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    logout,
    refreshAuth,
  };
}