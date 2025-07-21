import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  email: string;
  subscriptionTier: string | null;
  isSubscriptionActive: boolean;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/me"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/me", { credentials: "include" });
        if (response.status === 401) {
          return null;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        return response.json();
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/login", { email, password });
      return response.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["/api/me"], userData);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/register", { username: firstName + " " + lastName, email, password });
      return response.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["/api/me"], userData);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/me"], null);
    },
  });

  const login = async (email: string, password: string) => {
    return loginMutation.mutateAsync({ email, password });
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    return registerMutation.mutateAsync({ firstName, lastName, email, password });
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
