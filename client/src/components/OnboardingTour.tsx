import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, Target, Lightbulb, Smartphone, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface TourStep {
  id: number;
  stepId: string;
  title: string;
  description: string;
  targetElement?: string;
  position: string;
  deviceTypes: string[];
  order: number;
  isRequired: boolean;
  actionType?: string;
  actionData?: Record<string, any>;
}

interface OnboardingStatus {
  status: {
    id: number;
    userId: number;
    tourCompleted: boolean;
    currentStep: number;
    stepsCompleted: string[];
    deviceType: string;
  } | null;
  shouldShow: boolean;
  preferences: {
    showTipsOnMobile: boolean;
    preferredTourSpeed: string;
    skipAdvancedFeatures: boolean;
  } | null;
  deviceType: string;
}

interface OnboardingTourProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const tourRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Detect device type
  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  };

  // Get onboarding status
  const { data: onboardingData, isLoading } = useQuery({
    queryKey: ['/api/onboarding/status'],
    queryFn: async () => {
      const response = await fetch('/api/onboarding/status', {
        headers: { 'X-Device-Type': getDeviceType() }
      });
      return response.json();
    }
  });

  // Get tour steps
  const { data: tourSteps } = useQuery({
    queryKey: ['/api/onboarding/steps', getDeviceType()],
    queryFn: async () => {
      const response = await fetch(`/api/onboarding/steps?deviceType=${getDeviceType()}`);
      return response.json();
    }
  });

  // Start tour mutation
  const startTourMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/onboarding/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceType: getDeviceType() })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/onboarding/status'] });
      setIsVisible(true);
    }
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (stepId: string) => {
      const response = await fetch('/api/onboarding/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, completed: true })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/onboarding/status'] });
    }
  });

  // Complete tour mutation
  const completeTourMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/onboarding/complete', { method: 'POST' });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/onboarding/status'] });
      setIsVisible(false);
      onComplete?.();
    }
  });

  // Skip tour mutation
  const skipTourMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/onboarding/skip', { method: 'POST' });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/onboarding/status'] });
      setIsVisible(false);
      onSkip?.();
    }
  });

  // Initialize tour if should show
  useEffect(() => {
    if (onboardingData?.shouldShow && !isLoading) {
      startTourMutation.mutate();
    }
  }, [onboardingData?.shouldShow, isLoading]);

  // Highlight target element
  const highlightElement = (selector?: string) => {
    // Remove previous highlight
    if (highlightedElement) {
      highlightedElement.classList.remove('onboarding-highlight');
    }

    if (selector) {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('onboarding-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedElement(element);
      }
    }
  };

  // Handle step navigation
  const goToStep = (index: number) => {
    if (!tourSteps || index < 0 || index >= tourSteps.length) return;
    
    const step = tourSteps[index];
    setCurrentStepIndex(index);
    highlightElement(step.targetElement);
    
    // Update progress for completed step
    if (index > currentStepIndex) {
      updateProgressMutation.mutate(step.stepId);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < (tourSteps?.length || 0) - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    completeTourMutation.mutate();
  };

  const handleSkip = () => {
    skipTourMutation.mutate();
  };

  // Clean up highlights on unmount
  useEffect(() => {
    return () => {
      if (highlightedElement) {
        highlightedElement.classList.remove('onboarding-highlight');
      }
    };
  }, []);

  if (isLoading || !isVisible || !tourSteps || tourSteps.length === 0) {
    return null;
  }

  const currentStep = tourSteps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / tourSteps.length) * 100;
  const deviceType = getDeviceType();

  return (
    <>
      {/* Overlay for highlighting */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 pointer-events-none" />
      
      {/* Tour card */}
      <Card 
        ref={tourRef}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 shadow-2xl border-2 border-blue-500"
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {deviceType === 'mobile' ? (
                <Smartphone className="w-5 h-5 text-blue-600" />
              ) : (
                <Target className="w-5 h-5 text-blue-600" />
              )}
              <Badge variant="outline" className="text-xs">
                {deviceType === 'mobile' ? 'Mobile Tour' : 'Desktop Tour'}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Step {currentStepIndex + 1} of {tourSteps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <div className="mb-4">
            <div className="flex items-start gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <h3 className="font-semibold text-sm">{currentStep.title}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Mobile-specific tips */}
          {deviceType === 'mobile' && currentStep.actionType === 'touch' && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Mobile Tip</span>
              </div>
              <p className="text-xs text-blue-700">
                Tap the highlighted area to continue. Use your finger to interact with buttons and cards.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-gray-600"
              >
                Skip Tour
              </Button>
              
              {currentStepIndex === tourSteps.length - 1 ? (
                <Button
                  size="sm"
                  onClick={handleComplete}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Finish
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={nextStep}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSS for highlighting */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .onboarding-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 0 8px rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .onboarding-highlight::after {
          content: '';
          position: absolute;
          inset: -4px;
          border: 2px solid rgb(59, 130, 246);
          border-radius: 8px;
          pointer-events: none;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
      `
      }} />
    </>
  );
}