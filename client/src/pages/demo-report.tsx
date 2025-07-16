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
    // Generate a demo report with the recent quiz answers
    const generateDemoReport = async () => {
      setLoading(true);
      
      const demoAnswers = {
        "age": "60",
        "ethnicity": "White (non-Hispanic)",
        "family_history": "Yes, I have first-degree relative with BC",
        "brca_test": "BRCA1/2",
        "dense_breast": "Yes",
        "menstrual_age": "Before 12 years old",
        "pregnancy_age": "Never had a full-term pregnancy",
        "oral_contraceptives": "Yes, currently using",
        "menopause": "Yes, at age 55 or later",
        "weight": "80",
        "height": "1.6",
        "hrt": "Yes",
        "western_diet": "Yes, Western diet",
        "smoke": "Yes",
        "alcohol": "2 or more drinks",
        "night_shift": "Yes",
        "stressful_events": "Yes, striking life events",
        "benign_condition": "Yes, Atypical Hyperplasia (ADH/ALH)",
        "precancerous_condition": "Yes, I am currently receiving treatment for breast cancer",
        "cancer_stage": "Stage 4",
        "mammogram_frequency": "Annually (once a year)",
        "breast_symptoms": "I have a lump in my breast",
        "lump_characteristics": "Growing Lump with size over 5cm",
        "country": "United States",
        "bmi": 31.2,
        "obesity": "Yes"
      };

      try {
        const response = await fetch('/api/reports/generate-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizAnswers: demoAnswers })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Demo report generated:', data);
          setReport(data.report);
        } else {
          console.error('Failed to generate demo report');
        }
      } catch (error) {
        console.error('Error generating demo report:', error);
      } finally {
        setLoading(false);
      }
    };

    generateDemoReport();
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