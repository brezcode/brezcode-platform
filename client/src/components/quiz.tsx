import { useState, useEffect } from "react";
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
  reason?: string;
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

// 6-Section BC Assessment Quiz based on updated CSV format
const quizSections = [
  {
    title: "Section 1: Demographic Factors",
    description: "Basic demographic information that influences baseline risk",
    questions: [
      {
        id: "age",
        question: "What is your current age?",
        reason: "According to a 2024 study by American Cancer Society, breast cancer risk increases with age: Compare to women below 50, women aged 50-59 have a 14% higher risk (RR ≈ 1.14), 60-69 a 67% higher risk (RR ≈ 1.67), and ≥70 a 233% higher risk (RR ≈ 3.33).",
        type: "number_range" as const,
        min: 20,
        max: 80,
        required: true
      },
      {
        id: "country",
        question: "Which country are you residing now?",
        reason: "According to a 2024 study by American Cancer Society, 1 in 8 women in US will develop cancer in their lifetime",
        type: "multiple_choice" as const,
        options: ["United States", "Canada", "United Kingdom", "Australia", "Other"],
        required: true
      },
      {
        id: "ethnicity",
        question: "What is your racial/ethnic background?",
        reason: "According to a 2024 study by American Cancer Society, breast cancer risk varies by ethnicity: Compare to Asian women, Black women is 2.25 times higher, American Indian is 1.74 times higher, White (non-Hispanic) women is 1.64 times higher, Hispanic women is 1.15 times higher due to differences in genetic predispositions.",
        type: "multiple_choice" as const,
        options: ["White (non-Hispanic)", "Black", "Asian", "Hispanic/Latino", "American Indian"],
        required: true
      }
    ]
  },
  {
    title: "Section 2: Family History and Genetics Factors",
    description: "Hereditary and genetic risk factors",
    questions: [
      {
        id: "family_history",
        question: "Do you have a first-degree relative (mother, sister, daughter) or second-degree relative with breast cancer (BC)?",
        reason: "According to a 1997 study by Cambridge Institute of Public Health, having a first-degree relative or second-degree relative with breast cancer (BC) increases your lifetime breast cancer risk by approximately 100% (relative risk, RR ≈ 2.0), and 50% (RR≈ 1.5) respectively.",
        type: "multiple_choice" as const,
        options: ["Yes, I have first-degree relative with BC", "Yes, I have second-degree relative with BC", "Yes, I have both first-degree relative and second-degree relative with BC", "No, I do not have any relative with BC"],
        required: true
      },
      {
        id: "brca_test",
        question: "Have you ever been told you have one of the following genetic or family cancer syndromes after having genetic testing?",
        reason: "According to a 2017 study by Kuchenbaecker et al., specific genetic mutations can significantly increase breast cancer risk. Women with a BRCA1/2 mutation have a 70% risk (RR ≈ 1.7)",
        type: "multiple_choice" as const,
        options: ["BRCA1/2", "No condition", "Not tested"],
        required: true
      }
    ]
  },
  {
    title: "Section 3: Reproductive and Hormonal Factors",
    description: "Hormonal exposure and reproductive history",
    questions: [
      {
        id: "menstrual_age",
        question: "At what age did you have your first menstrual period?",
        reason: "According to a 2021 study by Geunwon et al., early menarche (before age 12) increases breast cancer risk by 10-20% (RR ≈ 1.10-1.20) due to prolonged estrogen exposure.",
        type: "multiple_choice" as const,
        options: ["Before 12 years old", "12 years old or later"],
        required: true
      },
      {
        id: "pregnancy_age",
        question: "Have you ever been pregnant? If yes, at what age did you have your first full-term pregnancy?",
        reason: "According to a 2012 meta-analysis by the Collaborative Group in Breast Cancer, Women who have never had a full-term pregnancy have approximately a 27% increased risk (RR ≈ 1.27). Also, according to a 2018 study by Nichols et al., women who have their first full-term pregnancy after age 30 or between ages 25-29 have a 20-40% (relative risk, RR ≈ 1.20-1.40) or 10-20% (relative risk, RR ≈ 1.10-1.20) increased lifetime risk of breast cancer respectively.",
        type: "multiple_choice" as const,
        options: ["Never had a full-term pregnancy", "Age 30 or older", "Age 25-29", "Before age 25"],
        required: true
      },
      {
        id: "oral_contraceptives",
        question: "Have you ever used hormonal birth control (e.g., pills, patches, injections)?",
        reason: "According to the National Cancer Institute, women who have ever used oral contraceptives have a slight 7% (RR ≈ 1.07) increase in the risk of breast cancer compared to those who have never used them. Current users have a 24% (RR ≈ 1.24) increase in risk, which declines after stopping use.",
        type: "multiple_choice" as const,
        options: ["Yes, currently using", "Yes, used in the past", "No, never used"],
        required: true
      },
      {
        id: "menopause",
        question: "Have you gone without a menstrual period for 12 or more consecutive months (excluding pregnancy or medical conditions)?",
        reason: "According to the American Cancer Society, women who have gone through menopause have a higher risk of breast cancer compared to pre-menopausal women of the same age. Studies show a relative risk (RR) of approximately 1.5–2.0 for post-menopausal women, largely due to changes in hormone levels, especially estrogen, after menopause.",
        type: "multiple_choice" as const,
        options: ["Yes, at age 55 or older", "Yes, before age 55", "Not yet"],
        required: true
      },
      {
        id: "weight",
        question: "What is your weight in kg?",
        reason: "According to a 2018 meta-analysis by Liu et al., obesity (BMI ≥ 30) in postmenopausal women increases breast cancer risk by approximately 31% (RR ≈ 1.31), due to elevated estrogen levels from fat tissue.",
        type: "number_range" as const,
        min: 40,
        max: 150,
        required: true
      },
      {
        id: "height",
        question: "What is your height in meters?",
        reason: "Height and weight are used to calculate your Body Mass Index (BMI). Obesity (BMI ≥ 30) is associated with increased breast cancer risk in postmenopausal women.",
        type: "number_range" as const,
        min: 1.4,
        max: 2.1,
        required: true
      },
      {
        id: "hrt",
        question: "Have you ever used Combined Hormone Replacement Therapy (HRT) for more than 5 years?",
        reason: "According to a 2020 study by Vinogradova et al., women who use combined estrogen-progestin HRT for more than 5 years have a 20-30% increased risk of breast cancer (relative risk, RR ≈ 1.20-1.30)",
        type: "multiple_choice" as const,
        options: ["Yes", "No"],
        required: true
      }
    ]
  },
  {
    title: "Section 4: Symptom Risk Factors",
    description: "Current breast symptoms and related factors",
    questions: [
      {
        id: "breast_symptoms",
        question: "Do you have any breast symptoms such as lumps, pain, or nipple discharge?",
        reason: "According to a 2017 study by Kosters et al., women who regularly perform BSE have a 15-20% reduced risk of interval breast cancer detection (relative risk, RR ≈ 0.80-0.85). BSE may facilitate earlier detection of palpable tumors between mammogram screenings.",
        type: "multiple_choice" as const,
        options: ["I have breast pain", "I have a lump in my breast", "I have swollen breast or changed in size or shape", "Yes, I have other symptoms", "No, I don't have any symptoms"],
        required: true
      },
      {
        id: "pain_severity",
        question: "How painful is it? (Feeling of heaviness, tenderness, a burning, prickling or stabbing pain, or a feeling of tightness.)?",
        reason: "According to a 2019 study by Stachs et al., breast pain (mastalgia) alone is rarely associated with breast cancer, with a minimal 0-10% increased likelihood of cancer detection (relative risk, RR ≈ 1.0-1.10) compared to women without pain, as most cases are benign and hormonal.",
        type: "multiple_choice" as const,
        options: ["Severe Cyclical Pain in Breast or Armpit", "Severe and Continuous Non-Cyclical Breast Pain in one part of the breast or armpit", "Mild Pain"],
        required: false,
        condition: { questionId: "breast_symptoms", answer: "I have breast pain" }
      },
      {
        id: "lump_characteristics",
        question: "Is it larger than 2 cm or growing rapidly?",
        reason: "According to a 2017 study by Kerlikowske et al., women with breast lumps larger than 2 cm and showing rapid growth have a 2-3 times higher risk of breast cancer (relative risk, RR ≈ 2.0-3.0) compared to women with smaller, stable lumps or no lumps.",
        type: "multiple_choice" as const,
        options: ["Growing Lump with size over 5cm", "Growing Lump size over 2cm", "Stable Lump size over 2cm", "Stable Lump size below 2cm"],
        required: false,
        condition: { questionId: "breast_symptoms", answer: "I have a lump in my breast" }
      },
      {
        id: "breast_changes",
        question: "Are you currently experiencing swollen breast or persistent changes in breast size or shape",
        reason: "According to a 2020 study by Gewefel et al., women with persistent changes in breast size or shape have a 50-100% increased risk of breast cancer (relative risk, RR ≈ 1.50-2.00) compared to women without these symptoms.",
        type: "multiple_choice" as const,
        options: ["Yes, I have swollen breast or armpit", "Yes, I have persistent changes in breast size or shape"],
        required: false,
        condition: { questionId: "breast_symptoms", answer: "I have swollen breast or changed in size or shape" }
      }
    ]
  },
  {
    title: "Section 5: Screening and Precancerous Risk Factors",
    description: "Screening history and precancerous conditions",
    questions: [
      {
        id: "mammogram_frequency",
        question: "How often do you undergo mammogram or other screening for breast cancer?",
        reason: "According to a 2020 study by Hofvind et al., women who undergo annual mammography screening have a 40-50% reduced risk of interval breast cancer (relative risk, RR ≈ 0.50-0.60) compared to those who never screen.",
        type: "multiple_choice" as const,
        options: ["Annually (once a year)", "Biennially (every 2 years)", "Never or irregularly"],
        required: true
      },
      {
        id: "dense_breast",
        question: "Have you been told that you have dense breast tissue based on a mammogram?",
        reason: "According to a 2019 meta-analysis by Bodewes et al., women with dense breasts have a 2 times higher risk of breast cancer (relative risk, RR ≈ 2.0) compared to women with non-dense breasts.",
        type: "multiple_choice" as const,
        options: ["Yes", "No", "I don't know (I've never had a mammogram)"],
        required: true
      },
      {
        id: "benign_condition",
        question: "Have you been diagnosed with a benign breast condition, such as atypical hyperplasia, lobular carcinoma in situ (LCIS), or complex/complicated cysts?",
        reason: "According to a 2015 study by Hartmann et al., women with a history of atypical hyperplasia have a 300-400% increased risk of breast cancer (relative risk, RR ≈ 4.0-5.0), women diagnosed with LCIS have a 150-200% increased risk (RR ≈ 2.5-3.0).",
        type: "multiple_choice" as const,
        options: ["Yes, Atypical Hyperplasia (ADH/ALH)", "Yes, LCIS", "Yes, complex/complicated cysts", "Yes, other benign condition (e.g., simple cysts, fibrocystic changes)", "No benign breast conditions"],
        required: true
      },
      {
        id: "cancer_history",
        question: "Have you been diagnosed with a cancerous breast condition, such as Invasive Breast Cancer (IBC), Invasive Lobular Carcinoma (ILC), Ductal Carcinoma (DSIC)?",
        reason: "According to a 2015 study by Hartmann et al., women with a history of breast cancer will have a 300-400% increased risk of breast cancer recurrence (relative risk, RR ≈ 4.0-5.0)",
        type: "multiple_choice" as const,
        options: ["Yes, I am a Breast Cancer Patient currently undergoing treatment", "Yes, I am a Breast Cancer Survivor taking medication to lower the risk of recurrence", "No diagnosed breast conditions"],
        required: true
      },
      {
        id: "cancer_stage",
        question: "What Stage is/was your breast cancer",
        reason: "Cancer stage helps determine appropriate follow-up care and risk management strategies.",
        type: "multiple_choice" as const,
        options: ["Stage 0", "Stage 1", "Stage 2", "Stage 3", "Stage 4"],
        required: false,
        condition: { questionId: "cancer_history", answer: "Yes, I am a Breast Cancer Patient currently undergoing treatment" }
      }
    ]
  },
  {
    title: "Section 6: Lifestyle and Environmental Factors",
    description: "Modifiable lifestyle and environmental risk factors",
    questions: [
      {
        id: "western_diet",
        question: "Do you regularly follow a Western diet (e.g., high in processed foods, red meats, saturated fats, and low in fruits, vegetables, and fiber)?",
        reason: "According to a 2018 study by Castello et al., women adhering to a Western dietary pattern have a 33% increased risk of breast cancer (relative risk, RR ≈ 1.33) compared to those following a Mediterranean diet.",
        type: "multiple_choice" as const,
        options: ["Yes, Western diet", "Yes, mixed diet with some Western elements", "No, mostly non-Western diet (e.g., Mediterranean or plant-based)"],
        required: true
      },
      {
        id: "smoke",
        question: "Do you currently smoke tobacco products?",
        reason: "According to a 2024 study by Hussain et al., current smoking increases breast cancer risk by 10-15% (relative risk, RR ≈ 1.10-1.15) compared to never-smokers.",
        type: "multiple_choice" as const,
        options: ["Yes", "No"],
        required: true
      },
      {
        id: "alcohol",
        question: "How many alcoholic drinks do you consume per day, on average?",
        reason: "According to a 2021 study by Sun et al., consuming one alcoholic drink per day increases breast cancer risk by 7-10% (RR ≈ 1.07-1.10), and two or more drinks further elevates risk by 15-20% per additional drink.",
        type: "multiple_choice" as const,
        options: ["2 or more drinks", "1 drink", "None"],
        required: true
      },
      {
        id: "night_shift",
        question: "Do you regularly work night shifts (e.g., shifts including midnight to 5:00 AM)?",
        reason: "According to a 2021 meta-analysis by Manouchehri et al., women who regularly work night shifts have a 8-13% increased risk of breast cancer (relative risk, RR ≈ 1.08-1.13).",
        type: "multiple_choice" as const,
        options: ["Yes", "No"],
        required: true
      },
      {
        id: "stressful_events",
        question: "Have you experienced striking stressful life events (e.g., death of a close family member, divorce, or major financial crisis)?",
        reason: "According to a 2013 meta-analysis by Lin et al., women who have experienced stressful to striking life events have a 10-107% increased risk of breast cancer (relative risk, RR ≈ 1.1-2.07).",
        type: "multiple_choice" as const,
        options: ["Yes, striking life events", "Yes, stressful life events", "No, no significant stressful events"],
        required: true
      },
      {
        id: "chronic_stress",
        question: "Do you experience chronic stress (e.g., ongoing high stress from work, family, or life events)?",
        reason: "According to a 2022 meta-analysis by Zhang et al., women experiencing chronic stress have a 10-20% increased risk of breast cancer (relative risk, RR ≈ 1.10-1.20).",
        type: "multiple_choice" as const,
        options: ["Yes, chronic high stress", "Yes, occasional moderate stress", "No, low or no chronic stress"],
        required: true
      },
      {
        id: "sugar_diet",
        question: "Do you regularly consume a high sugar diet (e.g., frequent intake of sugary drinks, desserts, or processed foods with added sugars)?",
        reason: "According to a 2022 study by Farvid et al., women with a high intake of added sugars (e.g., ≥5 servings/week of sugary beverages) have a 10-20% increased risk of breast cancer (relative risk, RR ≈ 1.10-1.20).",
        type: "multiple_choice" as const,
        options: ["Yes, high sugar diet", "Yes, moderate sugar diet", "No, low or no added sugar diet"],
        required: true
      },
      {
        id: "exercise",
        question: "Do you engage in regular moderate to vigorous exercise (e.g., at least 150 minutes per week of activities like brisk walking, running, or cycling)?",
        reason: "According to a 2020 study by Guo et al., women who engage in regular moderate to vigorous physical activity (≥10 MET-hours/week) have a 15-20% reduced risk of breast cancer (relative risk, RR ≈ 0.80-0.85).",
        type: "multiple_choice" as const,
        options: ["Yes, regular moderate to vigorous exercise", "Yes, occasional light exercise", "No, little or no regular exercise"],
        required: true
      }
    ]
  }
];

