import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import HealthReport from "@/components/health-report";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileText, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function ReportPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any> | null>(null);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Check for quiz answers in localStorage
  useEffect(() => {
    const storedAnswers = localStorage.getItem('brezcode_quiz_answers');
    if (storedAnswers) {
      setQuizAnswers(JSON.parse(storedAnswers));
      localStorage.removeItem('brezcode_quiz_answers'); // Clean up after use
    }
  }, []);

  // Fetch existing reports
  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['/api/reports'],
    enabled: isAuthenticated,
  });

  // Generate report mutation (uses test endpoint for demo mode)
  const generateReportMutation = useMutation({
    mutationFn: async (answers: Record<string, any>) => {
      return await apiRequest('/api/reports/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizAnswers: answers })
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
      setGeneratedReport(data.report); // Store the generated report
      setQuizAnswers(null); // Clear quiz answers after successful generation
    },
    onError: (error) => {
      console.error('Error generating report:', error);
    }
  });

  // Auto-generate report if quiz answers are available (test mode - no auth required)
  useEffect(() => {
    if (quizAnswers && !generateReportMutation.isPending) {
      generateReportMutation.mutate(quizAnswers);
    }
  }, [quizAnswers]);

  // For test mode: Allow access without authentication when quiz answers are available
  // Redirect to BrezCode landing only if no quiz answers and not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !quizAnswers && !generatedReport) {
      setLocation('/brezcode');
    }
  }, [authLoading, isAuthenticated, quizAnswers, generatedReport, setLocation]);

  if (authLoading && !generatedReport) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show loading state while generating report
  if (generateReportMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center">
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
              <Button 
                onClick={() => quizAnswers && generateReportMutation.mutate(quizAnswers)}
                disabled={!quizAnswers}
              >
                Retry Report Generation
              </Button>
              <Button variant="outline" onClick={() => setLocation('/quiz')}>
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display generated report from test mode
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

  // Show reports list if available (authenticated mode)
  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (reportsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <FileText className="h-5 w-5" />
              No BrezCode Reports Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              You haven't completed any breast health assessments yet. Take our comprehensive BrezCode assessment to get your personalized health report.
            </p>
            <div className="space-y-2">
              <Button onClick={() => setLocation('/brezcode/quiz')} className="w-full">
                Take BrezCode Assessment
              </Button>
              <Button variant="outline" onClick={() => setLocation('/brezcode')} className="w-full">
                Back to BrezCode Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display the most recent report
  const latestReport = reports[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">BrezCode</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setLocation('/quiz')}>
                Retake Assessment
              </Button>
              <Button variant="outline" onClick={() => setLocation('/chat')}>
                Get Coaching
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Report Content */}
      <main className="py-8">
        <HealthReport report={latestReport} />
      </main>
    </div>
  );
}