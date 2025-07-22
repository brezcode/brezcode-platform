// BrezCode Roleplay Testing Script
const scenarios = [
  {
    name: "BrezCode Health Assessment Support",
    description: "Customer seeking breast cancer risk assessment and health guidance",
    customerPersona: "Sarah, 35-year-old professional with family history of breast cancer",
    assistantRole: "Empathetic health educator and BrezCode specialist",
    objectives: [
      "Provide accurate health information",
      "Guide through risk assessment process", 
      "Address anxiety with compassion",
      "Recommend appropriate next steps"
    ],
    timeframeMins: 15,
    difficulty: "intermediate",
    tags: ["health", "education", "risk-assessment", "support"]
  },
  {
    name: "BrezCode Product Information",
    description: "Customer inquiring about BrezCode's features and benefits",
    customerPersona: "Maria, 42-year-old mother interested in preventive health tools",
    assistantRole: "Knowledgeable BrezCode product specialist",
    objectives: [
      "Explain BrezCode's comprehensive health platform",
      "Highlight AI-powered personalization features",
      "Address concerns about data privacy",
      "Guide through sign-up process"
    ],
    timeframeMins: 10,
    difficulty: "beginner", 
    tags: ["product", "onboarding", "features", "privacy"]
  },
  {
    name: "BrezCode Technical Support",
    description: "Customer experiencing issues with health report generation",
    customerPersona: "Jessica, 28-year-old tech-savvy user having report issues",
    assistantRole: "Technical support specialist with health platform expertise",
    objectives: [
      "Diagnose report generation problems",
      "Provide clear technical solutions",
      "Ensure user can access their health insights",
      "Prevent future technical issues"
    ],
    timeframeMins: 20,
    difficulty: "advanced",
    tags: ["technical", "troubleshooting", "reports", "platform"]
  }
];

const testConversations = [
  {
    scenario: "Health Assessment Support",
    messages: [
      {
        sender: "customer_ai",
        message: "Hi, I'm really worried about my breast cancer risk. My mom had breast cancer at 45 and I'm 35 now. I heard about BrezCode but I'm not sure where to start."
      },
      {
        sender: "assistant_ai", 
        message: "I understand your concern, Sarah. Having a family history can feel overwhelming, but it's wonderful that you're being proactive about your health. BrezCode is designed specifically to help women like you understand their risk and take positive action. Would you like me to walk you through our comprehensive risk assessment?"
      },
      {
        sender: "customer_ai",
        message: "Yes please, but I'm scared of what I might find out. What if my risk is really high?"
      },
      {
        sender: "assistant_ai",
        message: "Your feelings are completely valid - it takes courage to face these concerns. Here's what I want you to know: knowledge is empowering, and regardless of your risk level, there are always positive steps you can take. Our assessment looks at many factors, not just family history, and provides personalized recommendations for managing your health. Would you feel more comfortable if I explained what the assessment covers first?"
      }
    ]
  }
];

console.log("BrezCode Roleplay Test Scenarios Created");
console.log(`Generated ${scenarios.length} scenarios and ${testConversations.length} test conversations`);