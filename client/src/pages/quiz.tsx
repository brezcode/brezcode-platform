import { useState } from "react";
import { useLocation } from "wouter";
import Quiz from "@/components/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuizPage() {
  const [, setLocation] = useLocation();
  const [showQuiz, setShowQuiz] = useState(true);
  const [quizResults, setQuizResults] = useState<Record<string, any> | null>(null);

  const handleQuizComplete = (answers: Record<string, any>) => {
    setQuizResults(answers);
    setShowQuiz(false);
    
    // Here you would typically send the results to your backend
    console.log("Quiz completed with answers:", answers);
  };

  const handleQuizClose = () => {
    setLocation("/");
  };

  if (quizResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Assessment Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-lg text-gray-600">
              Thank you for completing the breast health assessment. Your personalized health plan is being prepared.
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => setLocation("/chat")}
                className="w-full bg-sky-blue hover:bg-blue-600 text-white py-3"
              >
                Start Your Personalized Coaching
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      {showQuiz && (
        <Quiz
          onComplete={handleQuizComplete}
          onClose={handleQuizClose}
        />
      )}
    </div>
  );
}