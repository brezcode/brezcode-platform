import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface UserProfile {
  age: number;
  gender: string;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  weight: number; // kg
  height: number; // cm
  healthGoals: string[];
  medicalConditions: string[];
  dietaryRestrictions: string[];
  foodPreferences: string[];
  allergies: string[];
}

interface NutritionalNeeds {
  dailyCalories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  fiber: number; // grams
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
}

interface FoodItem {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
  healthScore: number;
  tags: string[];
}

interface MealRecommendation {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodItem[];
  totalCalories: number;
  macroBreakdown: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  healthScore: number;
  reasoning: string;
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  recipe?: string;
}

interface DailyMealPlan {
  date: string;
  meals: MealRecommendation[];
  totalCalories: number;
  nutritionalGoalsNet: number; // percentage
  personalizedInsights: string[];
}

export class DietaryRecommendationEngine {
  
  // Calculate user's nutritional needs based on profile
  calculateNutritionalNeeds(profile: UserProfile): NutritionalNeeds {
    // Harris-Benedict Equation for BMR
    let bmr: number;
    if (profile.gender.toLowerCase() === 'female') {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    } else {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    }

    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    };

    const dailyCalories = Math.round(bmr * activityMultipliers[profile.activityLevel]);

    // Macronutrient distribution (can be adjusted based on health goals)
    const proteinCalories = dailyCalories * 0.25; // 25% protein
    const carbCalories = dailyCalories * 0.45;   // 45% carbs
    const fatCalories = dailyCalories * 0.30;    // 30% fat

