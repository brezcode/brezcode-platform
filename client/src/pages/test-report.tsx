import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import HealthReport from "@/components/health-report";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function TestReportPage() {
  const [location, setLocation] = useLocation();
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [hasAnswers, setHasAnswers] = useState(false);

  // Generate report mutation using test endpoint (no auth required)
  const generateReportMutation = useMutation({
    mutationFn: async (answers: Record<string, any>) => {
      console.log('Generating report with answers:', answers);
      const response = await fetch('/api/reports/generate-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizAnswers: answers })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Report generated successfully:', data);
      if (data && data.report) {
        setGeneratedReport(data.report);
      } else {
        console.error('Invalid response structure:', data);
      }
    },
    onError: (error) => {
      console.error('Error generating report:', error);
    }
  });

  // Check for quiz answers and generate report immediately
  useEffect(() => {
    const storedAnswers = localStorage.getItem('brezcode_quiz_answers');
    if (storedAnswers) {
      try {
        const answers = JSON.parse(storedAnswers);
        console.log('Found quiz answers, generating report...', answers);
        setHasAnswers(true);
        generateReportMutation.mutate(answers);
        localStorage.removeItem('brezcode_quiz_answers'); // Clean up after use
      } catch (error) {
        console.error('Error parsing quiz answers:', error);
      }
    } else {
      // No quiz answers found, redirect to quiz
      console.log('No quiz answers found, redirecting to quiz...');
      setLocation('/quiz');
    }
  }, []);

  // Show loading state while generating report
  if (generateReportMutation.isPending || (hasAnswers && !generatedReport)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Your Health Report
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              We're analyzing your assessment responses and creating your personalized breast health report...
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div>✓ Calculating risk score</div>
              <div>✓ Identifying risk factors</div>
              <div>✓ Creating personalized recommendations</div>
              <div>✓ Building your daily wellness plan</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if report generation failed
  if (generateReportMutation.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Report Generation Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              We encountered an error while generating your health report. Please try again.
            </p>
            <div className="space-y-2">
              <Button onClick={() => setLocation('/quiz')}>
                Retake Assessment
              </Button>
              <Button variant="outline" onClick={() => setLocation('/')}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display the generated report
  if (generatedReport) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">BrezCode Health Report</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => setLocation('/')}>
                  Back to Home
                </Button>
                <Button onClick={() => setLocation('/quiz')}>
                  Retake Assessment
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Report Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HealthReport report={generatedReport} />
        </div>
      </div>
    );
  }

  // Fallback - should not reach here
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>No Report Available</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            No assessment data found. Please complete the health assessment first.
          </p>
          <Button onClick={() => setLocation('/quiz')}>
            Take Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}