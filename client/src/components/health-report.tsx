import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Heart, Shield, TrendingUp, Calendar, Download } from "lucide-react";

interface HealthReportProps {
  report: {
    id: number;
    riskScore: string;
    riskCategory: 'low' | 'moderate' | 'high';
    userProfile: 'teenager' | 'premenopausal' | 'postmenopausal' | 'current_patient' | 'survivor';
    riskFactors: string[];
    recommendations: string[];
    dailyPlan: Record<string, any>;
    reportData: {
      summary: {
        totalRiskScore: string;
        overallRiskCategory: string;
        userProfile: string;
        profileDescription: string;
        totalSections: number;
      };
      sectionAnalysis: {
        sectionScores: { [key: string]: { score: number, factors: string[] } };
        sectionSummaries: { [key: string]: string };
        sectionBreakdown: Array<{ name: string, score: number, factorCount: number, riskLevel: string }>;
      };
      personalizedPlan: {
        dailyPlan: Record<string, any>;
        coachingFocus: string[];
        followUpTimeline: Record<string, string>;
      };
    };
    createdAt: string;
  };
}

function getRiskColor(category: string) {
  switch (category) {
    case 'low': return 'bg-green-500';
    case 'moderate': return 'bg-yellow-500';
    case 'high': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

function getRiskBadgeVariant(category: string) {
  switch (category) {
    case 'low': return 'default';
    case 'moderate': return 'secondary';
    case 'high': return 'destructive';
    default: return 'outline';
  }
}

function getProfileIcon(profile: string) {
  switch (profile) {
    case 'teenager': return '🌱';
    case 'premenopausal': return '🌸';
    case 'postmenopausal': return '🌿';
    case 'current_patient': return '💜';
    case 'survivor': return '🎗️';
    default: return '💙';
  }
}

export default function HealthReport({ report }: HealthReportProps) {
  const riskScore = parseFloat(report.riskScore);
  const { summary, sectionAnalysis, personalizedPlan } = report.reportData;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Breast Health Report</h1>
          <p className="text-gray-600 mt-1">
            Generated on {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Risk Score Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getProfileIcon(report.userProfile)}</span>
              <span>Risk Assessment Summary</span>
            </div>
            <Badge variant={getRiskBadgeVariant(report.riskCategory)} className="ml-auto">
              {report.riskCategory.toUpperCase()} RISK
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Calculated Risk Score</div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-indigo-600">
                  {summary.totalRiskScore}/100
                </div>
                <div className="flex-1">
                  <Progress 
                    value={riskScore} 
                    className="h-4"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Based on age, genetics, lifestyle, and medical factors from your assessment
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Your Profile</div>
              <div className="text-lg font-semibold text-gray-900 capitalize">
                {report.userProfile.replace('_', ' ')}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {summary.profileDescription}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section-Based Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Risk Analysis by Section
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {sectionAnalysis.sectionBreakdown.map((section, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-gray-900">{section.name}</h4>
                  <Badge variant={getRiskBadgeVariant(section.riskLevel)} className="text-xs">
                    {section.riskLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-lg font-bold text-indigo-600">
                    {section.score.toFixed(0)}/100
                  </div>
                  <div className="flex-1">
                    <Progress value={section.score} className="h-2" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {section.factorCount} risk factor{section.factorCount !== 1 ? 's' : ''} identified
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Summaries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Detailed Section Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(sectionAnalysis.sectionSummaries).map(([sectionName, summary]) => (
            <div key={sectionName} className="border-l-4 border-blue-200 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">{sectionName}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Personalized Coaching Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Your Personalized Coaching Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Primary Coaching Focus Areas</h3>
            <div className="grid gap-3">
              {personalizedPlan.coachingFocus.map((focus, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{focus}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Follow-Up Timeline</h3>
            <div className="grid gap-3">
              {Object.entries(personalizedPlan.followUpTimeline).map(([timeframe, activity]) => (
                <div key={timeframe} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm text-gray-900 capitalize">{timeframe.replace('_', ' ')}</div>
                    <p className="text-sm text-gray-700">{activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Your Daily Wellness Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Morning</h4>
              <div className="space-y-2">
                {Object.entries(report.dailyPlan.morning || {}).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                    <span className="text-gray-600">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Afternoon</h4>
              <div className="space-y-2">
                {Object.entries(report.dailyPlan.afternoon || {}).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                    <span className="text-gray-600">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Evening</h4>
              <div className="space-y-2">
                {Object.entries(report.dailyPlan.evening || {}).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                    <span className="text-gray-600">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Weekly Focus</h4>
              <div className="space-y-2">
                {Object.entries(report.dailyPlan.weekly || {}).map(([key, value]) => (
                  <div key={key} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span className="font-medium capitalize">{key.replace('_', ' ')}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recommended Supplements</h4>
              <div className="space-y-2">
                {(report.dailyPlan.supplements || []).map((supplement: string, index: number) => (
                  <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    {supplement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Follow-up Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Follow-up Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(actionPlan.followUp).map(([timeframe, action]) => (
              <div key={timeframe} className="flex items-start gap-4 p-3 border rounded-lg">
                <div className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                  {timeframe.replace('_', ' ').toUpperCase()}
                </div>
                <div className="text-sm text-gray-700">{action}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}