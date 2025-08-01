import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
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
    onSuccess: (response) => {
      queryClient.setQueryData(["/api/me"], response.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/signup", { firstName, lastName, email, password });
      return response.json();
    },
    onSuccess: (response) => {
      // Registration doesn't return user data immediately, user needs email verification
      // Don't set user data until verification is complete
    },
  });

  const sendEmailVerificationMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await apiRequest("POST", "/api/auth/send-email-verification", { email });
      return response.json();
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const response = await apiRequest("POST", "/api/auth/verify-email", { email, code });
      return response.json();
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

  const sendEmailVerification = async (email: string) => {
    return sendEmailVerificationMutation.mutateAsync({ email });
  };

  const verifyEmail = async (email: string, code: string) => {
    return verifyEmailMutation.mutateAsync({ email, code });
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  return {
    user,
    isLoading,
    login,
    register,
    sendEmailVerification,
    verifyEmail,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isEmailVerificationPending: sendEmailVerificationMutation.isPending,
    isEmailVerifyPending: verifyEmailMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
