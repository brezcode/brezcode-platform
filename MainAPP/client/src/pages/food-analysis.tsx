import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import FoodAnalyzer from '@/components/FoodAnalyzer';

export default function FoodAnalysisPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-6 px-4 max-w-4xl">
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
              AI Food Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Take a photo of your food to get detailed nutritional insights
            </p>
          </div>
        </div>

        {/* Food Analyzer Component */}
        <FoodAnalyzer />
      </div>
    </div>
  );
}