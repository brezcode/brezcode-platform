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
        riskScore: string;
        riskCategory: string;
        userProfile: string;
        profileDescription: string;
        totalRiskFactors: number;
      };
      riskAnalysis: {
        identifiedFactors: string[];
        protectiveFactors: string[];
        riskBreakdown: Record<string, string[]>;
      };
      actionPlan: {
        immediate: string[];
        ongoing: string[];
        followUp: Record<string, string>;
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
  const { summary, riskAnalysis, actionPlan } = report.reportData;

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
                  {summary.riskScore}/100
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

      {/* Risk Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Risk Factors Identified
            </CardTitle>
          </CardHeader>
          <CardContent>
            {riskAnalysis.identifiedFactors.length > 0 ? (
              <div className="space-y-3">
                {riskAnalysis.identifiedFactors.slice(0, 5).map((factor, index) => (
                  <div key={index} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-200">
                    <p className="text-sm text-gray-700">{factor}</p>
                  </div>
                ))}
                {riskAnalysis.identifiedFactors.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{riskAnalysis.identifiedFactors.length - 5} more factors
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No significant risk factors identified.</p>
            )}
          </CardContent>
        </Card>

        {/* Protective Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Protective Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {riskAnalysis.protectiveFactors.length > 0 ? (
              <div className="space-y-3">
                {riskAnalysis.protectiveFactors.map((factor, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-200">
                    <p className="text-sm text-gray-700">{factor}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Focus on building protective lifestyle habits.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Immediate Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Your Personalized Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Immediate Priorities</h3>
            <div className="grid gap-3">
              {actionPlan.immediate.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{action}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Ongoing Recommendations</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {actionPlan.ongoing.slice(0, 6).map((action, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <Heart className="h-4 w-4 text-pink-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{action}</p>
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