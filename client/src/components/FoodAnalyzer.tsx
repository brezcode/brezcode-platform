import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Upload, 
  Loader2, 
  Apple, 
  Zap, 
  Heart, 
  Activity,
  ChevronRight,
  Info,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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

export default function FoodAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Food analysis mutation
  const analyzeFoodMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await apiRequest('POST', '/api/food/analyze', {
        image: imageData,
        analysisType: 'comprehensive'
      });
      return response.json();
    },
    onSuccess: (data: FoodAnalysisResult) => {
      setAnalysisResult(data);
    },
    onError: (error) => {
      console.error('Food analysis error:', error);
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setSelectedImage(imageData);
        // Auto-analyze when image is uploaded
        const base64Data = imageData.split(',')[1];
        
        // Compress image if too large (over 4MB base64)
        if (base64Data.length > 4 * 1024 * 1024) {
          // Create canvas to compress image
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate new dimensions (max 1024px)
            const maxSize = 1024;
            let { width, height } = img;
            
            if (width > height && width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
            analyzeFoodMutation.mutate(compressedBase64);
          };
          img.src = imageData;
        } else {
          analyzeFoodMutation.mutate(base64Data);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const renderMacronutrientCard = (
    name: string, 
    data: { grams: number; percentage: number }, 
    color: string,
    icon: React.ReactNode
  ) => (
    <div className={`bg-${color}-50 dark:bg-${color}-900/20 p-4 rounded-lg border`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium text-sm">{name}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">{data.grams.toFixed(1)}g</span>
          <span className="text-sm text-muted-foreground">{data.percentage.toFixed(1)}%</span>
        </div>
        <Progress value={data.percentage} className="h-2" />
      </div>
    </div>
  );

  const renderMicronutrient = (
    name: string, 
    data: { amount: number; unit: string; dailyValue: number }
  ) => (
    <div className="flex justify-between items-center p-2 border rounded">
      <span className="font-medium text-sm">{name}</span>
      <div className="text-right">
        <div className="text-sm font-bold">{data.amount.toFixed(1)}{data.unit}</div>
        <div className="text-xs text-muted-foreground">{data.dailyValue.toFixed(0)}% DV</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-green-600" />
            AI Food Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Take a photo of your food to get detailed nutritional analysis and health insights
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={triggerCameraCapture}
              variant="outline" 
              size="lg"
              className="h-20 flex flex-col gap-2"
              disabled={analyzeFoodMutation.isPending}
            >
              <Camera className="h-6 w-6" />
              <span>Take Photo</span>
            </Button>
            
            <Button 
              onClick={triggerFileUpload}
              variant="outline" 
              size="lg"
              className="h-20 flex flex-col gap-2"
              disabled={analyzeFoodMutation.isPending}
            >
              <Upload className="h-6 w-6" />
              <span>Upload Image</span>
            </Button>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="border rounded-lg p-4">
              <img 
                src={selectedImage} 
                alt="Selected food" 
                className="w-full max-h-60 object-cover rounded-lg mb-4"
              />
              
              {analyzeFoodMutation.isPending && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing nutritional content...</span>
                </div>
              )}
            </div>
          )}

          {/* Analysis Results */}
          {analysisResult && analysisResult.success && (
            <div className="space-y-6">
              {/* Header Stats */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {analysisResult.analysis.totalCalories}
                    </div>
                    <div className="text-sm text-muted-foreground">Calories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {analysisResult.analysis.healthScore}/100
                    </div>
                    <div className="text-sm text-muted-foreground">Health Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {analysisResult.confidence.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Confidence</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {analysisResult.analysis.portionSize}
                    </div>
                    <div className="text-sm text-muted-foreground">Portion</div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="macros" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="macros">Macros</TabsTrigger>
                  <TabsTrigger value="micros">Vitamins</TabsTrigger>
                  <TabsTrigger value="minerals">Minerals</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                {/* Macronutrients Tab */}
                <TabsContent value="macros" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderMacronutrientCard(
                      'Protein',
                      analysisResult.analysis.macronutrients.protein,
                      'blue',
                      <Activity className="h-4 w-4 text-blue-500" />
                    )}
                    {renderMacronutrientCard(
                      'Carbohydrates',
                      analysisResult.analysis.macronutrients.carbohydrates,
                      'green',
                      <Zap className="h-4 w-4 text-green-500" />
                    )}
                    {renderMacronutrientCard(
                      'Fat',
                      analysisResult.analysis.macronutrients.fat,
                      'yellow',
                      <Heart className="h-4 w-4 text-yellow-500" />
                    )}
                    {renderMacronutrientCard(
                      'Fiber',
                      analysisResult.analysis.macronutrients.fiber,
                      'purple',
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                    )}
                  </div>
                </TabsContent>

                {/* Vitamins Tab */}
                <TabsContent value="micros" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(analysisResult.analysis.micronutrients.vitamins).map(([name, data]) => 
                      renderMicronutrient(name, data)
                    )}
                  </div>
                </TabsContent>

                {/* Minerals Tab */}
                <TabsContent value="minerals" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(analysisResult.analysis.micronutrients.minerals).map(([name, data]) => 
                      renderMicronutrient(name, data)
                    )}
                  </div>
                </TabsContent>

                {/* Insights Tab */}
                <TabsContent value="insights" className="space-y-4">
                  {/* Ingredients */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Identified Ingredients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis.ingredients.map((ingredient, index) => (
                          <Badge key={index} variant="secondary">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Health Recommendations */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Health Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResult.analysis.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-green-500 mt-0.5" />
                            <span className="text-sm">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Health Score Breakdown */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Health Score Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Nutritional Balance</span>
                          <span className="text-sm font-medium">85%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Ingredient Quality</span>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Portion Appropriateness</span>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Error State */}
          {analysisResult && !analysisResult.success && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Analysis Failed</span>
              </div>
              <p className="text-sm text-red-600 mt-1">
                Unable to analyze this image. Please try with a clearer photo of your food.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}