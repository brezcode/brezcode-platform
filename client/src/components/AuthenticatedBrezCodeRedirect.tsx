import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function AuthenticatedBrezCodeRedirect() {
  const [, setLocation] = useLocation();

  // Check if user is authenticated
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
  });

  useEffect(() => {
    if (!isLoading) {
      if (user && (user as any).id) {
        // User is authenticated, redirect to BrezCode Dashboard
        console.log('Authenticated user detected, redirecting to BrezCode dashboard');
        setLocation('/business/brezcode/dashboard');
      } else {
        // Check if there's a login success in localStorage (temporary fix)
        const loginSuccess = localStorage.getItem('loginSuccess');
        if (loginSuccess === 'true') {
          console.log('Login success detected, redirecting to BrezCode dashboard');
          localStorage.removeItem('loginSuccess'); // Clean up
          setLocation('/business/brezcode/dashboard');
        } else {
          // User is not authenticated, show main landing page
          console.log('User not authenticated, showing main landing page');
          setLocation('/');
        }
      }
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-4"></div>
          <p className="text-gray-600">Loading BrezCode...</p>
        </div>
      </div>
    );
  }

  return null; // Component redirects, no UI needed
}