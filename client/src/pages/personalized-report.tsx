import { useEffect, useState } from "react";
import HealthReport from "@/components/health-report";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function PersonalizedReportPage() {
  const [location, setLocation] = useLocation();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateReport = async () => {
      try {
        const storedAnswers = localStorage.getItem('brezcode_quiz_answers');
        if (!storedAnswers) {
          console.error('No quiz answers found in localStorage');
          setLoading(false);
          return;
        }

        const quizAnswers = JSON.parse(storedAnswers);
        console.log('Generating personalized report with answers:', quizAnswers);

        const response = await fetch('/api/reports/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quizAnswers }),
          credentials: 'include', // Include session cookies
        });

        if (!response.ok) {
          if (response.status === 401) {
            // User not authenticated, redirect to signup
            setLocation('/quiz');
            return;
          }
          const errorText = await response.text();
          console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Personalized report generated successfully:', data);

        if (data.success && data.report) {
          setReport(data.report);
        } else if (data.report) {
          // Handle legacy format without success flag
          setReport(data.report);
        } else {
          console.error('Invalid response format:', data);
        }
      } catch (error) {
        console.error('Failed to generate personalized report:', error);
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Your Personalized Health Report
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              We're creating your personalized breast health report with your profile information...
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div>✓ Calculating risk score</div>
              <div>✓ Identifying risk factors</div>
              <div>✓ Creating personalized recommendations</div>
              <div>✓ Adding your profile information</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Report Generation Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Unable to generate your health report. Please try taking the assessment again.
            </p>
            <Button onClick={() => setLocation('/quiz')} className="w-full">
              Retake Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HealthReport report={report} />
    </div>
  );
}