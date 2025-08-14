'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  const questions = [
    {
      id: "age",
      question: "What is your current age?",
      type: "number",
      required: true
    },
    {
      id: "country", 
      question: "Which country are you residing in?",
      type: "select",
      options: ["United States", "Canada", "United Kingdom", "Australia", "Other"],
      required: true
    },
    {
      id: "family_history",
      question: "Do you have a family history of breast cancer?",
      type: "radio",
      options: ["Yes", "No", "Not sure"],
      required: true
    }
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz complete - redirect to results or dashboard
      alert("Quiz completed! Redirecting to your personalized health plan...");
      window.location.href = '/dashboard';
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentStep].id]: value
    });
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Breast Health Assessment
          </h1>
          <p className="text-gray-600">
            Get personalized insights to help reduce your breast cancer risk
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg p-8 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            {currentQuestion.type === "number" && (
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your age"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}

            {currentQuestion.type === "select" && currentQuestion.options && (
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
              >
                <option value="">Select an option</option>
                {currentQuestion.options.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            )}

            {currentQuestion.type === "radio" && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2"
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            {currentStep === questions.length - 1 ? 'Complete Assessment' : 'Next'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Your privacy is protected. All information is encrypted and secure.</p>
        </div>
      </div>
    </div>
  );
}