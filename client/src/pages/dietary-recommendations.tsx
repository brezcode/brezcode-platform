import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import DietaryRecommendations from '@/components/DietaryRecommendations';

export default function DietaryRecommendationsPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLocation('/brezcode')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Dietary Recommendations
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Personalized meal plans powered by machine learning
            </p>
          </div>
        </div>

        {/* Dietary Recommendations Component */}
        <DietaryRecommendations />
      </div>
    </div>
  );
}