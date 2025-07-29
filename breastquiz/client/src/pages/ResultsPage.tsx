import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function ResultsPage() {
  const [quizAnswers, setQuizAnswers] = useState<any>(null);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [riskCategory, setRiskCategory] = useState<string>("");

  useEffect(() => {
    // Get quiz answers from localStorage
    const storedAnswers = localStorage.getItem('quizAnswers');
    if (storedAnswers) {
      const answers = JSON.parse(storedAnswers);
      setQuizAnswers(answers);
      
      // Calculate basic risk score (simplified version)
      let score = 0;
      
      // Age factor
      if (answers.age >= 50) score += 2;
      else if (answers.age >= 40) score += 1;
      
      // Family history
      if (answers.family_history === "Multiple family members") score += 3;
      else if (answers.family_history === "Mother or sister") score += 2;
      else if (answers.family_history === "Grandmother or aunt") score += 1;
      
      // Screening frequency
      if (answers.mammogram_frequency === "Never") score += 2;
      else if (answers.mammogram_frequency === "Irregularly") score += 1;
      
      // Lifestyle factors
      if (answers.lifestyle_factors === "None of the above") score += 2;
      
      // Hormonal factors
      if (answers.hormonal_factors === "Yes") score += 1;
      
      setRiskScore(score);
      
      // Determine risk category
      if (score <= 2) setRiskCategory("Low Risk");
      else if (score <= 5) setRiskCategory("Moderate Risk");
      else setRiskCategory("Higher Risk");
    }
  }, []);

  const getRiskColor = () => {
    if (riskCategory === "Low Risk") return "text-green-600 bg-green-50 border-green-200";
    if (riskCategory === "Moderate Risk") return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getRecommendations = () => {
    const baseRecommendations = [
      "Schedule regular mammogram screenings",
      "Maintain a healthy diet rich in fruits and vegetables",
      "Exercise regularly - aim for 150 minutes per week",
      "Limit alcohol consumption",
      "Maintain a healthy weight"
    ];

    if (riskCategory === "Higher Risk") {
      return [
        "Consult with your healthcare provider about your risk factors",
        "Consider genetic counseling if you have significant family history",
        "Discuss earlier or more frequent screening options",
        ...baseRecommendations
      ];
    }

    return baseRecommendations;
  };

  if (!quizAnswers) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-6">Please take the quiz first to see your results.</p>
          <Link href="/quiz">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Take Quiz
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Your Breast Health Assessment Results
          </h1>
          <p className="text-xl text-gray-600">
            Based on your responses, here's your personalized health report
          </p>
        </div>

        {/* Risk Score Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Risk Assessment</h2>
            <div className={`inline-block px-6 py-3 rounded-full border-2 font-bold text-lg ${getRiskColor()}`}>
              {riskCategory}
            </div>
            <p className="text-gray-600 mt-4">
              Risk Score: {riskScore}/10
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                riskCategory === "Low Risk" ? "bg-green-500" :
                riskCategory === "Moderate Risk" ? "bg-yellow-500" : 
                "bg-red-500"
              }`}
              style={{ width: `${Math.min((riskScore / 10) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6">Personalized Recommendations</h3>
          <div className="space-y-4">
            {getRecommendations().map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-lg p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Take Action Today</h3>
            <p className="text-blue-100 mb-6">
              Your health is in your hands. Start implementing these recommendations for better breast health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
                Schedule Screening
              </button>
              <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300">
                Get Health Plan
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-6 bg-gray-100 rounded-2xl">
          <p className="text-sm text-gray-600 text-center">
            <strong>Medical Disclaimer:</strong> This assessment is for educational purposes only and should not replace professional medical advice. 
            Always consult with your healthcare provider for personalized medical guidance and screening recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}