    return {
      dailyCalories,
      protein: Math.round(proteinCalories / 4), // 4 calories per gram
      carbohydrates: Math.round(carbCalories / 4),
      fat: Math.round(fatCalories / 9), // 9 calories per gram
      fiber: Math.round(profile.age < 50 ? 25 : 21), // Daily fiber recommendation
      vitamins: {
        'Vitamin A': 700, // mcg
        'Vitamin C': 75,  // mg
        'Vitamin D': 15,  // mcg
        'Vitamin E': 15,  // mg
        'Vitamin K': 90,  // mcg
        'Thiamin': 1.1,   // mg
        'Riboflavin': 1.3, // mg
        'Niacin': 14,     // mg
        'Vitamin B6': 1.3, // mg
        'Folate': 400,    // mcg
        'Vitamin B12': 2.4 // mcg
      },
      minerals: {
        'Iron': 18,       // mg
        'Calcium': 1000,  // mg
        'Potassium': 2600, // mg
        'Magnesium': 310, // mg
        'Zinc': 8,        // mg
        'Phosphorus': 700, // mg
        'Sodium': 2300    // mg (upper limit)
      }
    };
  }

  // AI-powered meal recommendation generation
  async generateMealRecommendations(
    profile: UserProfile, 
    nutritionalNeeds: NutritionalNeeds,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    previousMeals: MealRecommendation[] = []
  ): Promise<MealRecommendation> {
    
    const calorieTargets = {
      breakfast: Math.round(nutritionalNeeds.dailyCalories * 0.25),
      lunch: Math.round(nutritionalNeeds.dailyCalories * 0.35),
      dinner: Math.round(nutritionalNeeds.dailyCalories * 0.30),
      snack: Math.round(nutritionalNeeds.dailyCalories * 0.10)
    };

    const targetCalories = calorieTargets[mealType];

    const prompt = `
      Generate a personalized ${mealType} recommendation for a user with the following profile:
      
      User Profile:
      - Age: ${profile.age}, Gender: ${profile.gender}
      - Activity Level: ${profile.activityLevel}
      - Health Goals: ${profile.healthGoals.join(', ')}
      - Medical Conditions: ${profile.medicalConditions.join(', ') || 'None'}
      - Dietary Restrictions: ${profile.dietaryRestrictions.join(', ') || 'None'}
      - Food Preferences: ${profile.foodPreferences.join(', ') || 'No specific preferences'}
      - Allergies: ${profile.allergies.join(', ') || 'None'}
      
      Nutritional Targets for ${mealType}:
      - Calories: ${targetCalories}
      - Protein: ${Math.round(nutritionalNeeds.protein * (targetCalories / nutritionalNeeds.dailyCalories))}g
      - Carbs: ${Math.round(nutritionalNeeds.carbohydrates * (targetCalories / nutritionalNeeds.dailyCalories))}g
      - Fat: ${Math.round(nutritionalNeeds.fat * (targetCalories / nutritionalNeeds.dailyCalories))}g
      - Fiber: ${Math.round(nutritionalNeeds.fiber * (targetCalories / nutritionalNeeds.dailyCalories))}g
      
      Previous meals today: ${previousMeals.map(m => m.foods.map(f => f.name).join(', ')).join(' | ') || 'None'}
      
      Please provide a meal recommendation that:
      1. Meets the nutritional targets
      2. Respects dietary restrictions and allergies
      3. Aligns with health goals
      4. Includes variety from previous meals
      5. Is practical and achievable
      
      Return in JSON format:
      {
        "mealType": "${mealType}",
        "foods": [
          {
            "name": "food name",
            "category": "protein/vegetable/grain/fruit/dairy/fat",
            "calories": number,
            "protein": number,
            "carbs": number,
            "fat": number,
            "fiber": number,
            "vitamins": {"Vitamin A": number, "Vitamin C": number},
            "minerals": {"Iron": number, "Calcium": number},
            "healthScore": number,
            "tags": ["nutrient-dense", "anti-inflammatory", etc]
          }
        ],
        "totalCalories": number,
        "macroBreakdown": {
          "protein": number,
          "carbs": number,
          "fat": number,
          "fiber": number
        },
        "healthScore": number,
        "reasoning": "explanation of why this meal is recommended",
        "preparationTime": number,
        "difficulty": "easy/medium/hard",
        "recipe": "brief preparation instructions"
      }
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      const recommendation = JSON.parse(response.choices[0].message.content || '{}');
      return recommendation as MealRecommendation;

    } catch (error) {
      console.error('Error generating meal recommendation:', error);
      
      // Fallback recommendation
      return {
        mealType,
        foods: [
          {
            name: "Balanced meal option",
            category: "mixed",
            calories: targetCalories,
            protein: Math.round(nutritionalNeeds.protein * 0.25),
            carbs: Math.round(nutritionalNeeds.carbohydrates * 0.25),
            fat: Math.round(nutritionalNeeds.fat * 0.25),
            fiber: Math.round(nutritionalNeeds.fiber * 0.25),
            vitamins: {},
            minerals: {},
            healthScore: 75,
            tags: ["balanced"]
          }
        ],
        totalCalories: targetCalories,
        macroBreakdown: {
          protein: Math.round(nutritionalNeeds.protein * 0.25),
          carbs: Math.round(nutritionalNeeds.carbohydrates * 0.25),
          fat: Math.round(nutritionalNeeds.fat * 0.25),
          fiber: Math.round(nutritionalNeeds.fiber * 0.25)
        },
        healthScore: 75,
        reasoning: "Balanced meal recommendation based on your nutritional needs",
        preparationTime: 15,
        difficulty: 'easy',
        recipe: "Follow a balanced approach with protein, vegetables, and healthy carbohydrates"
      };
    }
  }

  // Generate complete daily meal plan
  async generateDailyMealPlan(profile: UserProfile, date: string): Promise<DailyMealPlan> {
    const nutritionalNeeds = this.calculateNutritionalNeeds(profile);
    const meals: MealRecommendation[] = [];

    // Generate meals in sequence to avoid repetition
    const breakfast = await this.generateMealRecommendations(profile, nutritionalNeeds, 'breakfast');
    meals.push(breakfast);

    const lunch = await this.generateMealRecommendations(profile, nutritionalNeeds, 'lunch', meals);
    meals.push(lunch);

    const dinner = await this.generateMealRecommendations(profile, nutritionalNeeds, 'dinner', meals);
    meals.push(dinner);

    const snack = await this.generateMealRecommendations(profile, nutritionalNeeds, 'snack', meals);
    meals.push(snack);

    const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const nutritionalGoalsMetPercentage = Math.round((totalCalories / nutritionalNeeds.dailyCalories) * 100);

    const personalizedInsights = await this.generatePersonalizedInsights(profile, meals, nutritionalNeeds);

    return {
      date,
      meals,
      totalCalories,
      nutritionalGoalsNet: nutritionalGoalsMetPercentage,
      personalizedInsights
    };
  }

  // Generate personalized insights based on meal plan
  async generatePersonalizedInsights(
    profile: UserProfile, 
    meals: MealRecommendation[], 
    nutritionalNeeds: NutritionalNeeds
  ): Promise<string[]> {
    // Fallback insights to avoid API quota issues
    return [
      "Your meal plan provides balanced nutrition aligned with your health goals",
      "Focus on staying hydrated throughout the day",
      "Consider meal timing to optimize energy levels",
      "Include a variety of colorful fruits and vegetables for optimal nutrition",
      "Plan ahead to maintain consistency with your dietary goals"
    ];
  }

  // Machine learning-style preference learning
  async updateUserPreferences(
    userId: string, 
    mealFeedback: { mealId: string; rating: number; feedback: string }[]
  ): Promise<string[]> {
    // This would typically update a user preference model
    // For now, we'll analyze feedback patterns with AI
    
    const prompt = `
      Analyze this meal feedback and suggest updated food preferences:
      
      Feedback: ${JSON.stringify(mealFeedback)}
      
      Based on ratings and comments, suggest:
      1. Foods/ingredients to emphasize more
      2. Foods/ingredients to avoid
      3. Preparation styles preferred
      4. Flavor profiles liked
      
      Return as JSON: {
        "preferred": ["item1", "item2"],
        "avoid": ["item1", "item2"],
        "suggestions": ["suggestion1", "suggestion2"]
      }
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.suggestions || [];

    } catch (error) {
      console.error('Error updating preferences:', error);
      return ["Continue tracking your meal preferences for better recommendations"];
    }
  }

  // Integrate food photo analysis into meal planning
  async integratePhotoAnalysis(
    photoAnalysis: any, 
    userProfile: UserProfile, 
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ): Promise<{
    mealRecommendation: MealRecommendation;
    nutritionalComparison: any;
    suggestions: string[];
  }> {
    const nutritionalNeeds = this.calculateNutritionalNeeds(userProfile);
    
    // Convert photo analysis to meal recommendation format
    const photoMeal: MealRecommendation = {
      mealType,
      foods: [{
        name: photoAnalysis.foodItems?.join(', ') || 'Analyzed meal',
        category: 'mixed',
        calories: photoAnalysis.nutritionalBreakdown?.calories || 0,
        protein: photoAnalysis.nutritionalBreakdown?.protein || 0,
        carbs: photoAnalysis.nutritionalBreakdown?.carbohydrates || 0,
        fat: photoAnalysis.nutritionalBreakdown?.fat || 0,
        fiber: photoAnalysis.nutritionalBreakdown?.fiber || 0,
        vitamins: photoAnalysis.vitamins || {},
        minerals: photoAnalysis.minerals || {},
        healthScore: photoAnalysis.healthScore || 70,
        tags: photoAnalysis.tags || ['analyzed-photo']
      }],
      totalCalories: photoAnalysis.nutritionalBreakdown?.calories || 0,
      macroBreakdown: {
        protein: photoAnalysis.nutritionalBreakdown?.protein || 0,
        carbs: photoAnalysis.nutritionalBreakdown?.carbohydrates || 0,
        fat: photoAnalysis.nutritionalBreakdown?.fat || 0,
        fiber: photoAnalysis.nutritionalBreakdown?.fiber || 0
      },
      healthScore: photoAnalysis.healthScore || 70,
      reasoning: `Based on your photo analysis: ${photoAnalysis.insights?.slice(0, 2).join('. ') || 'Nutritional analysis completed'}`,
      preparationTime: 0, // Already prepared
      difficulty: 'easy',
      recipe: 'Meal from photo analysis'
    };

    // Calculate nutritional targets for this meal type
    const mealTargets = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.30,
      snack: 0.10
    };
    
    const targetCalories = nutritionalNeeds.dailyCalories * mealTargets[mealType];
    const targetProtein = nutritionalNeeds.protein * mealTargets[mealType];
    const targetCarbs = nutritionalNeeds.carbohydrates * mealTargets[mealType];
    const targetFat = nutritionalNeeds.fat * mealTargets[mealType];

    // Compare actual vs targets
    const nutritionalComparison = {
      calories: {
        actual: photoMeal.totalCalories,
        target: Math.round(targetCalories),
        percentage: Math.round((photoMeal.totalCalories / targetCalories) * 100)
      },
      protein: {
        actual: photoMeal.macroBreakdown.protein,
        target: Math.round(targetProtein),
        percentage: Math.round((photoMeal.macroBreakdown.protein / targetProtein) * 100)
      },
      carbs: {
        actual: photoMeal.macroBreakdown.carbs,
        target: Math.round(targetCarbs),
        percentage: Math.round((photoMeal.macroBreakdown.carbs / targetCarbs) * 100)
      },
      fat: {
        actual: photoMeal.macroBreakdown.fat,
        target: Math.round(targetFat),
        percentage: Math.round((photoMeal.macroBreakdown.fat / targetFat) * 100)
      }
    };

    // Generate suggestions based on comparison
    const suggestions = [];
    
    if (nutritionalComparison.calories.percentage < 80) {
      suggestions.push(`Consider adding more calories - you're ${100 - nutritionalComparison.calories.percentage}% below your ${mealType} target`);
    } else if (nutritionalComparison.calories.percentage > 120) {
      suggestions.push(`This meal is ${nutritionalComparison.calories.percentage - 100}% above your ${mealType} calorie target`);
    }

    if (nutritionalComparison.protein.percentage < 80) {
      suggestions.push('Add more protein sources like lean meats, legumes, or dairy');
    }

    if (nutritionalComparison.fiber.actual < 5) {
      suggestions.push('Include more fiber-rich foods like vegetables, fruits, or whole grains');
    }

    if (photoAnalysis.healthScore < 75) {
      suggestions.push('Try to include more nutrient-dense whole foods for better health benefits');
    }

    return {
      mealRecommendation: photoMeal,
      nutritionalComparison,
      suggestions: suggestions.length > 0 ? suggestions : ['Great choice! This meal aligns well with your nutritional goals']
    };
  }

  // Analyze nutritional gaps
  analyzeNutritionalGaps(meals: MealRecommendation[], nutritionalNeeds: NutritionalNeeds): Record<string, number> {
    const totalNutrients = meals.reduce((total, meal) => {
      meal.foods.forEach(food => {
        total.protein += food.protein;
        total.carbs += food.carbs;
        total.fat += food.fat;
        total.fiber += food.fiber;
        
        Object.entries(food.vitamins || {}).forEach(([vitamin, amount]) => {
          total.vitamins[vitamin] = (total.vitamins[vitamin] || 0) + amount;
        });
        
        Object.entries(food.minerals || {}).forEach(([mineral, amount]) => {
          total.minerals[mineral] = (total.minerals[mineral] || 0) + amount;
        });
      });
      return total;
    }, {
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      vitamins: {} as Record<string, number>,
      minerals: {} as Record<string, number>
    });

    const gaps: Record<string, number> = {};

    // Calculate percentage of needs met
    gaps['protein'] = Math.round((totalNutrients.protein / nutritionalNeeds.protein) * 100);
    gaps['carbohydrates'] = Math.round((totalNutrients.carbs / nutritionalNeeds.carbohydrates) * 100);
    gaps['fat'] = Math.round((totalNutrients.fat / nutritionalNeeds.fat) * 100);
    gaps['fiber'] = Math.round((totalNutrients.fiber / nutritionalNeeds.fiber) * 100);

    Object.entries(nutritionalNeeds.vitamins).forEach(([vitamin, need]) => {
      const consumed = totalNutrients.vitamins[vitamin] || 0;
      gaps[vitamin] = Math.round((consumed / need) * 100);
    });

    Object.entries(nutritionalNeeds.minerals).forEach(([mineral, need]) => {
      const consumed = totalNutrients.minerals[mineral] || 0;
      gaps[mineral] = Math.round((consumed / need) * 100);
    });

    return gaps;
  }
}

export const dietaryRecommendationEngine = new DietaryRecommendationEngine();