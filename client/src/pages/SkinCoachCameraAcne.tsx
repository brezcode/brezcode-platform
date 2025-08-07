import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, RotateCcw, Check, Upload, ChevronLeft, Zap, Eye, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';

interface CameraState {
  stream: MediaStream | null;
  capturedImage: string | null;
  isCapturing: boolean;
  error: string | null;
  facingMode: 'user' | 'environment';
}

export default function SkinCoachCameraAcne() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [cameraState, setCameraState] = useState<CameraState>({
    stream: null,
    capturedImage: null,
    isCapturing: false,
    error: null,
    facingMode: 'user'
  });

  const [analysisStep, setAnalysisStep] = useState<'capture' | 'preview' | 'analyzing' | 'complete'>('capture');

  useEffect(() => {
    startCamera();
  }, []);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (cameraState.stream) {
        cameraState.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraState.stream]);

  const startCamera = useCallback(async () => {
    try {
      setCameraState(prev => ({ ...prev, error: null }));
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser');
      }
      
      const constraints = {
        video: {
          facingMode: cameraState.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraState(prev => ({ ...prev, stream, error: null }));
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraState(prev => ({ 
        ...prev, 
        error: 'Unable to access camera. Please ensure camera permissions are enabled or upload an image instead.' 
      }));
    }
  }, [cameraState.facingMode]);

  const switchCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }
    setCameraState(prev => ({ 
      ...prev, 
      facingMode: prev.facingMode === 'user' ? 'environment' : 'user',
      stream: null 
    }));
  }, [cameraState.stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    setCameraState(prev => ({ ...prev, capturedImage: imageDataUrl }));
    setAnalysisStep('preview');
    
    // Stop camera stream
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }
  }, [cameraState.stream]);

  const retakePhoto = () => {
    setCameraState(prev => ({ ...prev, capturedImage: null }));
    setAnalysisStep('capture');
    startCamera();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setCameraState(prev => ({ ...prev, capturedImage: imageDataUrl }));
      setAnalysisStep('preview');
      
      // Stop camera stream if active
      if (cameraState.stream) {
        cameraState.stream.getTracks().forEach(track => track.stop());
      }
    };
    reader.readAsDataURL(file);
  };

  const startAcneAnalysis = async () => {
    setAnalysisStep('analyzing');
    
    try {
      if (!cameraState.capturedImage) {
        throw new Error('No image captured');
      }

      // Convert data URL to blob
      const response = await fetch(cameraState.capturedImage);
      const blob = await response.blob();
      
      // Create form data for API call
      const formData = new FormData();
      formData.append('image', blob, 'acne_analysis.jpg');
      
      // Add acne-specific quiz data since we're skipping the quiz
      const acneQuizData = {
        age: '26-35',
        gender: 'prefer-not-to-say',
        skinType: 'combination',
        concerns: ['acne'],
        goals: ['reduce-acne'],
        routine: 'basic',
        sunExposure: 'medium',
        lifestyle: ['normal'],
        budget: 'moderate',
        previousTreatments: '',
        allergies: '',
        additionalNotes: 'Acne-focused analysis using Skyn AI'
      };
      
      formData.append('quizData', JSON.stringify(acneQuizData));

      // Make API call to the skin analysis endpoint
      const analysisResponse = await fetch('/api/skincoach/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!analysisResponse.ok) {
        throw new Error('Analysis failed');
      }

      const analysisResult = await analysisResponse.json();
      
      // Store results for the results page
      localStorage.setItem('skinAnalysisResult', JSON.stringify(analysisResult));
      localStorage.setItem('analysisImage', cameraState.capturedImage);
      
      setAnalysisStep('complete');
      
      // Navigate to results page
      setTimeout(() => {
        setLocation('/skincoach/results-acne');
      }, 2000);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setCameraState(prev => ({ 
        ...prev, 
        error: 'Analysis failed. Please try again or check your internet connection.' 
      }));
      setAnalysisStep('preview');
    }
  };

  const renderCaptureInterface = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Acne Analysis Photo</h2>
        <p className="text-gray-600">Capture the area with acne for AI-powered analysis using Skyn technology</p>
      </div>

      {cameraState.error ? (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            {cameraState.error}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="relative">
        <div className="relative bg-black rounded-2xl overflow-hidden aspect-[4/3] max-w-lg mx-auto">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: cameraState.facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          />
          
          {/* Face guide overlay focused on acne areas */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-96 border-4 border-orange-400/80 rounded-lg flex items-center justify-center">
              <div className="text-center bg-black/60 rounded-lg p-4 mx-4">
                <AlertCircle className="h-6 w-6 mx-auto mb-2 text-orange-300" />
                <p className="text-orange-200 text-sm font-medium mb-2">Focus on Acne Area:</p>
                <p className="text-white text-xs mb-1">✓ Position acne in frame</p>
                <p className="text-white text-xs mb-1">✓ Good lighting</p>
                <p className="text-white text-xs">✓ Clean face</p>
              </div>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4">
          <Button
            onClick={capturePhoto}
            disabled={!cameraState.stream || cameraState.error !== null}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
          >
            <Camera className="h-5 w-5 mr-2" />
            Capture Acne Photo
          </Button>

          <Button
            onClick={switchCamera}
            variant="outline"
            disabled={!cameraState.stream}
            className="px-6 py-3 rounded-full"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-gray-500 mb-3">Or</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="px-6 py-3 rounded-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Acne Photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-900 mb-2">🎯 Acne Analysis Focus</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• <strong>Position acne area clearly in the frame</strong> for best detection</li>
          <li>• <strong>Use natural lighting</strong> to show true skin condition</li>
          <li>• <strong>Keep the area clean</strong> - avoid touching or applying products</li>
          <li>• Focus on one main area (face, back, chest) per analysis</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">🧠 Skyn AI Technology</h3>
        <ul className="text-green-800 text-sm space-y-1">
          <li>• Classifies acne severity: Low, Moderate, Severe</li>
          <li>• Uses EfficientNet B0 transfer learning model</li>
          <li>• 87.10% training accuracy, 80% validation accuracy</li>
          <li>• Provides personalized treatment recommendations</li>
        </ul>
      </div>
    </div>
  );

  const renderPreviewInterface = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Photo Captured!</h2>
        <p className="text-gray-600">Ready for Skyn AI acne analysis</p>
      </div>

      <div className="relative max-w-lg mx-auto">
        <img
          src={cameraState.capturedImage || ''}
          alt="Captured acne analysis photo"
          className="w-full rounded-2xl border-4 border-gray-200"
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={retakePhoto}
          variant="outline"
          className="px-6 py-3 rounded-full"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Retake Photo
        </Button>

        <Button
          onClick={startAcneAnalysis}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
        >
          <Zap className="h-5 w-5 mr-2" />
          Analyze Acne with AI
        </Button>
      </div>
    </div>
  );

  const renderAnalysisInterface = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Zap className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyzing Acne Condition</h2>
        <p className="text-gray-600">Skyn AI is examining your photo for acne severity and patterns</p>
      </div>

      <div className="space-y-4">
        {[
          { step: 'Processing image with EfficientNet B0', status: 'complete' },
          { step: 'Detecting acne lesions and patterns', status: 'complete' },
          { step: 'Classifying acne severity level', status: 'active' },
          { step: 'Calculating confidence scores', status: 'pending' },
          { step: 'Generating treatment recommendations', status: 'pending' }
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className={`w-3 h-3 rounded-full ${
              item.status === 'complete' ? 'bg-green-500' :
              item.status === 'active' ? 'bg-blue-500 animate-pulse' :
              'bg-gray-300'
            }`} />
            <span className={`font-medium ${
              item.status === 'complete' ? 'text-green-700' :
              item.status === 'active' ? 'text-blue-700' :
              'text-gray-500'
            }`}>
              {item.step}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">🧠 Skyn AI Processing</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Using advanced computer vision and transfer learning with EfficientNet B0 architecture. 
          The model analyzes skin texture, lesion patterns, and acne severity to provide accurate assessment 
          and personalized treatment recommendations.
        </p>
      </div>
    </div>
  );

  const renderCompleteInterface = () => (
    <div className="space-y-6 text-center">
      <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Acne Analysis Complete!</h2>
      <p className="text-gray-600 text-lg">
        Your detailed acne assessment and treatment plan is ready. Redirecting you to results...
      </p>
      
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/skincoach')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
            <Badge className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              Acne Analysis with Skyn AI
            </Badge>
          </div>
        </div>

        {/* Camera Interface */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="sr-only">Acne Photo Capture</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {analysisStep === 'capture' && renderCaptureInterface()}
            {analysisStep === 'preview' && renderPreviewInterface()}
            {analysisStep === 'analyzing' && renderAnalysisInterface()}
            {analysisStep === 'complete' && renderCompleteInterface()}
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your photo is processed securely using Skyn AI technology and never stored on our servers. 
            All analysis happens in real-time and your image is deleted immediately after processing.
          </p>
        </div>
      </div>
    </div>
  );
}