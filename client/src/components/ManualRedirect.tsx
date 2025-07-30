import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ManualRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is logged in, if so go to dashboard, otherwise go to BrezCode landing
    console.log('Manual redirect to BrezCode platform');
    // For now, always go to landing - proper auth check would determine dashboard vs landing
    setLocation('/brezcode');
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-4"></div>
        <p className="text-gray-600">Redirecting to BrezCode Dashboard...</p>
      </div>
    </div>
  );
}