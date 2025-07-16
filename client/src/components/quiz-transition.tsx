import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Heart, Shield } from "lucide-react";
import { useLocation } from "wouter";

interface QuizTransitionProps {
  onContinue: () => void;
}

export default function QuizTransition({ onContinue }: QuizTransitionProps) {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            Congratulations! Quiz Complete
          </CardTitle>
          <p className="text-lg text-gray-600">
            You've successfully completed your comprehensive breast health assessment
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              What's Next?
            </h3>
            <p className="text-blue-700">
              Based on your responses, we're preparing a personalized assessment report with evidence-based recommendations tailored specifically for your breast health profile.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border">
              <FileText className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800">Comprehensive Report</h4>
                <p className="text-sm text-gray-600">Detailed analysis of your risk factors and personalized recommendations</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border">
              <Heart className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800">Health Coaching</h4>
                <p className="text-sm text-gray-600">AI-powered guidance tailored to your specific health profile</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-yellow-600 mt-1" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Complete Your Registration
                </h4>
                <p className="text-yellow-700 mb-4">
                  To provide you with your personalized assessment report and begin your breast health coaching journey, we need to complete your account setup.
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Secure your account with email verification</li>
                  <li>• Enable SMS notifications for important health reminders</li>
                  <li>• Ensure we can deliver your personalized report safely</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={() => {
                onContinue();
                setLocation('/report');
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg"
            >
              Generate Your Health Report
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              This will only take 2-3 minutes to complete
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}