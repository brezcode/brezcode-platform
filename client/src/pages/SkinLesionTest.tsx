import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, RotateCcw, Check, Upload, ChevronLeft, Zap, AlertCircle, Flashlight, FlashlightOff } from 'lucide-react';
import { useLocation } from 'wouter';

export default function SkinLesionTest() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [torchEnabled, setTorchEnabled] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser');
      }
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          torch: torchEnabled
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

  const toggleTorch = async () => {
    if (!stream) return;
    
    try {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack && 'torch' in videoTrack.getCapabilities()) {
        const newTorchState = !torchEnabled;
        await videoTrack.applyConstraints({
          advanced: [{ torch: newTorchState }]
        });
        setTorchEnabled(newTorchState);
      }
    } catch (error) {
      console.error('Error toggling torch:', error);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;

    try {
      // Turn on flashlight before capture
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack && 'torch' in videoTrack.getCapabilities()) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: true }]
        });
        
        // Wait a moment for the flash to activate
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageDataUrl);
      
      // Turn off flashlight after capture
      if (videoTrack && 'torch' in videoTrack.getCapabilities()) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: false }]
        });
      }
      
      // Stop camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    } catch (error) {
      console.error('Error capturing photo with flash:', error);
      
      // Fallback: capture without flash
      const video = videoRef.current!;
      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d')!;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageDataUrl);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    startCamera();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setCapturedImage(imageDataUrl);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', blob, 'lesion.jpg');
      
      // Call the API
      const apiResponse = await fetch('/api/skin-lesion-analysis/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!apiResponse.ok) {
        throw new Error('Analysis failed. Please try again.');
      }
      
      const result = await apiResponse.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Analysis failed. Please try again or upload a different image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-orange-100 to-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="h-8 w-8 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyzing Skin Lesion</h2>
          <p className="text-gray-600 mb-6">Our AI is examining your photo for lesion classification</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Button>
              <Badge className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                Analysis Complete
              </Badge>
            </div>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                Skin Lesion Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Image</h3>
                  <img
                    src={capturedImage!}
                    alt="Analyzed skin lesion"
                    className="w-full rounded-lg border-2 border-gray-200"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
                  <div className="space-y-4">
                    {/* Confidence Level */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Confidence Level:</span>
                        <Badge className={`${analysisResult.confidence.color === 'green' ? 'bg-green-500' : 
                          analysisResult.confidence.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                          {analysisResult.confidence.level} ({analysisResult.confidence.score}%)
                        </Badge>
                      </div>
                    </div>

                    {/* Top Predictions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Top Predictions:</h4>
                      {analysisResult.predictions.map((prediction: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-gray-900">{prediction.rank}. {prediction.class_name}</h5>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                              {prediction.percentage}%
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{prediction.description}</p>
                          <p className="text-orange-700 text-sm font-medium">{prediction.medical_advice}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recommendations */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Recommendations:</h4>
                      <ul className="text-blue-800 text-sm space-y-1">
                        {analysisResult.recommendations.map((recommendation: string, index: number) => (
                          <li key={index}>• {recommendation}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Model Information */}
                    <details className="bg-gray-50 rounded-lg p-4">
                      <summary className="cursor-pointer font-medium text-gray-700">Technical Details</summary>
                      <div className="mt-3 text-sm text-gray-600 space-y-2">
                        <p><strong>Model:</strong> {analysisResult.model_info.name} v{analysisResult.model_info.version}</p>
                        <p><strong>Description:</strong> {analysisResult.model_info.description}</p>
                        <p><strong>Classes:</strong> {analysisResult.model_info.classes} lesion types</p>
                        <p><strong>Analysis Time:</strong> {Math.round(analysisResult.analysis_time)}ms</p>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button
                  onClick={() => {
                    setCapturedImage(null);
                    setAnalysisResult(null);
                    startCamera();
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 mr-4"
                >
                  Test Another Lesion
                </Button>
                <Button
                  onClick={() => setLocation('/')}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-red-600 font-medium">
              ⚠️ IMPORTANT: This is an AI analysis tool for educational purposes only. 
              Always consult with a qualified dermatologist for medical advice and diagnosis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
            <Badge className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
              Skin Lesion Test
            </Badge>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="sr-only">Skin Lesion Photo Capture</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {!capturedImage ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Skin Lesion Analysis</h2>
                  <p className="text-gray-600">Take a clear photo of the skin lesion for AI analysis</p>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-red-900 mb-2">⚠️ Medical Disclaimer</h3>
                  <p className="text-red-800 text-sm">
                    This AI tool provides educational information only and is not a substitute for professional medical advice, 
                    diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.
                  </p>
                </div>

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
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-4 border-orange-400/80 rounded-lg flex items-center justify-center">
                        <div className="text-center bg-black/60 rounded-lg p-3">
                          <p className="text-orange-200 text-sm font-medium">Center lesion here</p>
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
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Capture Photo
                    </Button>

                    <Button
                      onClick={toggleTorch}
                      variant="outline"
                      disabled={!stream}
                      className={`px-6 py-3 rounded-full ${torchEnabled ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : ''}`}
                      title={torchEnabled ? 'Turn off flashlight' : 'Turn on flashlight'}
                    >
                      {torchEnabled ? (
                        <Flashlight className="h-5 w-5" />
                      ) : (
                        <FlashlightOff className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      onClick={switchCamera}
                      variant="outline"
                      disabled={!stream}
                      className="px-6 py-3 rounded-full"
                      title="Switch camera"
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">📸 Tips for best results:</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Use good lighting (natural light preferred)</li>
                    <li>• <strong>Flashlight automatically turns on</strong> when capturing for better visibility</li>
                    <li>• Keep the camera steady</li>
                    <li>• Focus clearly on the lesion</li>
                    <li>• Avoid shadows and reflections</li>
                    <li>• Fill the frame with the area of concern</li>
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
                    alt="Captured skin lesion photo"
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
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Analyze Lesion
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔒 Your photo is processed securely and never stored permanently. 
            All analysis happens in real-time for your privacy.
          </p>
        </div>
      </div>
    </div>
  );
}