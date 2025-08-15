"use client";

import { useState } from 'react';
import Quiz from '@/components/quiz';
import CleanSignupFlow from '@/components/CleanSignupFlow';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const router = useRouter();

  const handleQuizComplete = (answers: Record<string, any>) => {
    console.log('Quiz completed with answers:', answers);
    setQuizAnswers(answers);
    // Store answers in localStorage for report generation
    localStorage.setItem('brezcode_quiz_answers', JSON.stringify(answers));
    
    // Move to signup flow
    setQuizCompleted(true);
  };

  const handleQuizClose = () => {
    router.push('/');
  };

  const handleSignupComplete = () => {
    // After successful signup, redirect to personalized health report with quiz results
    router.push('/dashboard');
  };

  // Show signup flow after quiz completion
  if (quizCompleted) {
    return (
      <CleanSignupFlow 
        quizAnswers={quizAnswers} 
        onComplete={handleSignupComplete}
      />
    );
  }

  // Show quiz initially
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <Quiz onComplete={handleQuizComplete} onClose={handleQuizClose} />
    </div>
  );
}