import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HomePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome
          </h1>
          <p className="text-gray-600">
            Choose your platform
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => setLocation('/leadgen')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl"
          >
            LeadGen.to Landing Page
          </Button>

          <Button 
            onClick={() => setLocation('/brezcode')}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-6 text-lg font-semibold rounded-xl"
          >
            BrezCode Landing Page
          </Button>

          <Button 
            onClick={() => setLocation('/brezcode-backend-dashboard')}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg font-semibold rounded-xl"
          >
            BrezCode Backend Platform
          </Button>
        </div>
      </div>
    </div>
  );
}