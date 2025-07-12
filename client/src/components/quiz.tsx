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
  condition?: {
    questionId: string;
    answer: string;
  };
}

// BC Assessment Quiz Questions from Excel file
const quizQuestions: QuizQuestion[] = [
  {
    id: "age",
    question: "What is your current age?",
    type: "number_range",
    min: 20,
    max: 80,
    required: true
  },
  {
    id: "country",
    question: "Which country are you residing now?",
    type: "text",
    required: true
  },
  {
    id: "ethnicity",
    question: "What is your racial/ethnic background?",
    type: "multiple_choice",
    options: ["White (non-Hispanic)", "Black", "Asian", "Hispanic/Latino", "American Indian"],
    required: true
  },
  {
    id: "family_history",
    question: "Do you have a first-degree relative (mother, sister, daughter) or second-degree relative with breast cancer (BC)?",
    type: "multiple_choice",
    options: ["Yes, I have first-degree relative with BC", "Yes, I have second-degree relative with BC", "No, I don't have any relatives with BC"],
    required: true
  },
  {
    id: "brca_test",
    question: "Have you ever been told you have one of the following genetic or family cancer syndromes after having genetic testing?",
    type: "multiple_choice",
    options: ["BRCA1/2", "No condition", "Not tested"],
    required: true
  },
  {
    id: "dense_breast",
    question: "Have you been told that you have dense breast tissue based on a mammogram?",
    type: "multiple_choice",
    options: ["Yes", "No", "I don't know (I've never had a mammogram)"],
    required: true
  },
  {
    id: "menstrual_age",
    question: "At what age did you have your first menstrual period?",
    type: "multiple_choice",
    options: ["Before 12 years old", "12 years old or later", "Not Yet"],
    required: true
  },
  {
    id: "pregnancy_age",
    question: "Have you ever been pregnant? If yes, At what age did you have your first full-term pregnancy?",
    type: "multiple_choice",
    options: ["Never been pregnant", "First pregnancy before 25", "First pregnancy between 25-29", "First pregnancy after 30"],
    required: true
  },
  {
    id: "oral_contraceptives",
    question: "Have you ever used hormonal birth control (e.g., pills, patches, injections)?",
    type: "multiple_choice",
    options: ["Yes, currently using", "Yes, used in the past", "No, never used"],
    required: true
  },
  {
    id: "menopause",
    question: "Have you gone without a menstrual period for 12 or more consecutive months (excluding pregnancy or medical conditions)?",
    type: "multiple_choice",
    options: ["Yes, at age 55 or later", "Yes, at age 50-54", "Yes, before age 50", "No, I am still menstruating"],
    required: true
  },
  {
    id: "weight",
    question: "What is your weight in kg?",
    type: "number_range",
    min: 40,
    max: 150,
    required: true
  },
  {
    id: "height",
    question: "What is your height in meters?",
    type: "number_range",
    min: 1.4,
    max: 2.1,
    required: true
  },
  {
    id: "hrt",
    question: "Have you ever used Combined Hormone Replacement Therapy (HRT) for more than 5 years?",
    type: "multiple_choice",
    options: ["Yes", "No"],
    required: true
  },
  {
    id: "western_diet",
    question: "Do you regularly follow a Western diet (e.g., high in processed foods, red meats, saturated fats, and low in fruits, vegetables, and fiber)?",
    type: "multiple_choice",
    options: ["Yes, regularly", "Sometimes", "No, I follow a healthy diet"],
    required: true
  },
  {
    id: "smoke",
    question: "Do you currently smoke tobacco products?",
    type: "multiple_choice",
    options: ["Yes", "No"],
    required: true
  },
  {
    id: "alcohol",
    question: "How many alcoholic drinks do you consume per day, on average?",
    type: "multiple_choice",
    options: ["2 or more drinks", "1 drink", "None"],
    required: true
  },
  {
    id: "night_shift",
    question: "Do you regularly work night shifts (e.g., shifts including midnight to 5:00 AM)?",
    type: "multiple_choice",
    options: ["Yes", "No"],
    required: true
  },
  {
    id: "stressful_events",
    question: "Have you experienced striking stressful life events (e.g., death of a close family member, divorce, or major financial crisis)?",
    type: "multiple_choice",
    options: ["Yes, striking life events", "Yes, moderate life events", "No significant stressful events"],
    required: true
  },
  {
    id: "benign_condition",
    question: "Have you been diagnosed with a benign breast condition, such as atypical hyperplasia, lobular carcinoma in situ (LCIS), or complex/complicated cysts?",
    type: "multiple_choice",
    options: ["Yes, LCIS", "Yes, complex/complicated cysts", "Yes, other benign condition (e.g., simple cysts, fibrocystic changes)", "No benign breast conditions"],
    required: true
  },
  {
    id: "precancerous_condition",
    question: "Have you been diagnosed with a precancerous or cancerous breast condition, such as Invasive Breast Cancer (IBC), Invasive Lobular Carcinoma (ILC), Ductal Carcinoma (DSIC) or Atypical Hyperplasia (ADH/ALH)?",
    type: "multiple_choice",
    options: ["Yes, Invasive Breast Cancer, Ductal Carcinoma (DCIS), or Invasive Lobular Carcinoma (ILC)", "Yes, Atypical Hyperplasia (ADH/ALH)", "No precancerous or cancerous breast conditions"],
    required: true
  },
  {
    id: "mammogram_frequency",
    question: "How often do you undergo mammogram or other screening for breast cancer?",
    type: "multiple_choice",
    options: ["Annual (every year)", "Biennial (every 2 years)", "Irregular (sometimes)", "Never"],
    required: true
  },
  {
    id: "breast_symptoms",
    question: "Do you have any breast symptoms such as lumps, pain, or nipple discharge?",
    type: "multiple_choice",
    options: ["I have breast pain", "I have a lump in my breast", "I have swollen breast or changed in size or shape", "Yes, I have other symptoms", "No symptoms"],
    required: true
  },
  {
    id: "pain_level",
    question: "How painful is it? (Feeling of heaviness, tenderness, a burning, prickling or stabbing pain, or a feeling of tightness.)",
    type: "multiple_choice",
    options: ["Severe pain (7-10/10)", "Moderate pain (4-6/10)", "Mild pain (1-3/10)", "No pain"],
    required: true,
    condition: { questionId: "breast_symptoms", answer: "I have breast pain" }
  },
  {
    id: "lump_characteristics",
    question: "Is it larger than 2 cm or growing rapidly?",
    type: "multiple_choice",
    options: ["Growing Lump with size over 5cm", "Growing Lump size over 2cm", "Stable Lump size over 2cm", "Stable Lump size under 2cm"],
    required: true,
    condition: { questionId: "breast_symptoms", answer: "I have a lump in my breast" }
  },
  {
    id: "breast_size_changes",
    question: "Are you currently experiencing swollen breast or persistent changes in breast size or shape?",
    type: "multiple_choice",
    options: ["Yes, I have persistent changes in breast size or shape", "Yes, I have temporary/cyclical changes", "No persistent changes"],
    required: true,
    condition: { questionId: "breast_symptoms", answer: "I have swollen breast or changed in size or shape" }
  }
];

