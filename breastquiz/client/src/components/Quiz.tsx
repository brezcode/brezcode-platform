import { useState } from "react";
import { useLocation } from "wouter";

interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple_choice" | "number_range" | "yes_no";
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "age",
    question: "What is your current age?",
    type: "number_range",
    min: 18,
    max: 100,
    required: true
  },
  {
    id: "family_history",
    question: "Do you have a family history of breast or ovarian cancer?",
    type: "multiple_choice",
    options: ["No family history", "Mother or sister", "Grandmother or aunt", "Multiple family members"],
    required: true
  },
  {
    id: "mammogram_frequency",
    question: "How often do you undergo mammogram screening?",
    type: "multiple_choice",
    options: ["Annually (once a year)", "Biennially (every 2 years)", "Irregularly", "Never"],
    required: true
  },
  {
    id: "lifestyle_factors",
    question: "Which lifestyle factors apply to you?",
    type: "multiple_choice",
    options: ["Regular exercise", "Healthy diet", "Limited alcohol", "Non-smoker", "None of the above"],
    required: true
  },
  {
    id: "hormonal_factors",
    question: "Have you used hormone replacement therapy for more than 5 years?",
    type: "yes_no",
    required: true
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [, setLocation] = useLocation();

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz completed, store answers and redirect to results
      localStorage.setItem('quizAnswers', JSON.stringify(answers));
      setLocation('/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const question = quizQuestions[currentQuestion];
  const currentAnswer = answers[question.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            {question.question}
          </h2>
          
          <div className="space-y-4">
            {question.type === "multiple_choice" && question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  currentAnswer === option
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {option}
              </button>
            ))}
            
            {question.type === "yes_no" && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(question.id, "Yes")}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    currentAnswer === "Yes"
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(question.id, "No")}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    currentAnswer === "No"
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  No
                </button>
              </div>
            )}
            
            {question.type === "number_range" && (
              <div className="space-y-4">
                <input
                  type="number"
                  min={question.min}
                  max={question.max}
                  value={currentAnswer || ''}
                  onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder={`Enter a number between ${question.min} and ${question.max}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Get Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}