// Generate report using the last quiz answers from the console logs
const lastQuizAnswers = {
  "age": "60",
  "ethnicity": "White (non-Hispanic)",
  "family_history": "Yes, I have first-degree relative with BC",
  "brca_test": "BRCA1/2",
  "dense_breast": "Yes",
  "menstrual_age": "Before 12 years old",
  "pregnancy_age": "Never had a full-term pregnancy",
  "oral_contraceptives": "Yes, currently using",
  "menopause": "Yes, at age 55 or later",
  "weight": "80",
  "height": "1.6",
  "hrt": "Yes",
  "western_diet": "Yes, Western diet",
  "smoke": "Yes",
  "alcohol": "2 or more drinks",
  "night_shift": "Yes",
  "stressful_events": "Yes, striking life events",
  "benign_condition": "Yes, Atypical Hyperplasia (ADH/ALH)",
  "precancerous_condition": "Yes, I am currently receiving treatment for breast cancer",
  "cancer_stage": "Stage 4",
  "mammogram_frequency": "Annually (once a year)",
  "breast_symptoms": "I have a lump in my breast",
  "lump_characteristics": "Growing Lump with size over 5cm",
  "country": "United States",
  "bmi": 31.2,
  "obesity": "Yes"
};

// Store in localStorage for the demo report page
localStorage.setItem('completedQuizAnswers', JSON.stringify(lastQuizAnswers));

// Redirect to demo report
window.location.href = '/demo-report';