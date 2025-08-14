'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: "age",
      question: "What is your current age?",
      type: "number",
      required: true
    },
    {
      id: "family_history",
      question: "Do you have a family history of breast or ovarian cancer?",
      type: "radio",
      options: ["Yes", "No", "Not sure"],
      required: true
    },
    {
      id: "weight",
      question: "What is your current weight (in pounds)?",
      type: "number",
      required: true
    },
    {
      id: "height",
      question: "What is your height (in inches)?",
      type: "number",
      required: true
    },
    {
      id: "exercise",
      question: "How often do you exercise per week?",
      type: "radio",
      options: [
        "No, little or no regular exercise",
        "Yes, 1-2 times per week",
        "Yes, 3-4 times per week", 
        "Yes, 5+ times per week"
      ],
      required: true
    },
    {
      id: "diet",
      question: "How would you describe your typical diet?",
      type: "radio",
      options: [
        "Mostly Western diet (processed foods, red meat, refined sugars)",
        "Balanced diet with some processed foods",
        "Mediterranean-style diet (fruits, vegetables, whole grains, fish)",
        "Vegetarian or vegan diet"
      ],
      required: true
    },
    {
      id: "alcohol",
      question: "How often do you consume alcohol?",
      type: "radio",
      options: [
        "Never",
        "Rarely (special occasions only)",
        "1-2 drinks per week",
        "3-7 drinks per week",
        "More than 7 drinks per week"
      ],
      required: true
    },
    {
      id: "smoking",
      question: "Do you smoke or have you smoked in the past?",
      type: "radio",
      options: ["Never smoked", "Former smoker (quit more than 10 years ago)", "Former smoker (quit within 10 years)", "Current smoker"],
      required: true
    },
    {
      id: "hormones",
      question: "Have you ever used hormone replacement therapy (HRT) or birth control pills long-term?",
      type: "radio",
      options: ["Never used", "Used birth control pills only", "Used HRT only", "Used both", "Currently using HRT"],
      required: true
    },
    {
      id: "menstrual_history",
      question: "At what age did you start menstruating?",
      type: "radio",
      options: ["Before age 12", "Age 12-13", "Age 14-15", "After age 15", "N/A"],
      required: true
    },
    {
      id: "pregnancy",
      question: "How many full-term pregnancies have you had?",
      type: "radio",
      options: ["None", "1", "2", "3", "4 or more"],
      required: true
    },
    {
      id: "breastfeeding",
      question: "If you have had children, did you breastfeed?",
      type: "radio",
      options: ["No children", "Did not breastfeed", "Breastfed less than 6 months total", "Breastfed 6-12 months total", "Breastfed more than 12 months total"],
      required: true
    },
    {
      id: "stress_level",
      question: "How would you rate your typical stress level?",
      type: "radio",
      options: ["Very low stress", "Low stress", "Moderate stress", "High stress", "Very high stress"],
      required: true
    },
    {
      id: "sleep",
      question: "How many hours of sleep do you typically get per night?",
      type: "radio",
      options: ["Less than 5 hours", "5-6 hours", "7-8 hours", "9+ hours"],
      required: true
    },
    {
      id: "health_goals",
      question: "What are your primary health goals? (Select your top priority)",
      type: "radio",
      options: [
        "Reduce breast cancer risk",
        "Improve overall fitness",
        "Maintain healthy weight",
        "Manage stress and mental health",
        "Improve energy levels"
      ],
      required: true
    }
  ];

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz complete - submit to backend API
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      // Calculate BMI for backend
      const weight = parseFloat(answers.weight);
      const height = parseFloat(answers.height);
      const bmi = weight / ((height * height) / 703); // BMI formula for pounds/inches
      
      const quizData = {
        ...answers,
        bmi: bmi.toFixed(1),
        western_diet: answers.diet === "Mostly Western diet (processed foods, red meat, refined sugars)" ? "Yes" : "No"
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://brezcode-backend-production.up.railway.app';
      
      const response = await fetch(`${API_URL}/api/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quizAnswers: quizData })
      });

      if (!response.ok) {
        throw new Error('Failed to generate health report');
      }

      const result = await response.json();
      
      // Store results and redirect to results page
      localStorage.setItem('healthReport', JSON.stringify(result.report));
      window.location.href = '/results';
      
    } catch (error) {
      console.error('Quiz submission error:', error);
      alert('There was an error processing your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            disabled={!answers[currentQuestion.id] || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            {isSubmitting ? 'Generating Your Health Report...' : 
             currentStep === questions.length - 1 ? 'Complete Assessment' : 'Next'}
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