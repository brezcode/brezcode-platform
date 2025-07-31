import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Building2, Heart, Bot } from 'lucide-react';

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
            Choose your destination: Universal AI Training Platform or explore specific business examples
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => setLocation('/business-training')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold rounded-xl flex items-center justify-center space-x-3"
          >
            <Bot className="h-6 w-6" />
            <span>Universal AI Training Platform</span>
          </Button>

          <Button 
            onClick={() => setLocation('/leadgen')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-semibold rounded-xl flex items-center justify-center space-x-3"
          >
            <Building2 className="h-6 w-6" />
            <span>LeadGen.to Landing</span>
          </Button>

          <Button 
            onClick={() => setLocation('/brezcode')}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-6 text-lg font-semibold rounded-xl flex items-center justify-center space-x-3"
          >
            <Heart className="h-6 w-6" />
            <span>BrezCode Health Demo</span>
          </Button>
        </div>
      </div>
    </div>
  );
}