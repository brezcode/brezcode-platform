import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, RotateCcw, Check, Upload, ChevronLeft, Zap, Eye, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function SkinCoachCameraSimple() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = async () => {
    try {
      setError(null);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser');
      }
      
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      
      setStream(newStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Unable to access camera. Please ensure camera permissions are enabled or upload an image instead.');
    }
  };

  const switchCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    setStream(null);
    setTimeout(() => startCamera(), 100);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageDataUrl);
    
    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setCapturedImage(imageDataUrl);
      
      // Stop camera stream if active
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Navigate to results page
    setLocation('/skincoach/results');
  };

  // Start camera on component mount
  React.useEffect(() => {
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyzing Your Skin</h2>
          <p className="text-gray-600 mb-6">Our AI is examining your photo for skin insights</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/skincoach/quiz')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Quiz
            </Button>
            <Badge className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              Step 2: Photo Analysis
            </Badge>
          </div>
        </div>

        {/* Camera Interface */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="sr-only">Skin Photo Capture</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {!capturedImage ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Take Your Skin Photo</h2>
                  <p className="text-gray-600">Position your face in the frame for the best analysis</p>
                </div>

                {error && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-orange-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="relative">
                  <div className="relative bg-black rounded-2xl overflow-hidden aspect-[4/3] max-w-lg mx-auto">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                    />
                    
                    {/* Face guide overlay with warning */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-72 h-96 border-4 border-orange-400/80 rounded-full flex items-center justify-center">
                        <div className="text-center bg-black/60 rounded-lg p-4 mx-4">
                          <AlertCircle className="h-6 w-6 mx-auto mb-2 text-orange-300" />
                          <p className="text-orange-200 text-sm font-medium mb-2">Before Taking Photo:</p>
                          <p className="text-white text-xs mb-1">✓ Remove glasses</p>
                          <p className="text-white text-xs mb-1">✓ Remove makeup</p>
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
                      disabled={!stream || error !== null}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Capture Photo
                    </Button>

                    <Button
                      onClick={switchCamera}
                      variant="outline"
                      disabled={!stream}
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
                      Upload Photo
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

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-orange-900 mb-2">⚠️ Important: Before Taking Photo</h3>
                  <ul className="text-orange-800 text-sm space-y-1">
                    <li>• <strong>Remove eyeglasses or sunglasses</strong> - they interfere with skin analysis</li>
                    <li>• <strong>Remove makeup completely</strong> - makeup hides your true skin condition</li>
                    <li>• Cleanse your face if wearing makeup</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 Additional tips for best results:</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Use good lighting (natural light works best)</li>
                    <li>• Look directly at the camera</li>
                    <li>• Keep your face centered in the frame</li>
                    <li>• Avoid shadows on your face</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Photo Captured!</h2>
                  <p className="text-gray-600">Review your photo and proceed with the analysis</p>
                </div>

                <div className="relative max-w-lg mx-auto">
                  <img
                    src={capturedImage}
                    alt="Captured skin photo"
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
                    onClick={startAnalysis}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Analyze My Skin
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your photo is processed securely and never stored on our servers. 
            All analysis happens in real-time and your image is deleted immediately after processing.
          </p>
        </div>
      </div>
    </div>
  );
}