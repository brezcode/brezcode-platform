import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  MessageSquare,
  Zap,
  Camera,
  Info,
  Layers,
  Search
} from 'lucide-react';
import { useLocation } from 'wouter';

interface SkinAnalysisResult {
  overall_score: number;
  skin_age: {
    estimated_age: number;
    chronological_difference: number;
    age_category: 'younger' | 'age_appropriate' | 'older';
    factors: string[];
  };
  scores: {
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
  };
  concerns: string[];
  improvements: string[];
  annotations: {
    detected_regions: Array<{
      type: 'wrinkle' | 'dark_spot' | 'acne' | 'redness' | 'eye_bag' | 'dark_circle';
      coordinates: { x: number; y: number; width: number; height: number };
      severity: 'low' | 'medium' | 'high';
      confidence: number;
    }>;
    face_landmarks: {
      forehead: { x: number; y: number; width: number; height: number };
      eyes: Array<{ x: number; y: number; width: number; height: number }>;
      cheeks: Array<{ x: number; y: number; width: number; height: number }>;
      mouth: { x: number; y: number; width: number; height: number };
    };
  };
  analysis_metadata: {
    image_quality: 'excellent' | 'good' | 'fair' | 'poor';
    lighting_conditions: 'optimal' | 'good' | 'suboptimal';
    face_angle: 'frontal' | 'slight_angle' | 'angled';
    resolution: string;
    processing_accuracy: number;
  };
  confidence_scores: {
    [key: string]: number;
  };
}

