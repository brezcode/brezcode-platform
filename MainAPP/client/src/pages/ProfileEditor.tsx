import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";
import ProfileModule from "@/components/ProfileModule";

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  bio?: string;
  profilePhoto?: string;
  createdAt?: string;
  subscriptionStatus?: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  bio: string;
  profilePhoto?: string;
}

export default function ProfileEditor() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();

  // Fetch current user
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['/api/me'],
    queryFn: () => apiRequest('/api/me') as Promise<User>
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: ProfileData) => {
      const response = await apiRequest('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const handleSave = async (data: ProfileData) => {
    await updateProfileMutation.mutateAsync(data);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <ProfileModule
          initialData={{
            email: currentUser?.email,
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            phone: currentUser?.phone || '',
            address: currentUser?.address || '',
            bio: currentUser?.bio || '',
            profilePhoto: currentUser?.profilePhoto
          }}
          mode="personal"
          onSave={handleSave}
          isLoading={updateProfileMutation.isPending}
          showEmailField={true}
          title="Personal Profile"
          description="Manage your personal information and contact details"
        />
      </div>
    </div>
  );
}