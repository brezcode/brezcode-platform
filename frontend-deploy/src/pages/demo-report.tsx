import { useEffect, useState } from "react";
import HealthReport from "@/components/health-report";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function DemoReportPage() {
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
        console.log('Generating report with answers:', quizAnswers);

        const response = await fetch('/api/reports/generate-demo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quizAnswers }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Report generated successfully:', data);

        if (data.success && data.report) {
          setReport(data.report);
        } else {
          console.error('Invalid response format:', data);
        }
      } catch (error) {
        console.error('Failed to generate demo report:', error);
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, []);

  if (loading) {
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

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Unable to Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              We encountered an issue generating your health report. Please try again.
            </p>
            <Button onClick={() => setLocation('/quiz')}>
              Retake Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <HealthReport report={report} />
      </div>
    </div>
  );
}