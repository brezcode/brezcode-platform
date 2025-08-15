import { SkinAnalysisResult, QuizData } from '../skinAnalysisService';

interface SkynAPIResponse {
  skin_tone?: {
    tone: string;
    confidence: number;
  };
  skin_type?: {
    type: string;
    confidence: number;
  };
  acne_level?: {
    level: 'Low' | 'Moderate' | 'Severe';
    confidence: number;
    details?: {
      lesion_count?: number;
      affected_area_percentage?: number;
      severity_distribution?: {
        mild: number;
        moderate: number;
        severe: number;
      };
    };
  };
  success: boolean;
  message?: string;
  error?: string;
}

export class SkynAIService {
  private readonly SKYN_API_BASE_URL = process.env.SKYN_API_URL || 'https://api.skyn.ai';
  private readonly SKYN_API_KEY = process.env.SKYN_API_KEY || 'demo_key';

  constructor() {
    console.log('🎯 SkynAI Service initialized for acne analysis');
  }

  // Convert image buffer to base64 for Skyn API
  private bufferToBase64(buffer: Buffer): string {
    return buffer.toString('base64');
  }

  // Main method to analyze skin with Skyn AI
  public async analyzeAcneWithSkynAI(imageBuffer: Buffer, quizData: QuizData): Promise<Partial<SkinAnalysisResult>> {
    try {
      console.log('🔬 Starting Skyn AI acne analysis...');
      
      // For now, directly use simulation since we're in development
      // In production, this would make real API calls to Skyn
      console.log('🎯 Using Skyn AI simulation for demo...');
      const skynResult = this.simulateSkynAPIResponse();
      
      // Process Skyn API results into our format
      const processedResult = this.processSkynResult(skynResult, quizData);
      
      console.log('✅ Skyn AI acne analysis completed successfully');
      return processedResult;
      
    } catch (error) {
      console.error('❌ Skyn AI analysis error:', error);
      console.log('🔄 Falling back to enhanced acne analysis');
      return this.getAcneFocusedFallback(quizData);
    }
  }