// Flatten all questions for easier processing  
const quizQuestions: QuizQuestion[] = quizSections.flatMap(section => 
  section.questions.map(q => ({ ...q, section: section.title }))
);

interface QuizProps {
  onComplete: (answers: Record<string, any>) => void;
  onClose: () => void;
}

export default function Quiz({ onComplete, onClose }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showReasons, setShowReasons] = useState<Record<string, boolean>>({});
  const [currentAnswer, setCurrentAnswer] = useState<any>("");
  const [userCountry, setUserCountry] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  // Get user's country from IP address
  useEffect(() => {
    const getUserCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCountry(data.country_name || 'Unknown');
      } catch (error) {
        console.error('Failed to get user location:', error);
        setUserCountry('Unknown');
      }
    };

    getUserCountry();
  }, []);

  // Filter questions based on conditions
  const getVisibleQuestions = () => {
    return quizQuestions.filter(question => {
      if (!question.condition) return true;

      const conditionAnswer = answers[question.condition.questionId];
      return conditionAnswer === question.condition.answer;
    });
  };

  const visibleQuestions = getVisibleQuestions();

  // Format reason text to be more friendly and readable
  const formatReasonText = (reason: string) => {
    // Clean up the text to be more user-friendly
    let formatted = reason
      .replace(/According to a \d+ study by.*?, /, "Research shows that ")
      .replace(/According to.*? study.*?, /, "Research shows that ")
      .replace(/According to.*?, /, "Research shows that ")
      .replace(/Studies show.*?, /, "Research shows that ")
      .replace(/relative risk.*?\)/g, "")
      .replace(/\(RR.*?\)/g, "")
      .replace(/approximately /g, "about ")
      .replace(/\(relative risk, RR ≈.*?\)/g, "")
      .replace(/Compare to.*?, /g, "")
      .replace(/Women who /g, "Women who ")
      .replace(/women who /g, "women who ");

    // Split into sentences and create bullet points
    const sentences = formatted.split(/\. (?=[A-Z])/);
    const bulletPoints: string[] = [];

    sentences.forEach(sentence => {
      if (sentence.trim().length > 10) {
        let cleanSentence = sentence.trim();
        if (!cleanSentence.endsWith('.')) {
          cleanSentence += '.';
        }
        bulletPoints.push(cleanSentence);
      }
    });

    // Return formatted JSX
    return (
      <div className="space-y-2">
        {bulletPoints.map((point, index) => (
          <div key={index} className="flex items-start">
            <span className="text-blue-600 mr-2 mt-1">•</span>
            <span>{point}</span>
          </div>
        ))}
      </div>
    );
  };

  // Ensure we have a valid current question
  const currentQuestion = visibleQuestions[currentQuestionIndex] || visibleQuestions[visibleQuestions.length - 1];
  const progress = Math.min(((currentQuestionIndex + 1) / Math.max(visibleQuestions.length, 1)) * 100, 100);
  const isLastQuestion = currentQuestionIndex >= visibleQuestions.length - 1;

  const handleNext = () => {
    // Validate menopause age against current age for question 9
    if (currentQuestion.id === "menopause" && answers.age && currentAnswer) {
      const userAge = Number(answers.age);

      if (currentAnswer === "Yes, at age 55 or older" && userAge < 55) {
        setValidationError("Your menopause age cannot be 55 or older if you are currently under 55. Please select a different option.");
        return;
      }

      if (currentAnswer === "Yes, at age 55 or older" && userAge === 55) {
        setValidationError("Please verify: You are currently 55 years old and selected 'Yes, at age 55 or older' for menopause. This means you went through menopause at exactly age 55, which is technically correct but at the boundary. Please confirm this is accurate or select 'Yes, before age 55' if your menopause was before age 55.");
        return;
      }

      if (currentAnswer === "Yes, before age 55" && userAge < 40) {
        setValidationError("Please verify your menopause status. If you went through menopause before age 55 but are currently under 40, this seems unusual. Please double-check your selection.");
        return;
      }

      if (currentAnswer === "Yes, before age 55" && userAge >= 55) {
        setValidationError("Please verify: You are currently " + userAge + " years old and selected 'Yes, before age 55' for menopause. If you are 55 or older and went through menopause before age 55, this is correct. However, if you went through menopause at age 55 or later, please select 'Yes, at age 55 or older'.");
        return;
      }

      if (currentAnswer === "Not yet" && userAge >= 60) {
        setValidationError("Please verify: You are currently " + userAge + " years old and selected 'Not yet' for menopause. Most women go through menopause by age 60. Please double-check if you have truly not gone through menopause yet, or select the appropriate menopause option.");
        return;
      }
    }

    // Validate pregnancy age against current age for question 7
    if (currentQuestion.id === "pregnancy_age" && answers.age && currentAnswer) {
      const userAge = Number(answers.age);

      if (currentAnswer === "Age 30 or older" && userAge < 30) {
        setValidationError("You cannot have had your first pregnancy at age 30 or older if you are currently under 30. Please select a different option.");
        return;
      }

      if (currentAnswer === "Age 30 or older" && userAge === 30) {
        setValidationError("Please verify: You are currently 30 years old and selected 'Age 30 or older' for first pregnancy. This means you had your first pregnancy at exactly age 30, which is technically correct but at the boundary. Please confirm this is accurate or select 'Age 25-29' if your first pregnancy was before age 30.");
        return;
      }

      if (currentAnswer === "Age 25-29" && userAge < 25) {
        setValidationError("You cannot have had your first pregnancy at age 25-29 if you are currently under 25. Please select a different option.");
        return;
      }

      if (currentAnswer === "Age 25-29" && userAge === 25) {
        setValidationError("Please verify: You are currently 25 years old and selected 'Age 25-29' for first pregnancy. This means you had your first pregnancy at exactly age 25, which is technically correct but at the boundary. Please confirm this is accurate or select 'Before age 25' if your first pregnancy was before age 25.");
        return;
      }
    }

    // Clear any validation errors
    setValidationError("");

    // Save current answer
    const updatedAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
    setAnswers(updatedAnswers);

    // Check if this creates new conditional questions that need to be shown
    const newVisibleQuestions = quizQuestions.filter(question => {
      if (!question.condition) return true;
      const conditionAnswer = updatedAnswers[question.condition.questionId];
      return conditionAnswer === question.condition.answer;
    });

    // Find next question index in the new visible questions list
    let nextQuestionIndex = currentQuestionIndex + 1;

    // If we're at the last question in current visible list, check if we have new conditional questions
    if (nextQuestionIndex >= visibleQuestions.length) {
      // Check if there are new conditional questions that should be shown
      if (newVisibleQuestions.length > visibleQuestions.length) {
        // There are new conditional questions, continue to the first new one
        nextQuestionIndex = visibleQuestions.length;
      } else {
        // No new questions, we're at the end
        const finalAnswers = { 
          ...updatedAnswers,
          country: userCountry // Automatically include detected country
        };

        // Calculate BMI if both weight and height are provided
        if (finalAnswers.weight && finalAnswers.height) {
          const bmi = Number(finalAnswers.weight) / (Number(finalAnswers.height) ** 2);
          finalAnswers.bmi = Math.round(bmi * 10) / 10;
          finalAnswers.obesity = bmi >= 30 ? "Yes" : "No";
        }
        
        // Save answers to localStorage for demo report generation
        localStorage.setItem('brezcode_quiz_answers', JSON.stringify(finalAnswers));
        console.log('Quiz completed with answers:', finalAnswers);
        
        onComplete(finalAnswers);
        return;
      }
    }

    setCurrentQuestionIndex(nextQuestionIndex);
    setCurrentAnswer("");
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setValidationError("");
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
        const trimmedAnswer = currentAnswer.trim();
        if (trimmedAnswer === "") return false;

        // Email validation
        if (currentQuestion.id === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(trimmedAnswer);
        }

        // Phone number validation (basic - just check if it contains digits)
        if (currentQuestion.id === "phone_number") {
          const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
          return phoneRegex.test(trimmedAnswer);
        }

        return true;
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
          <div className="space-y-4">
            <RadioGroup value={currentAnswer} onValueChange={(value) => {
              setCurrentAnswer(value);
              setValidationError("");
            }}>
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-lg cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {validationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{validationError}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
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
              type={currentQuestion.id === "email" ? "email" : currentQuestion.id === "phone_number" ? "tel" : "text"}
              value={currentAnswer}
              onChange={(e) => {
                setCurrentAnswer(e.target.value);
                setValidationError("");
              }}
              className="text-xl p-4"
              placeholder={
                currentQuestion.id === "email" ? "Enter your email address" :
                currentQuestion.id === "phone_number" ? "Enter your phone number" :
                currentQuestion.id === "first_name" ? "Enter your first name" :
                "Type your answer here"
              }
            />

            {/* Show validation errors for email and phone */}
            {currentAnswer && !isAnswerValid() && (
              <div className="text-red-600 text-sm mt-2">
                {currentQuestion.id === "email" && "Please enter a valid email address"}
                {currentQuestion.id === "phone_number" && "Please enter a valid phone number (at least 10 digits)"}
              </div>
            )}

            {/* Privacy statement for phone number */}
            {currentQuestion.id === "phone_number" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      <strong>Privacy Promise:</strong> We're committed to your privacy. We'll never share your number with any third parties.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Skip quiz with default answers for testing
                  const defaultAnswers = {
                    age: "35",
                    ethnicity: "White (non-Hispanic)",
                    family_history: "No, I do not have any relative with BC",
                    brca_test: "Not tested",
                    dense_breast: "No",
                    menstrual_age: "12 years old or later",
                    pregnancy_age: "Before age 25",
                    oral_contraceptives: "No, never used",
                    menopause: "Not yet",
                    weight: "65",
                    height: "1.65",
                    hrt: "No",
                    western_diet: "No, mostly non-Western diet (e.g., Mediterranean or plant-based)",
                    smoke: "No",
                    alcohol: "None",
                    night_shift: "No",
                    stressful_events: "No, no significant stressful events",
                    benign_condition: "No, I have not been diagnosed with any benign breast conditions",
                    precancerous_condition: "No, I have not been diagnosed with breast cancer",
                    mammogram_frequency: "Biennially (every 2 years)",
                    breast_symptoms: "No, I don't have any symptoms",
                    country: userCountry,
                    bmi: 23.9,
                    obesity: "No"
                  };
                  onComplete(defaultAnswers);
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Skip Quiz (Test)
              </Button>
              <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </Button>
            </div>
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

            {/* Show BMI calculation and warning for height question */}
            {currentQuestion.id === "height" && answers.weight && currentAnswer && (
              <div className="bg-blue-50 p-4 rounded-lg">
                {(() => {
                  const bmi = Number(answers.weight) / (Number(currentAnswer) ** 2);
                  const roundedBmi = Math.round(bmi * 10) / 10;
                  const isPostmenopausal = answers.menopause === "Yes, at age 55 or later" || answers.menopause === "Yes, before age 55";

                  return (
                    <div>
                      <p className="text-sm text-blue-700 mb-2">
                        <strong>Your calculated BMI: {roundedBmi}</strong>
                      </p>
                      {roundedBmi >= 30 && isPostmenopausal && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <p className="text-sm text-orange-700">
                            <strong>⚠️ Important Health Notice:</strong> Your BMI is {roundedBmi}, which is in the obese range (≥30). 
                            As a postmenopausal woman, this is associated with increased breast cancer risk. 
                            Consider speaking with your healthcare provider about strategies to lower your BMI through diet and exercise.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {renderQuestionInput()}

            {/* Show educational reason below the answer box */}
            {currentQuestion.reason && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mt-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800 mb-2">Why we ask this question:</p>
                    <div className="text-sm text-blue-700 leading-relaxed">
                      {formatReasonText(currentQuestion.reason)}
                    </div>
                  </div>
                </div>
              </div>
            )}
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