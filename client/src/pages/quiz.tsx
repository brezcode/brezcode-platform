import { useState } from "react";
import Quiz from "@/components/quiz";
import SignupFlow from "@/components/signup-flow";
import { useLocation } from "wouter";

export default function QuizPage() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [, setLocation] = useLocation();

  const handleQuizComplete = (answers: Record<string, any>) => {
    console.log("Quiz completed with answers:", answers);
    setQuizAnswers(answers);
    setQuizCompleted(true);
  };

  const handleQuizClose = () => {
    setLocation('/');
  };

  const handleSignupComplete = () => {
    // After successful signup, redirect to home page
    setLocation('/');
  };

  if (quizCompleted) {
    return (
      <SignupFlow 
        quizAnswers={quizAnswers} 
        onComplete={handleSignupComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <Quiz onComplete={handleQuizComplete} onClose={handleQuizClose} />
    </div>
  );
}