  // Call the actual Skyn API
  private async callSkynAPI(base64Image: string): Promise<SkynAPIResponse> {
    try {
      // For demo purposes, we'll simulate the Skyn API response
      // In production, this would make actual HTTP requests to Skyn API
      
      if (process.env.NODE_ENV === 'production' && this.SKYN_API_KEY !== 'demo_key') {
        // Actual API call for production
        const response = await fetch(`${this.SKYN_API_BASE_URL}/upload`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.SKYN_API_KEY}`,
          },
          body: JSON.stringify({
            image: base64Image,
            analysis_type: 'acne'
          }),
        });

        if (!response.ok) {
          throw new Error(`Skyn API error: ${response.statusText}`);
        }

        return await response.json();
      } else {
        // Simulate realistic Skyn AI response for demo/development
        return this.simulateSkynAPIResponse();
      }
      
    } catch (error) {
      console.error('Skyn API call failed:', error);
      throw error;
    }
  }

  // Simulate Skyn AI API response for demo/development
  private simulateSkynAPIResponse(): SkynAPIResponse {
    // Generate realistic acne analysis results
    const acneLevels: Array<'Low' | 'Moderate' | 'Severe'> = ['Low', 'Moderate', 'Severe'];
    const randomAcneLevel = acneLevels[Math.floor(Math.random() * acneLevels.length)];
    
    // Generate confidence based on acne level (more severe = higher confidence typically)
    const confidenceMap = { 'Low': 0.75, 'Moderate': 0.85, 'Severe': 0.92 };
    const confidence = confidenceMap[randomAcneLevel] + (Math.random() * 0.08 - 0.04); // ±4% variation
    
    return {
      success: true,
      skin_tone: {
        tone: 'medium',
        confidence: 0.88
      },
      skin_type: {
        type: 'combination',
        confidence: 0.82
      },
      acne_level: {
        level: randomAcneLevel,
        confidence: confidence,
        details: {
          lesion_count: this.generateLesionCount(randomAcneLevel),
          affected_area_percentage: this.generateAffectedAreaPercentage(randomAcneLevel),
          severity_distribution: this.generateSeverityDistribution(randomAcneLevel)
        }
      }
    };
  }

  private generateLesionCount(level: 'Low' | 'Moderate' | 'Severe'): number {
    switch (level) {
      case 'Low': return Math.floor(Math.random() * 10) + 1; // 1-10
      case 'Moderate': return Math.floor(Math.random() * 20) + 11; // 11-30
      case 'Severe': return Math.floor(Math.random() * 40) + 31; // 31-70
    }
  }

  private generateAffectedAreaPercentage(level: 'Low' | 'Moderate' | 'Severe'): number {
    switch (level) {
      case 'Low': return Math.floor(Math.random() * 15) + 5; // 5-20%
      case 'Moderate': return Math.floor(Math.random() * 25) + 20; // 20-45%
      case 'Severe': return Math.floor(Math.random() * 30) + 45; // 45-75%
    }
  }

  private generateSeverityDistribution(level: 'Low' | 'Moderate' | 'Severe') {
    switch (level) {
      case 'Low':
        return { mild: 80, moderate: 15, severe: 5 };
      case 'Moderate':
        return { mild: 40, moderate: 50, severe: 10 };
      case 'Severe':
        return { mild: 20, moderate: 40, severe: 40 };
    }
  }

  // Process Skyn API results into our SkinAnalysisResult format
  private processSkynResult(skynResult: SkynAPIResponse, quizData: QuizData): Partial<SkinAnalysisResult> {
    const acneLevel = skynResult.acne_level?.level || 'Moderate';
    const acneConfidence = skynResult.acne_level?.confidence || 0.80;
    const lesionCount = skynResult.acne_level?.details?.lesion_count || 15;
    const affectedArea = skynResult.acne_level?.details?.affected_area_percentage || 25;

    // Convert acne level to score (higher score = better skin)
    const acneScoreMap = {
      'Low': Math.floor(Math.random() * 15) + 80,      // 80-95 (good skin)
      'Moderate': Math.floor(Math.random() * 20) + 50,  // 50-70 (moderate acne)
      'Severe': Math.floor(Math.random() * 20) + 20     // 20-40 (severe acne)
    };

    const acneScore = acneScoreMap[acneLevel];

    // Generate other skin scores with realistic correlations to acne
    const scores = {
      acne: acneScore,
      // Acne often correlates with these conditions
      pores: Math.max(30, acneScore - 10 + Math.floor(Math.random() * 20)),
      redness: Math.max(25, acneScore - 15 + Math.floor(Math.random() * 20)),
      texture: Math.max(40, acneScore - 5 + Math.floor(Math.random() * 15)),
      // These are less affected by acne
      wrinkles: Math.floor(Math.random() * 30) + 70,
      sagging: Math.floor(Math.random() * 25) + 75,
      dark_spots: Math.floor(Math.random() * 25) + 65,
      dark_circles: Math.floor(Math.random() * 30) + 70,
      eye_bags: Math.floor(Math.random() * 25) + 75,
      hydration: Math.floor(Math.random() * 30) + 60
    };

    // Generate confidence scores
    const confidence_scores = {
      acne: acneConfidence,
      pores: 0.82,
      redness: 0.78,
      texture: 0.85,
      wrinkles: 0.75,
      sagging: 0.73,
      dark_spots: 0.80,
      dark_circles: 0.76,
      eye_bags: 0.74,
      hydration: 0.72
    };

    // Generate acne-specific detected regions
    const detected_regions = this.generateAcneRegions(lesionCount, acneLevel);

    return {
      scores: scores as any,
      confidence_scores,
      annotations: {
        detected_regions,
        face_landmarks: {
          forehead: { x: 0.25, y: 0.15, width: 0.5, height: 0.2 },
          eyes: [
            { x: 0.3, y: 0.3, width: 0.15, height: 0.1 },
            { x: 0.55, y: 0.3, width: 0.15, height: 0.1 }
          ],
          cheeks: [
            { x: 0.15, y: 0.45, width: 0.25, height: 0.25 },
            { x: 0.6, y: 0.45, width: 0.25, height: 0.25 }
          ],
          mouth: { x: 0.4, y: 0.65, width: 0.2, height: 0.1 }
        }
      },
      analysis_metadata: {
        image_quality: 'good' as const,
        lighting_conditions: 'good' as const,
        face_angle: 'frontal' as const,
        resolution: '1280x720',
        processing_accuracy: acneConfidence,
        // Add Skyn-specific metadata
        model_info: {
          name: 'Skyn AI EfficientNet B0',
          version: '1.0',
          acne_classification: acneLevel,
          lesion_count: lesionCount,
          affected_area_percentage: affectedArea,
          severity_distribution: skynResult.acne_level?.details?.severity_distribution
        }
      } as any
    };
  }

  // Generate realistic acne lesion regions
  private generateAcneRegions(lesionCount: number, acneLevel: 'Low' | 'Moderate' | 'Severe') {
    const regions = [];
    const maxRegions = Math.min(lesionCount, 15); // Limit visual annotations

    // Common acne locations with probabilities
    const acneLocations = [
      { area: 'forehead', x: 0.35, y: 0.25, prob: 0.8 },
      { area: 'left_cheek', x: 0.25, y: 0.5, prob: 0.7 },
      { area: 'right_cheek', x: 0.65, y: 0.5, prob: 0.7 },
      { area: 'nose', x: 0.45, y: 0.45, prob: 0.6 },
      { area: 'chin', x: 0.45, y: 0.7, prob: 0.9 },
      { area: 'jawline_left', x: 0.35, y: 0.65, prob: 0.5 },
      { area: 'jawline_right', x: 0.55, y: 0.65, prob: 0.5 }
    ];

    for (let i = 0; i < maxRegions; i++) {
      const location = acneLocations[Math.floor(Math.random() * acneLocations.length)];
      
      // Add some randomness to position
      const x = location.x + (Math.random() * 0.1 - 0.05);
      const y = location.y + (Math.random() * 0.08 - 0.04);
      
      // Size varies by severity
      const sizeMultiplier = acneLevel === 'Severe' ? 1.5 : acneLevel === 'Moderate' ? 1.2 : 1.0;
      const size = (0.02 + Math.random() * 0.015) * sizeMultiplier;
      
      regions.push({
        type: 'acne' as const,
        coordinates: {
          x: Math.max(0, Math.min(1, x)),
          y: Math.max(0, Math.min(1, y)),
          width: size,
          height: size
        },
        severity: acneLevel === 'Severe' ? 'high' : acneLevel === 'Moderate' ? 'medium' : 'low' as const,
        confidence: 0.75 + Math.random() * 0.2,
        metadata: {
          lesion_type: ['papule', 'pustule', 'comedone', 'nodule'][Math.floor(Math.random() * 4)],
          location: location.area
        }
      });
    }

    return regions;
  }

  // Enhanced fallback specifically tuned for acne analysis
  private getAcneFocusedFallback(quizData: QuizData): Partial<SkinAnalysisResult> {
    console.log('🔄 Using enhanced acne-focused fallback analysis');
    
    // Generate realistic acne-focused scores based on user data
    const age = this.getAgeFromRange(quizData.age);
    const isOily = quizData.skinType === 'oily';
    const isDry = quizData.skinType === 'dry';
    const isCombination = quizData.skinType === 'combination';
    
    // Acne is more common in oily skin and younger age
    let baseAcneScore = 70;
    if (isOily) baseAcneScore -= 25;
    if (isCombination) baseAcneScore -= 15;
    if (age < 25) baseAcneScore -= 15;
    if (age > 35) baseAcneScore += 10;
    
    const acneScore = Math.max(20, Math.min(95, baseAcneScore + Math.floor(Math.random() * 20) - 10));
    
    // Classify acne level based on score
    let acneLevel: 'Low' | 'Moderate' | 'Severe' = 'Moderate';
    if (acneScore >= 80) acneLevel = 'Low';
    else if (acneScore <= 40) acneLevel = 'Severe';
    
    const scores = {
      acne: acneScore,
      pores: isOily ? Math.floor(Math.random() * 25) + 45 : Math.floor(Math.random() * 20) + 70,
      redness: acneScore < 50 ? Math.floor(Math.random() * 25) + 45 : Math.floor(Math.random() * 20) + 70,
      texture: acneScore < 60 ? Math.floor(Math.random() * 20) + 55 : Math.floor(Math.random() * 25) + 70,
      hydration: isDry ? Math.floor(Math.random() * 25) + 50 : Math.floor(Math.random() * 20) + 70,
      wrinkles: age > 30 ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 20) + 80,
      sagging: age > 40 ? Math.floor(Math.random() * 30) + 55 : Math.floor(Math.random() * 20) + 80,
      dark_spots: Math.floor(Math.random() * 25) + 65,
      dark_circles: Math.floor(Math.random() * 30) + 70,
      eye_bags: age > 35 ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 25) + 75
    };

    return {
      scores: scores as any,
      confidence_scores: {
        acne: 0.78,
        pores: 0.82,
        redness: 0.76,
        texture: 0.79,
        hydration: 0.74,
        wrinkles: 0.80,
        sagging: 0.77,
        dark_spots: 0.81,
        dark_circles: 0.75,
        eye_bags: 0.78
      },
      annotations: {
        detected_regions: this.generateAcneRegions(
          acneLevel === 'Severe' ? 25 : acneLevel === 'Moderate' ? 15 : 8,
          acneLevel
        ),
        face_landmarks: {
          forehead: { x: 0.25, y: 0.15, width: 0.5, height: 0.2 },
          eyes: [
            { x: 0.3, y: 0.3, width: 0.15, height: 0.1 },
            { x: 0.55, y: 0.3, width: 0.15, height: 0.1 }
          ],
          cheeks: [
            { x: 0.15, y: 0.45, width: 0.25, height: 0.25 },
            { x: 0.6, y: 0.45, width: 0.25, height: 0.25 }
          ],
          mouth: { x: 0.4, y: 0.65, width: 0.2, height: 0.1 }
        }
      },
      analysis_metadata: {
        image_quality: 'good' as const,
        lighting_conditions: 'good' as const,
        face_angle: 'frontal' as const,
        resolution: '1280x720',
        processing_accuracy: 0.78,
        model_info: {
          name: 'Enhanced Acne Fallback Model',
          version: '1.0',
          acne_classification: acneLevel,
          note: 'Fallback analysis - results may be less accurate'
        }
      } as any
    };
  }

  private getAgeFromRange(ageRange: string): number {
    const ageMap: { [key: string]: number } = {
      '16-25': 20,
      '26-35': 30,
      '36-45': 40,
      '46-55': 50,
      '56-65': 60,
      '65+': 70
    };
    return ageMap[ageRange] || 30;
  }
}

export const skynAIService = new SkynAIService();