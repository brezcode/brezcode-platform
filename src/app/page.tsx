"use client";

import { useState } from 'react';
import Quiz from '@/components/quiz';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleQuizComplete = (answers: Record<string, any>) => {
    console.log('Quiz completed with answers:', answers);
    // Handle quiz completion - could redirect to results page
    setShowQuiz(false);
    // You can add navigation to results page here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            BrezCode - AI-Powered Breast Health Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Take our comprehensive 6-section medical assessment to understand your breast cancer risk factors
            and get personalized health recommendations powered by evidence-based research.
          </p>
          
          {/* Key Stats */}
          <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
            <p className="text-2xl font-semibold">
              1 in 8 women will develop breast cancer in their lifetime
            </p>
            <p className="text-lg mt-2 opacity-90">
              Early detection and risk awareness can save lives
            </p>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <Button
              onClick={() => setShowQuiz(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl rounded-lg font-semibold"
              size="lg"
            >
              Take the Comprehensive Assessment
            </Button>
            <p className="text-sm text-gray-500">
              Evidence-based • 27 Questions • 6 Medical Sections • Takes 5-10 minutes
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold mb-2">Medical Research Based</h3>
              <p className="text-gray-600">
                Every question backed by 2024 medical research from American Cancer Society and leading institutes
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Assessment</h3>
              <p className="text-gray-600">
                6 sections covering demographics, genetics, hormones, symptoms, screening, and lifestyle factors
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Personalized risk analysis and health recommendations based on your unique profile
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <Quiz
          onComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}