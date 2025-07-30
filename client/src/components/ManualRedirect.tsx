import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ManualRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Immediately redirect to BrezCode Dashboard
    console.log('Manual redirect to BrezCode Dashboard');
    setLocation('/business/brezcode/dashboard');
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