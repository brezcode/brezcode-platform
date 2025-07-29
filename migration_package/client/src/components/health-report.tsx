import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  User,
  Activity
} from 'lucide-react';

interface HealthReportProps {
  report: {
    id: number;
    riskScore: number;
    riskCategory: string;
    userProfile: string;
    riskFactors: string[];
    recommendations: string[];
    dailyPlan: {
      morning: string;
      afternoon: string;
      evening: string;
    };
    reportData: {
      summary: {
        uncontrollableHealthScore: string;
        controllableHealthScore: string;
        overallHealthScore: string;
        profileDescription: string;
      };
      sectionAnalysis: {
        sectionBreakdown: Array<{
          name: string;
          score: number;
          riskLevel: string;
          riskFactors: string[];
        }>;
        sectionSummaries: Record<string, string>;
      };
      personalizedPlan: {
        coachingFocus: string[];
        followUpTimeline: Record<string, string>;
      };
    };
  };
}

const getRiskColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'low': return 'text-green-600';
    case 'moderate': return 'text-yellow-600';
    case 'high': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getRiskBadgeVariant = (riskLevel: string) => {
  switch (riskLevel.toLowerCase()) {
    case 'low': return 'secondary';
    case 'moderate': return 'default';
    case 'high': return 'destructive';
    default: return 'secondary';
  }
};

export default function HealthReport({ report }: HealthReportProps) {
  const { reportData } = report;
  const { summary, sectionAnalysis, personalizedPlan } = reportData;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Your Personalized Health Report</h1>
        <p className="text-lg text-gray-600">Comprehensive breast health assessment and recommendations</p>
      </div>

      {/* Risk Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-500" />
            Risk Assessment Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{report.riskScore}/100</div>
              <div className={`text-lg font-semibold mb-2 capitalize ${getRiskColor(report.riskCategory)}`}>
                {report.riskCategory} Risk
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="text-sm text-gray-600">Uncontrollable Factors</div>
                <div className="flex-1">
                  <Progress 
                    value={parseInt(summary.uncontrollableHealthScore)} 
                    className="h-4"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Based on Demographics, Genetics, Hormonal factors and Screening results.
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

      {/* Section-Based Health Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            Health Analysis by Section
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
                {section.riskFactors && section.riskFactors.length > 0 ? (
                  <div className="space-y-1">
                    {section.riskFactors.map((factor: string, idx: number) => (
                      <p key={idx} className="text-xs text-gray-600 leading-tight">
                        • {factor}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-green-600">
                    No risk factors identified in this area
                  </p>
                )}
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
              {(personalizedPlan.coachingFocus || []).map((focus, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{focus}</p>
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
                <div className="text-sm text-gray-600 leading-relaxed">
                  {report.dailyPlan.morning}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Afternoon</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 leading-relaxed">
                  {report.dailyPlan.afternoon}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Evening</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 leading-relaxed">
                  {report.dailyPlan.evening}
                </div>
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
            {Object.entries(personalizedPlan.followUpTimeline || {}).map(([timeframe, action]) => (
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