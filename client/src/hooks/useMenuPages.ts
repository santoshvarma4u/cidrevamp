import { useQuery } from "@tanstack/react-query";

export function useMenuPages() {
  return useQuery({
    queryKey: ["/api/pages/menu"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}