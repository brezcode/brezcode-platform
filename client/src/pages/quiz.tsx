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
            <div className="space-y-4">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome to BrezCode, {quizResults.first_name}!</h2>
              <p className="text-lg text-gray-600">
                Thank you for completing your breast health assessment. We're preparing your personalized report and will send it to <strong>{quizResults.email}</strong> shortly.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>What's Next?</strong> Your comprehensive assessment report will include personalized recommendations, risk factors analysis, and an action plan tailored specifically for you.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={() => setLocation("/chat")}
                className="w-full bg-sky-blue hover:bg-blue-600 text-white py-3"
              >
                Start Your Personalized AI Coaching
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