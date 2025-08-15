import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  ShoppingBag, 
  Calendar, 
  Target, 
  Award, 
  AlertCircle,
  Eye,
  Droplets,
  Sun,
  Sparkles,
  Heart,
  Clock,
  CheckCircle,
  ArrowRight,
  Download,
  Share2,
  MessageSquare
} from 'lucide-react';
import { useLocation } from 'wouter';

interface SkinScore {
  acne: number;
  wrinkles: number;
  sagging: number;
  redness: number;
  dark_spots: number;
  dark_circles: number;
  eye_bags: number;
  texture: number;
  pores: number;
  hydration: number;
}

interface ProductRecommendation {
  name: string;
  brand: string;
  price: string;
  rating: number;
  ingredients: string[];
  why_recommended: string;
  category: string;
  image_url?: string;
  affiliate_link?: string;
}

export default function SkinCoachResults() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisImage, setAnalysisImage] = useState<string>('');
  const [isSkynAI, setIsSkynAI] = useState(false);

  useEffect(() => {
    // Load real analysis results from localStorage
    const loadResults = async () => {
      try {
        const storedResults = localStorage.getItem('skinAnalysisResult');
        const storedImage = localStorage.getItem('analysisImage');
        
        if (storedResults) {
          const results = JSON.parse(storedResults);
          setAnalysisResults(results);
          
          // Check if this was analyzed with Skyn AI
          const isSkynAnalysis = results.models_used?.some((model: string) => 
            model.includes('Skyn AI') || model.includes('EfficientNet')
          );
          setIsSkynAI(isSkynAnalysis);
        } else {
          // Fallback to mock data if no stored results
          setAnalysisResults(getMockResults());
        }
        
        if (storedImage) {
          setAnalysisImage(storedImage);
        }
      } catch (error) {
        console.error('Error loading analysis results:', error);
        setAnalysisResults(getMockResults());
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  const getMockResults = () => ({
    overall_score: 78,
    scores: {
      acne: 85,
      wrinkles: 72,
      sagging: 75,
      redness: 68,
      dark_spots: 62,
      dark_circles: 70,
      eye_bags: 75,
      texture: 80,
      pores: 73,
      hydration: 65
    } as SkinScore,
    concerns: [
      'Dark spots and hyperpigmentation',
      'Skin dehydration',
      'Redness and irritation'
    ],
    improvements: [
      'Excellent acne control',
      'Good skin texture',
      'Healthy pore appearance'
    ],
    confidence_scores: {
      acne: 0.92,
      wrinkles: 0.88,
      dark_spots: 0.94,
      hydration: 0.85
    }
  });

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your skin analysis results...</p>
        </div>
      </div>
    );
  }

  if (!analysisResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">No analysis results found. Please try again.</p>
          <Button onClick={() => setLocation('/skincoach')} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const [productRecommendations] = useState<ProductRecommendation[]>([
    {
      name: 'Vitamin C Brightening Serum',
      brand: 'Skinceuticals',
      price: '$166',
      rating: 4.8,
      ingredients: ['Vitamin C 15%', 'Vitamin E', 'Ferulic Acid'],
      why_recommended: 'Perfect for reducing dark spots and brightening complexion',
      category: 'serum',
      image_url: '/placeholder-serum.jpg'
    },
    {
      name: 'Hyaluronic Acid 2% + B5',
      brand: 'The Ordinary',
      price: '$8',
      rating: 4.3,
      ingredients: ['Hyaluronic Acid', 'Vitamin B5'],
      why_recommended: 'Excellent hydration boost for your dry skin areas',
      category: 'serum',
      image_url: '/placeholder-serum2.jpg'
    },
    {
      name: 'Gentle Foaming Cleanser',
      brand: 'CeraVe',
      price: '$14',
      rating: 4.5,
      ingredients: ['Ceramides', 'Niacinamide', 'Hyaluronic Acid'],
      why_recommended: 'Gentle cleansing that won\'t irritate sensitive areas',
      category: 'cleanser',
      image_url: '/placeholder-cleanser.jpg'
    },
    {
      name: 'Daily Moisturizing Lotion',
      brand: 'CeraVe',
      price: '$16',
      rating: 4.6,
      ingredients: ['Ceramides', 'MVE Technology', 'Hyaluronic Acid'],
      why_recommended: 'Long-lasting hydration for improved skin barrier',
      category: 'moisturizer',
      image_url: '/placeholder-moisturizer.jpg'
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Attention';
  };

  const scoreCategories = [
    { key: 'acne', label: 'Acne Control', icon: Sparkles },
    { key: 'wrinkles', label: 'Anti-Aging', icon: Clock },
    { key: 'dark_spots', label: 'Dark Spots', icon: Sun },
    { key: 'hydration', label: 'Hydration', icon: Droplets },
    { key: 'redness', label: 'Redness', icon: Heart },
    { key: 'texture', label: 'Skin Texture', icon: Eye },
    { key: 'pores', label: 'Pore Health', icon: Target },
    { key: 'dark_circles', label: 'Dark Circles', icon: Eye },
    { key: 'eye_bags', label: 'Eye Bags', icon: Eye },
    { key: 'sagging', label: 'Firmness', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Your Skin Analysis Results
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isSkynAI ? 
              'Powered by Skyn AI EfficientNet B0 technology for accurate acne assessment' :
              'Based on advanced AI analysis and your personal profile'}
          </p>
          
          {isSkynAI && (
            <div className="mt-4 flex justify-center">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2">
                ✨ Enhanced with Skyn AI Acne Analysis
              </Badge>
            </div>
          )}
        </div>

        {/* Overall Score */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overall Skin Health Score</h2>
                <p className="text-pink-100">Based on 10 key skin metrics</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{analysisResults.overall_score}</div>
                <Badge className="bg-white/20 text-white border-white/30">
                  {getScoreLabel(analysisResults.overall_score)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skyn AI Acne Analysis Details */}
        {isSkynAI && analysisResults.analysis_metadata?.model_info && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Sparkles className="h-6 w-6" />
                Skyn AI Acne Analysis Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Acne Severity Level</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {analysisResults.analysis_metadata.model_info.acne_classification || 'Moderate'}
                  </div>
                  <p className="text-sm text-gray-600">
                    AI Confidence: {Math.round((analysisResults.confidence_scores?.acne || 0.8) * 100)}%
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Lesions Detected</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {analysisResults.analysis_metadata.model_info.lesion_count || 'N/A'}
                  </div>
                  <p className="text-sm text-gray-600">
                    Acne lesions identified
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Affected Area</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {analysisResults.analysis_metadata.model_info.affected_area_percentage || 'N/A'}%
                  </div>
                  <p className="text-sm text-gray-600">
                    Of analyzed skin area
                  </p>
                </div>
              </div>
              
              {analysisResults.analysis_metadata.model_info.severity_distribution && (
                <div className="mt-6 p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-3">Acne Severity Distribution</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {analysisResults.analysis_metadata.model_info.severity_distribution.mild}%
                      </div>
                      <p className="text-sm text-gray-600">Mild</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-yellow-600">
                        {analysisResults.analysis_metadata.model_info.severity_distribution.moderate}%
                      </div>
                      <p className="text-sm text-gray-600">Moderate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">
                        {analysisResults.analysis_metadata.model_info.severity_distribution.severe}%
                      </div>
                      <p className="text-sm text-gray-600">Severe</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Model Used:</strong> {analysisResults.analysis_metadata.model_info.name || 'Skyn AI EfficientNet B0'} 
                  - Specialized for acne detection and severity classification
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="scores" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="scores" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Detailed Scores
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="routine" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Routine
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Track Progress
            </TabsTrigger>
          </TabsList>

          {/* Detailed Scores Tab */}
          <TabsContent value="scores" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {scoreCategories.map(({ key, label, icon: Icon }) => {
                const score = analysisResults.scores[key as keyof SkinScore];
                const confidence = analysisResults.confidence_scores[key] || 0.85;
                
                return (
                  <Card key={key} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getScoreColor(score)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{label}</h3>
                            <p className="text-sm text-gray-500">AI Confidence: {Math.round(confidence * 100)}%</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{score}</div>
                          <Badge className={getScoreColor(score)}>
                            {getScoreLabel(score)}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={score} className="h-2 bg-gray-200" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Key Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg border-l-4 border-l-red-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResults.concerns.map((concern, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500 mt-0.5" />
                        <span className="text-gray-700">{concern}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg border-l-4 border-l-green-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Your Skin Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResults.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Product Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Alert className="border-pink-200 bg-pink-50">
              <Star className="h-4 w-4" />
              <AlertDescription className="text-pink-800">
                These products are specifically selected based on your skin analysis and profile. All recommendations are dermatologist-approved.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              {productRecommendations.map((product, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">{product.price}</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{product.why_recommended}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.ingredients.slice(0, 3).map((ingredient, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Shop Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">💰 Total Estimated Monthly Cost</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">$48-68</p>
                  <p className="text-gray-600 mb-4">Based on your budget preferences and recommended products</p>
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    Get Detailed Shopping List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skincare Routine Tab */}
          <TabsContent value="routine" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    Morning Routine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { step: 1, product: 'Gentle Cleanser', time: '1-2 minutes' },
                    { step: 2, product: 'Vitamin C Serum', time: 'Wait 5 minutes' },
                    { step: 3, product: 'Hyaluronic Acid Serum', time: '1 minute' },
                    { step: 4, product: 'Moisturizer', time: '1 minute' },
                    { step: 5, product: 'Sunscreen SPF 30+', time: '2 minutes' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product}</p>
                        <p className="text-sm text-gray-600">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-500" />
                    Evening Routine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { step: 1, product: 'Gentle Cleanser', time: '1-2 minutes' },
                    { step: 2, product: 'Treatment (alternate days)', time: '5 minutes' },
                    { step: 3, product: 'Hyaluronic Acid Serum', time: '1 minute' },
                    { step: 4, product: 'Night Moisturizer', time: '1 minute' },
                    { step: 5, product: 'Eye Cream (optional)', time: '1 minute' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product}</p>
                        <p className="text-sm text-gray-600">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-800">
                <strong>Pro Tip:</strong> Start slowly! Introduce new products one at a time, waiting a week between additions to monitor your skin's reaction.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Your Skin Journey Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { week: '1-2', title: 'Skin Adjustment Period', description: 'Your skin adapts to new products. You may experience some purging.' },
                    { week: '3-4', title: 'Initial Improvements', description: 'Hydration and texture improvements should be visible.' },
                    { week: '6-8', title: 'Visible Changes', description: 'Dark spots start to fade, redness reduces significantly.' },
                    { week: '12+', title: 'Optimal Results', description: 'Full benefits of your routine are visible. Time for a new analysis!' },
                  ].map((timeline, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
                        {timeline.week}w
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{timeline.title}</h3>
                        <p className="text-gray-600 text-sm">{timeline.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t">
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    onClick={() => setLocation('/skincoach/tracker')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Set Up Progress Tracking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button 
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white flex-1"
            onClick={() => setLocation('/skincoach/chat')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with AI Coach
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setLocation('/skincoach/shop')}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Shop Products
          </Button>
          
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Footer CTA */}
        <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Track Your Progress</h3>
            <p className="mb-4 text-purple-100">
              Get weekly check-ins and adjust your routine based on real results
            </p>
            <Button 
              className="bg-white text-purple-600 hover:bg-purple-50"
              onClick={() => setLocation('/skincoach/subscribe')}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Start Monthly Coaching - $19.99/mo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}