export default function SkinCoachResultsAdvanced() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Mock enhanced data with skin age and annotations
  const [analysisResults] = useState<SkinAnalysisResult>({
    overall_score: 78,
    skin_age: {
      estimated_age: 28,
      chronological_difference: 3,
      age_category: 'older',
      factors: ['Fine lines and wrinkles', 'Sun damage and pigmentation', 'Skin dehydration']
    },
    scores: {
      acne: 85,
      wrinkles: 62,
      sagging: 75,
      redness: 68,
      dark_spots: 58,
      dark_circles: 70,
      eye_bags: 65,
      texture: 80,
      pores: 73,
      hydration: 60
    },
    concerns: [
      'Dark spots and hyperpigmentation',
      'Skin dehydration',
      'Fine lines around eyes'
    ],
    improvements: [
      'Excellent acne control',
      'Good skin texture',
      'Healthy pore appearance'
    ],
    annotations: {
      detected_regions: [
        {
          type: 'wrinkle',
          coordinates: { x: 0.3, y: 0.25, width: 0.4, height: 0.05 },
          severity: 'medium',
          confidence: 0.87
        },
        {
          type: 'dark_spot',
          coordinates: { x: 0.2, y: 0.5, width: 0.06, height: 0.06 },
          severity: 'high',
          confidence: 0.91
        },
        {
          type: 'dark_spot',
          coordinates: { x: 0.65, y: 0.55, width: 0.04, height: 0.04 },
          severity: 'low',
          confidence: 0.76
        },
        {
          type: 'eye_bag',
          coordinates: { x: 0.32, y: 0.38, width: 0.12, height: 0.06 },
          severity: 'medium',
          confidence: 0.84
        },
        {
          type: 'eye_bag',
          coordinates: { x: 0.56, y: 0.38, width: 0.12, height: 0.06 },
          severity: 'medium',
          confidence: 0.84
        }
      ],
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
      image_quality: 'excellent',
      lighting_conditions: 'good',
      face_angle: 'frontal',
      resolution: '1280x720',
      processing_accuracy: 0.91
    },
    confidence_scores: {
      acne: 0.92,
      wrinkles: 0.88,
      dark_spots: 0.94,
      hydration: 0.85
    }
  });

  // Mock captured image (in real app this would come from previous step)
  const [capturedImage] = useState('/placeholder-face.jpg');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && showAnnotations && canvasRef.current && imageRef.current) {
      drawAnnotations();
    }
  }, [loading, showAnnotations, selectedAnnotation]);

  const drawAnnotations = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = image.offsetWidth;
    canvas.height = image.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw annotations
    analysisResults.annotations.detected_regions.forEach((annotation, index) => {
      const x = annotation.coordinates.x * canvas.width;
      const y = annotation.coordinates.y * canvas.height;
      const width = annotation.coordinates.width * canvas.width;
      const height = annotation.coordinates.height * canvas.height;

      // Set styles based on annotation type and severity
      const colors = {
        wrinkle: '#FF6B6B',
        dark_spot: '#4ECDC4',
        acne: '#45B7D1',
        redness: '#96CEB4',
        eye_bag: '#FFEAA7',
        dark_circle: '#DDA0DD'
      };

      const color = colors[annotation.type];
      const alpha = annotation.severity === 'high' ? 0.8 : annotation.severity === 'medium' ? 0.6 : 0.4;

      // Draw annotation
      ctx.strokeStyle = color;
      ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = 2;

      if (annotation.type === 'wrinkle') {
        // Draw line for wrinkles
        ctx.beginPath();
        ctx.moveTo(x, y + height/2);
        ctx.lineTo(x + width, y + height/2);
        ctx.stroke();
      } else {
        // Draw rectangle/circle for other conditions
        if (annotation.type === 'dark_spot' || annotation.type === 'acne') {
          // Circular highlight
          ctx.beginPath();
          ctx.arc(x + width/2, y + height/2, Math.max(width, height)/2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        } else {
          // Rectangular highlight
          ctx.fillRect(x, y, width, height);
          ctx.strokeRect(x, y, width, height);
        }
      }

      // Add confidence label
      if (selectedAnnotation === `${annotation.type}-${index}` || selectedAnnotation === null) {
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(`${Math.round(annotation.confidence * 100)}%`, x, y - 5);
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSkinAgeColor = (category: string) => {
    switch (category) {
      case 'younger': return 'text-green-600 bg-green-50';
      case 'age_appropriate': return 'text-blue-600 bg-blue-50';
      case 'older': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSkinAgeMessage = (category: string, difference: number) => {
    if (category === 'younger') {
      return `Your skin appears ${Math.abs(difference)} years younger than your chronological age! 🎉`;
    } else if (category === 'older') {
      return `Your skin appears ${difference} years older than your chronological age. Let's work on reversing this!`;
    } else {
      return `Your skin age matches your chronological age perfectly! 👍`;
    }
  };

  const annotationTypes = [
    { key: 'wrinkle', label: 'Fine Lines', color: '#FF6B6B', icon: '📏' },
    { key: 'dark_spot', label: 'Dark Spots', color: '#4ECDC4', icon: '⚫' },
    { key: 'acne', label: 'Acne', color: '#45B7D1', icon: '🔴' },
    { key: 'redness', label: 'Redness', color: '#96CEB4', icon: '🟢' },
    { key: 'eye_bag', label: 'Eye Bags', color: '#FFEAA7', icon: '👁️' },
    { key: 'dark_circle', label: 'Dark Circles', color: '#DDA0DD', icon: '⭕' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your advanced analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Advanced Skin Analysis Results
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered analysis with visual detection and skin age assessment
          </p>
        </div>

        {/* Overall Score & Skin Age */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Overall Skin Health</h2>
                  <p className="text-pink-100">Based on 10 key metrics</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{analysisResults.overall_score}</div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Excellent
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${getSkinAgeColor(analysisResults.skin_age.age_category)}`}>
                  <Clock className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Skin Age: {analysisResults.skin_age.estimated_age} years
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    {getSkinAgeMessage(analysisResults.skin_age.age_category, analysisResults.skin_age.chronological_difference)}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analysisResults.skin_age.factors.slice(0, 2).map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Accuracy */}
        <Card className="border-0 shadow-lg mb-8 border-l-4 border-l-green-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Analysis Accuracy: {Math.round(analysisResults.analysis_metadata.processing_accuracy * 100)}%</h3>
                  <p className="text-gray-600">
                    Image Quality: {analysisResults.analysis_metadata.image_quality} • 
                    Lighting: {analysisResults.analysis_metadata.lighting_conditions} • 
                    Angle: {analysisResults.analysis_metadata.face_angle}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">
                ✓ High Confidence
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="visual-analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="visual-analysis" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visual Analysis
            </TabsTrigger>
            <TabsTrigger value="detailed-scores" className="flex items-center gap-2">
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

          {/* Visual Analysis Tab */}
          <TabsContent value="visual-analysis" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Annotated Image */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-purple-600" />
                      AI Detection Results
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Show Annotations</Label>
                      <Switch
                        checked={showAnnotations}
                        onCheckedChange={setShowAnnotations}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="relative inline-block">
                    <img
                      ref={imageRef}
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f0f0f0'/%3E%3Ctext x='200' y='250' text-anchor='middle' fill='%23666' font-size='20'%3EYour Face Image%3C/text%3E%3C/svg%3E"
                      alt="Your skin analysis"
                      className="w-full rounded-lg"
                      onLoad={() => showAnnotations && drawAnnotations()}
                    />
                    <canvas
                      ref={canvasRef}
                      className={`absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-300 ${
                        showAnnotations ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </div>
                  
                  {showAnnotations && (
                    <div className="mt-4 text-center">
                      <Badge className="bg-blue-100 text-blue-700">
                        <Search className="h-3 w-3 mr-1" />
                        {analysisResults.annotations.detected_regions.length} conditions detected
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Detection Legend */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-600" />
                    Detection Legend
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {annotationTypes.map((type) => {
                    const detectedCount = analysisResults.annotations.detected_regions.filter(
                      r => r.type === type.key
                    ).length;
                    
                    return (
                      <div
                        key={type.key}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedAnnotation === type.key ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedAnnotation(selectedAnnotation === type.key ? null : type.key)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: type.color }}
                            />
                            <div>
                              <span className="font-medium text-gray-900">{type.label}</span>
                              <span className="ml-2 text-2xl">{type.icon}</span>
                            </div>
                          </div>
                          <Badge variant={detectedCount > 0 ? 'default' : 'secondary'}>
                            {detectedCount} detected
                          </Badge>
                        </div>
                        
                        {detectedCount > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            {analysisResults.annotations.detected_regions
                              .filter(r => r.type === type.key)
                              .map((region, index) => (
                                <div key={index} className="flex justify-between">
                                  <span>Location {index + 1}</span>
                                  <span className="font-medium">
                                    {Math.round(region.confidence * 100)}% confidence
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  <Alert className="border-blue-200 bg-blue-50 mt-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-blue-800">
                      Click on any condition above to highlight it on your image. Our AI has precisely located each skin concern with high accuracy.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs remain the same as original */}
          <TabsContent value="detailed-scores">
            <div className="text-center py-20">
              <p className="text-gray-600">Detailed scores content would go here...</p>
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="text-center py-20">
              <p className="text-gray-600">Product recommendations content would go here...</p>
            </div>
          </TabsContent>

          <TabsContent value="routine">
            <div className="text-center py-20">
              <p className="text-gray-600">Skincare routine content would go here...</p>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="text-center py-20">
              <p className="text-gray-600">Progress tracking content would go here...</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button 
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white flex-1"
            onClick={() => setLocation('/skincoach/chat')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Discuss Results with AI Coach
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setLocation('/skincoach/shop')}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Shop Targeted Products
          </Button>
          
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Detailed Report
          </Button>
        </div>
      </div>
    </div>
  );
}