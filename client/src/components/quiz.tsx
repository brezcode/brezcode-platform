import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

interface QuizQuestion {
  id: string;
  question: string;
  type: "number_range" | "multiple_choice" | "text" | "slider" | "yes_no";
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
}

// Sample quiz structure - you can update this with the actual Excel data
const quizQuestions: QuizQuestion[] = [
  {
    id: "age",
    question: "What is your age?",
    type: "number_range",
    min: 20,
    max: 80,
    required: true
  },
  {
    id: "family_history",
    question: "Do you have a family history of breast cancer?",
    type: "yes_no",
    required: true
  },
  {
    id: "exercise_frequency",
    question: "How many days per week do you exercise?",
    type: "multiple_choice",
    options: ["0 days", "1-2 days", "3-4 days", "5-6 days", "7 days"],
    required: true
  },
  {
    id: "stress_level",
    question: "On a scale of 1-10, how would you rate your stress level?",
    type: "slider",
    min: 1,
    max: 10,
    required: true
  }
  // Add more questions here based on your Excel file
];

interface QuizProps {
  onComplete: (answers: Record<string, any>) => void;
  onClose: () => void;
}

export default function Quiz({ onComplete, onClose }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentAnswer, setCurrentAnswer] = useState<any>("");

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  const handleNext = () => {
    // Save current answer
    const updatedAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      onComplete(updatedAnswers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer("");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      const previousQuestion = quizQuestions[currentQuestionIndex - 1];
      setCurrentAnswer(answers[previousQuestion.id] || "");
    }
  };

  const isAnswerValid = () => {
    if (!currentQuestion.required) return true;
    
    switch (currentQuestion.type) {
      case "number_range":
        const num = Number(currentAnswer);
        return !isNaN(num) && 
               num >= (currentQuestion.min || 0) && 
               num <= (currentQuestion.max || 100);
      case "multiple_choice":
      case "yes_no":
        return currentAnswer !== "";
      case "text":
        return currentAnswer.trim() !== "";
      case "slider":
        return currentAnswer !== null && currentAnswer !== undefined;
      default:
        return true;
    }
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case "number_range":
        return (
          <div className="space-y-4">
            <Label htmlFor="number-input" className="text-lg">
              Choose a number from {currentQuestion.min} to {currentQuestion.max}
            </Label>
            <Input
              id="number-input"
              type="number"
              min={currentQuestion.min}
              max={currentQuestion.max}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="text-xl p-4 text-center"
              placeholder={`Enter a number between ${currentQuestion.min} and ${currentQuestion.max}`}
            />
          </div>
        );

      case "multiple_choice":
        return (
          <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-lg cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "yes_no":
        return (
          <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
            <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="text-lg cursor-pointer flex-1">Yes</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="text-lg cursor-pointer flex-1">No</Label>
            </div>
          </RadioGroup>
        );

      case "slider":
        return (
          <div className="space-y-6">
            <Label className="text-lg">
              Select a value: {currentAnswer || currentQuestion.min || 0}
            </Label>
            <Slider
              value={[currentAnswer || currentQuestion.min || 0]}
              onValueChange={(value) => setCurrentAnswer(value[0])}
              min={currentQuestion.min || 0}
              max={currentQuestion.max || 100}
              step={1}
              className="w-full"
            />
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            <Label htmlFor="text-input" className="text-lg">Your answer:</Label>
            <Input
              id="text-input"
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="text-xl p-4"
              placeholder="Type your answer here"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Breast Health Assessment</CardTitle>
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold leading-relaxed">
              {currentQuestion.question}
            </h3>
            
            {renderQuestionInput()}
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-8 py-3"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isAnswerValid()}
              className="px-8 py-3 bg-sky-blue hover:bg-blue-600 text-white"
            >
              {isLastQuestion ? "Complete Assessment" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}