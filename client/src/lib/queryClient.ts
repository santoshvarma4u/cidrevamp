import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.message?.includes('401')) return false;
        return failureCount < 3;
      },
      queryFn: async ({ queryKey, signal }) => {
        const res = await fetch(queryKey[0] as string, {
          signal,
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            // For auth endpoints, return null instead of throwing for unauthorized
            if (queryKey[0] === '/api/auth/user') {
              return null;
            }
            throw new Error(`${res.status}: Unauthorized`);
          }

          if (res.status >= 500) {
            throw new Error(`${res.status}: ${res.statusText}`);
          }

          if (res.status === 404) {
            throw new Error(`${res.status}: ${res.statusText}`);
          }

          if (res.status === 403) {
            throw new Error(`${res.status}: ${res.statusText}`);
          }

          throw new Error(`${res.status}: ${res.statusText}`);
        }

        return res.json();
      },
    },
  },
});

export default queryClient;

export async function apiRequest(url: string, options: RequestInit = {}) {
  // Don't set Content-Type for FormData - let browser handle it
  const headers: HeadersInit = {};
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      ...headers,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`${response.status}: ${errorData.message || response.statusText}`);
  }

  return response.json();
}
