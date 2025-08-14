'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface HealthReport {
  riskScore: number;
  riskCategory: string;
  userProfile: string;
  riskFactors: string[];
  recommendations: string[];
  dailyPlan?: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  generatedBy: string;
  createdAt: string;
}

export default function ResultsPage() {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedReport = localStorage.getItem('healthReport');
    if (storedReport) {
      setReport(JSON.parse(storedReport));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Report Found</h1>
          <p className="text-gray-600 mb-6">Please complete the health assessment first.</p>
          <Button 
            onClick={() => window.location.href = '/quiz'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Take Assessment
          </Button>
        </div>
      </div>
    );
  }

  const getRiskColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Personalized Health Report
          </h1>
          <p className="text-gray-600">
            Based on your comprehensive breast health assessment
          </p>
        </div>

        {/* Risk Score Card */}
        <div className="bg-white rounded-lg p-8 shadow-lg mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Risk Assessment</h2>
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(report.riskScore)}`}>
                  {report.riskScore}
                </div>
                <div className="text-sm text-gray-600">Risk Score (out of 100)</div>
              </div>
              <div className="ml-8">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskColor(report.riskCategory)}`}>
                  {report.riskCategory.toUpperCase()} RISK
                </span>
                <div className="text-sm text-gray-600 mt-2 capitalize">
                  Profile: {report.userProfile.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        {report.riskFactors && report.riskFactors.length > 0 && (
          <div className="bg-white rounded-lg p-8 shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Risk Factors</h3>
            <div className="space-y-3">
              {report.riskFactors.map((factor, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {report.recommendations && report.recommendations.length > 0 && (
          <div className="bg-white rounded-lg p-8 shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
            <div className="space-y-4">
              {report.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-4 mt-1 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Plan */}
        {report.dailyPlan && (
          <div className="bg-white rounded-lg p-8 shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Daily Health Plan</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">🌅 Morning</h4>
                <p className="text-yellow-700">{report.dailyPlan.morning}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">☀️ Afternoon</h4>
                <p className="text-blue-700">{report.dailyPlan.afternoon}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🌙 Evening</h4>
                <p className="text-purple-700">{report.dailyPlan.evening}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Go to Dashboard
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="px-8 py-3"
            >
              Back to Home
            </Button>
          </div>
          
          {/* Report Info */}
          <div className="text-sm text-gray-500 mt-6">
            <p>Report generated on {new Date(report.createdAt).toLocaleDateString()}</p>
            <p>Analysis powered by {report.generatedBy === 'ai' ? 'AI + Clinical Guidelines' : 'Evidence-Based Assessment'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}