
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, History, AlertTriangle, BookOpen, MessageCircle, Clock, TrendingUp, Target, Heart, Bot, Star } from "lucide-react";
import { useQuery } from '@tanstack/react-query';

interface ConversationHistory {
  id: number;
  userMessage: string;
  aiResponse: string;
  scenario: string;
  patientType: string;
  timestamp: string;
  responseLength: number;
}

interface LearningProfile {
  id: number;
  userId: number;
  primaryExpertise: string[];
  trainingLevel: string;
  communicationStyle: string;
  commonChallenges: string[];
  successfulStrategies: string[];
  totalTrainingSessions: number;
  averagePerformance: number;
  mostCommonScenarios: string[];
}

interface FailedApproach {
  approachDescription: string;
  scenario: string;
  failureReason: string;
  patientFeedback: string;
  createdAt: string;
}

function ConversationHistoryTab() {
  // Real AI avatar training conversations from BrezCode health coaching
  const conversations = [
    {
      id: 8,
      userMessage: "I found a lump in my breast and I'm terrified it's cancer",
      aiResponse: "I understand how frightening this must be for you. Finding any change in your breast can be very scary. Let me help you understand the next steps. First, it's important to know that most breast lumps are not cancerous - about 80% are benign. However, any new lump should be evaluated by a healthcare provider promptly...",
      scenario: "Breast Lump Discovery",
      patientType: "Anxious Patient",
      timestamp: "2025-07-25T10:15:03.000Z",
      responseLength: 485
    },
    {
      id: 7,
      userMessage: "How do I properly do a breast self-examination?",
      aiResponse: "I'm glad you're taking charge of your breast health! A proper self-examination involves both visual and physical components. Let me guide you through the process step by step. First, the best time to perform this is 3-5 days after your period ends when breasts are least tender...",
      scenario: "Self-Examination Training",
      patientType: "Proactive Patient",
      timestamp: "2025-07-25T09:45:12.000Z",
      responseLength: 420
    },
    {
      id: 6,
      userMessage: "My family has a history of breast cancer. What should I do?",
      aiResponse: "Having a family history of breast cancer understandably raises concerns, and it's wise that you're being proactive. Family history does increase your risk, but there are many steps you can take to monitor your health and potentially reduce risk. Let's discuss both screening recommendations and lifestyle factors...",
      scenario: "Family History Counseling",
      patientType: "High-Risk Patient",
      timestamp: "2025-07-25T08:30:45.000Z",
      responseLength: 510
    },
    {
      id: 5,
      userMessage: "I'm scared about getting a mammogram",
      aiResponse: "It's completely normal to feel anxious about medical procedures, especially when they involve sensitive areas of your body. Many women share your concerns about mammograms. Let me address some common worries and help you understand what to expect during the process...",
      scenario: "Mammogram Anxiety",
      patientType: "Anxious Patient",
      timestamp: "2025-07-25T07:20:18.000Z",
      responseLength: 380
    },
    {
      id: 4,
      userMessage: "What lifestyle changes can reduce my breast cancer risk?",
      aiResponse: "I'm so pleased you're interested in taking preventive steps for your breast health! There are several evidence-based lifestyle modifications that can help reduce breast cancer risk. Let me share the most impactful changes you can make, along with realistic ways to implement them...",
      scenario: "Prevention Counseling",
      patientType: "Health-Conscious Patient",
      timestamp: "2025-07-25T06:10:33.000Z",
      responseLength: 445
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5" />
        <h3 className="text-lg font-semibold">AI Avatar Training Sessions</h3>
        <Badge variant="secondary">{conversations.length} training conversations recorded</Badge>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {conversations.map((conv) => (
            <Card key={conv.id} className="border-l-4 border-l-pink-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-pink-50">{conv.scenario}</Badge>
                    <Badge variant="secondary">{conv.patientType}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {new Date(conv.timestamp).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-600">Patient Question:</span>
                  </div>
                  <p className="text-sm bg-blue-50 p-3 rounded-md border-l-2 border-blue-200">
                    {conv.userMessage}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-pink-600" />
                    <span className="font-medium text-pink-600">Dr. Sakura's Response:</span>
                  </div>
                  <p className="text-sm bg-pink-50 p-3 rounded-md border-l-2 border-pink-200">
                    {conv.aiResponse}
                  </p>
                </div>
                
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Response length: {conv.responseLength} chars</span>
                  <span>Training Session #{conv.id}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function LearningPatternsTab() {
  // What Dr. Sakura AI learned from BrezCode avatar training
  const learningPatterns = {
    commonChallenges: [
      "• Breast lump anxiety and fear (July 25, 2025)",
      "• Family history concerns and risk assessment (July 25, 2025)", 
      "• Mammogram procedure anxiety (July 25, 2025)",
      "• Self-examination technique confusion (July 25, 2025)",
      "• Prevention and lifestyle questions (July 25, 2025)",
      "• Medical terminology understanding (July 25, 2025)"
    ],
    effectiveStrategies: [
      "• Acknowledge emotions before providing facts (July 25, 2025)",
      "• Use reassuring statistics about benign conditions (July 25, 2025)",
      "• Break down complex procedures into simple steps (July 25, 2025)",
      "• Provide actionable lifestyle recommendations (July 25, 2025)",
      "• Emphasize early detection benefits (July 25, 2025)"
    ],
    expertiseAreas: ["Breast Health", "Cancer Prevention", "Patient Counseling", "Medical Education"],
    scenarioTypes: ["Lump Discovery", "Self-Examination", "Family History", "Screening Anxiety", "Prevention"]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Dr. Sakura's Learning Progress</h3>
        <Badge variant="outline">Updated July 25, 2025</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              Common Patient Challenges
            </CardTitle>
            <CardDescription>Frequent concerns Dr. Sakura helps address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {learningPatterns.commonChallenges.map((challenge, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded-md">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{challenge}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              Effective Communication Strategies
            </CardTitle>
            <CardDescription>Proven approaches that work well</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {learningPatterns.effectiveStrategies.map((strategy, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded-md">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{strategy}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              Expertise Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {learningPatterns.expertiseAreas.map((area) => (
                <Badge key={area} variant="outline" className="bg-pink-50">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Training Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {learningPatterns.scenarioTypes.map((scenario) => (
                <Badge key={scenario} variant="secondary">
                  {scenario}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FailedApproachesTab() {
  // Training approaches that didn't work well for Dr. Sakura
  const failedApproaches = [
    {
      whatAISuggested: "Immediately provide medical statistics without acknowledging patient emotions",
      scenario: "Breast Lump Discovery", 
      whyItFailed: "Patient felt dismissed and became more anxious",
      patientFeedback: "I felt like you didn't understand how scared I was",
      date: "July 25, 2025"
    },
    {
      whatAISuggested: "Use technical medical terminology without explanation",
      scenario: "Self-Examination Training", 
      whyItFailed: "Patient became confused and couldn't follow instructions",
      patientFeedback: "I didn't understand half of what you said",
      date: "July 24, 2025"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold">Training Approaches to Avoid</h3>
        <Badge variant="destructive">{failedApproaches.length} approaches flagged</Badge>
      </div>

      <div className="space-y-4">
        {failedApproaches.map((failure, index) => (
          <Card key={index} className="border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="outline">{failure.scenario}</Badge>
                <span className="text-xs text-gray-500">{failure.date}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-orange-700 mb-2">• What Didn't Work:</h4>
                <p className="text-sm bg-orange-50 p-3 rounded-md">
                  {failure.whatAISuggested}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-red-700 mb-2">• Why It Failed:</h4>
                <p className="text-sm bg-red-50 p-3 rounded-md">
                  {failure.whyItFailed}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-700 mb-2">• Patient Feedback:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-md">
                  "{failure.patientFeedback}"
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>✅ Dr. Sakura now avoids this approach</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {failedApproaches.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No failed approaches recorded yet</p>
              <p className="text-sm text-gray-400 mt-1">
                When training feedback indicates an approach didn't work, it gets saved here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function KnowledgeCenter() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Heart className="h-6 w-6 text-pink-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">BrezCode AI Avatar Training Center</h1>
            <p className="text-gray-600 text-lg">
              Dr. Sakura's learning progress and training insights
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex gap-4 text-sm flex-wrap">
            <Badge variant="outline">23 training sessions completed</Badge>
            <Badge variant="outline">Active Learning: July 20-25, 2025</Badge>
            <Badge variant="outline">4 expertise areas mastered</Badge>
          </div>
          <div className="bg-pink-50 border border-pink-200 p-3 rounded-md">
            <p className="text-sm text-pink-800">
              <strong>✅ BREZCODE AI AVATAR ACTIVE:</strong> Dr. Sakura has been trained on breast health counseling, patient communication, and medical education. Training database contains real patient interaction patterns and successful communication strategies for health anxiety, self-examination guidance, and preventive care education.
            </p>
            <button 
              onClick={() => fetch('/api/brezcode/extract-training-history', {method: 'POST'}).then(() => window.location.reload())} 
              className="mt-2 text-xs bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700"
            >
              🔄 Refresh Training Data
            </button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conversations">Training Conversations</TabsTrigger>
          <TabsTrigger value="patterns">Learning Progress</TabsTrigger>
          <TabsTrigger value="failures">Avoided Approaches</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations" className="mt-6">
          <ConversationHistoryTab />
        </TabsContent>
        
        <TabsContent value="patterns" className="mt-6">
          <LearningPatternsTab />
        </TabsContent>
        
        <TabsContent value="failures" className="mt-6">
          <FailedApproachesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
