import { enhancedAI } from './enhancedAI';

interface NutritionalData {
  totalCalories: number;
  macronutrients: {
    protein: { grams: number; percentage: number; };
    carbohydrates: { grams: number; percentage: number; };
    fat: { grams: number; percentage: number; };
    fiber: { grams: number; percentage: number; };
  };
  micronutrients: {
    vitamins: Record<string, { amount: number; unit: string; dailyValue: number; }>;
    minerals: Record<string, { amount: number; unit: string; dailyValue: number; }>;
  };
  healthScore: number;
  ingredients: string[];
  recommendations: string[];
  portionSize: string;
}

interface FoodAnalysisResult {
  success: boolean;
  analysis: NutritionalData;
  confidence: number;
  processingTime: number;
}

export class FoodAnalysisService {
  
  async analyzeFoodImage(base64Image: string): Promise<FoodAnalysisResult> {
    const startTime = Date.now();
    
    try {
      const prompt = `
        Analyze this food image and provide comprehensive nutritional information. 
        
        Please identify:
        1. All visible food items and ingredients
        2. Estimated portion size
        3. Complete nutritional breakdown including:
           - Total calories
           - Macronutrients (protein, carbs, fat, fiber) in grams and percentages
           - Key vitamins (A, C, D, E, K, B vitamins) with amounts and daily values
           - Important minerals (Iron, Calcium, Potassium, Magnesium, Zinc) with amounts and daily values
        4. Health score (0-100) based on nutritional balance
        5. Health recommendations for this meal
        
        Respond in JSON format with the following structure:
        {
          "totalCalories": number,
          "macronutrients": {
            "protein": {"grams": number, "percentage": number},
            "carbohydrates": {"grams": number, "percentage": number},
            "fat": {"grams": number, "percentage": number},
            "fiber": {"grams": number, "percentage": number}
          },
          "micronutrients": {
            "vitamins": {
              "Vitamin A": {"amount": number, "unit": "mcg", "dailyValue": number},
              "Vitamin C": {"amount": number, "unit": "mg", "dailyValue": number},
              "Vitamin D": {"amount": number, "unit": "mcg", "dailyValue": number},
              "Vitamin E": {"amount": number, "unit": "mg", "dailyValue": number},
              "Vitamin K": {"amount": number, "unit": "mcg", "dailyValue": number},
              "Thiamin (B1)": {"amount": number, "unit": "mg", "dailyValue": number},
              "Riboflavin (B2)": {"amount": number, "unit": "mg", "dailyValue": number},
              "Niacin (B3)": {"amount": number, "unit": "mg", "dailyValue": number},
              "Vitamin B6": {"amount": number, "unit": "mg", "dailyValue": number},
              "Folate (B9)": {"amount": number, "unit": "mcg", "dailyValue": number},
              "Vitamin B12": {"amount": number, "unit": "mcg", "dailyValue": number}
            },
            "minerals": {
              "Iron": {"amount": number, "unit": "mg", "dailyValue": number},
              "Calcium": {"amount": number, "unit": "mg", "dailyValue": number},
              "Potassium": {"amount": number, "unit": "mg", "dailyValue": number},
              "Magnesium": {"amount": number, "unit": "mg", "dailyValue": number},
              "Zinc": {"amount": number, "unit": "mg", "dailyValue": number},
              "Phosphorus": {"amount": number, "unit": "mg", "dailyValue": number},
              "Sodium": {"amount": number, "unit": "mg", "dailyValue": number}
            }
          },
          "healthScore": number,
          "ingredients": ["ingredient1", "ingredient2"],
          "recommendations": ["recommendation1", "recommendation2"],
          "portionSize": "description",
          "confidence": number
        }
        
        Be as accurate as possible with nutritional estimates based on visible portion sizes.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      const analysisText = response.choices[0].message.content;
      if (!analysisText) {
        throw new Error('No analysis content received');
      }

      const analysisData = JSON.parse(analysisText);
      const processingTime = Date.now() - startTime;

      // Validate and structure the response
      const result: FoodAnalysisResult = {
        success: true,
        analysis: {
          totalCalories: analysisData.totalCalories || 0,
          macronutrients: {
            protein: analysisData.macronutrients?.protein || { grams: 0, percentage: 0 },
            carbohydrates: analysisData.macronutrients?.carbohydrates || { grams: 0, percentage: 0 },
            fat: analysisData.macronutrients?.fat || { grams: 0, percentage: 0 },
            fiber: analysisData.macronutrients?.fiber || { grams: 0, percentage: 0 }
          },
          micronutrients: {
            vitamins: analysisData.micronutrients?.vitamins || {},
            minerals: analysisData.micronutrients?.minerals || {}
          },
          healthScore: analysisData.healthScore || 0,
          ingredients: analysisData.ingredients || [],
          recommendations: analysisData.recommendations || [],
          portionSize: analysisData.portionSize || 'Unknown'
        },
        confidence: analysisData.confidence || 75,
        processingTime
      };

      return result;

    } catch (error) {
      console.error('Food analysis error:', error);
      
      return {
        success: false,
        analysis: {
          totalCalories: 0,
          macronutrients: {
            protein: { grams: 0, percentage: 0 },
            carbohydrates: { grams: 0, percentage: 0 },
            fat: { grams: 0, percentage: 0 },
            fiber: { grams: 0, percentage: 0 }
          },
          micronutrients: { vitamins: {}, minerals: {} },
          healthScore: 0,
          ingredients: [],
          recommendations: [],
          portionSize: 'Unknown'
        },
        confidence: 0,
        processingTime: Date.now() - startTime
      };
    }
  }

  async getFoodRecommendations(nutritionalData: NutritionalData, userGoals: string[]): Promise<string[]> {
    try {
      const prompt = `
        Based on this nutritional analysis and user health goals, provide 3-5 specific recommendations:
        
        Nutrition: ${JSON.stringify(nutritionalData)}
        User Goals: ${userGoals.join(', ')}
        
        Focus on:
        - How to improve nutritional balance
        - Suggestions for better choices
        - Specific health benefits related to their goals
        
        Return as JSON array of strings.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
      return result.recommendations || [];

    } catch (error) {
      console.error('Food recommendations error:', error);
      return [
        'Consider adding more vegetables to increase fiber and vitamins',
        'Balance your macronutrients with adequate protein',
        'Stay hydrated and maintain portion control'
      ];
    }
  }

  calculateHealthScore(nutritionalData: NutritionalData): number {
    let score = 100;
    
    // Deduct points for imbalanced macros
    const totalMacros = nutritionalData.macronutrients.protein.percentage + 
                       nutritionalData.macronutrients.carbohydrates.percentage + 
                       nutritionalData.macronutrients.fat.percentage;
    
    if (totalMacros < 95 || totalMacros > 105) {
      score -= 10;
    }
    
    // Reward high fiber
    if (nutritionalData.macronutrients.fiber.grams >= 5) {
      score += 5;
    } else if (nutritionalData.macronutrients.fiber.grams < 2) {
      score -= 10;
    }
    
    // Check vitamin coverage
    const vitaminCount = Object.keys(nutritionalData.micronutrients.vitamins).length;
    if (vitaminCount < 5) {
      score -= 15;
    }
    
    // Check mineral coverage
    const mineralCount = Object.keys(nutritionalData.micronutrients.minerals).length;
    if (mineralCount < 4) {
      score -= 10;
    }
    
    return Math.max(0, Math.min(100, score));
  }
}

export const foodAnalysisService = new FoodAnalysisService();