interface QuizProps {
  onComplete: (answers: Record<string, any>) => void;
  onClose: () => void;
}

export default function Quiz({ onComplete, onClose }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentAnswer, setCurrentAnswer] = useState<any>("");
  
  // Filter questions based on conditions
  const getVisibleQuestions = () => {
    return quizQuestions.filter(question => {
      if (!question.condition) return true;
      
      const conditionAnswer = answers[question.condition.questionId];
      return conditionAnswer === question.condition.answer;
    });
  };
  
  const visibleQuestions = getVisibleQuestions();

  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / visibleQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === visibleQuestions.length - 1;

  const handleNext = () => {
    // Save current answer
    const updatedAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      // Calculate BMI if both weight and height are provided
      if (updatedAnswers.weight && updatedAnswers.height) {
        const bmi = Number(updatedAnswers.weight) / (Number(updatedAnswers.height) ** 2);
        updatedAnswers.bmi = Math.round(bmi * 10) / 10;
        updatedAnswers.obesity = bmi >= 30 ? "Yes" : "No";
      }
      onComplete(updatedAnswers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer("");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      const previousQuestion = visibleQuestions[currentQuestionIndex - 1];
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
               num <= (currentQuestion.max || 100) &&
               currentAnswer !== "";
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
              step={currentQuestion.id === "height" ? "0.1" : "1"}
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
              <span>Question {currentQuestionIndex + 1} of {visibleQuestions.length}</span>
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
            
            {/* Show BMI calculation for height question */}
            {currentQuestion.id === "height" && answers.weight && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  With your weight of {answers.weight}kg, your BMI will be calculated automatically.
                </p>
              </div>
            )}
            
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