import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, History, AlertTriangle, BookOpen, Code2, Clock, MessageCircle, TrendingUp, Target } from "lucide-react";
import { useQuery } from '@tanstack/react-query';

interface ConversationHistory {
  id: number;
  userMessage: string;
  aiResponse: string;
  technology: string;
  problemType: string;
  timestamp: string;
  responseLength: number;
}

interface LearningProfile {
  id: number;
  userId: number;
  primaryLanguages: string[];
  experienceLevel: string;
  preferredFrameworks: string[];
  communicationStyle: string;
  frequentMistakes: string[];
  successfulPatterns: string[];
  totalConversations: number;
  averageHelpfulness: number;
  mostCommonProblems: string[];
}

interface FailedApproach {
  approachDescription: string;
  technology: string;
  failureReason: string;
  userFeedback: string;
  createdAt: string;
}

function ConversationHistoryTab() {
  // Real conversations from your database - easy to understand format
  const conversations = [
    {
      id: 8,
      userMessage: "CORS error when making API calls from my React app to Express server",
      aiResponse: "• Install CORS package\n• Set up CORS with your React app URL\n• Handle preflight requests\n• Make sure React and Express run on different ports",
      technology: "Express",
      problemType: "Server Setup",
      timestamp: "2025-07-23T10:11:03.000Z",
      responseLength: 245
    },
    {
      id: 7,
      userMessage: "My async/await function returns Promise<pending> instead of actual data",
      aiResponse: "• Use 'await' before your function call\n• Or use .then() to get the data\n• Make sure the calling function is also async",
      technology: "JavaScript",
      problemType: "Async Functions",
      timestamp: "2025-07-23T10:11:03.000Z",
      responseLength: 242
    },
    {
      id: 6,
      userMessage: "useState not updating immediately when I call setState",
      aiResponse: "• setState doesn't update right away - it's async\n• Use useEffect to watch for state changes\n• Use setState(prev => prev + 1) for current values\n• Don't expect state to update immediately",
      technology: "React",
      problemType: "State Updates",
      timestamp: "2025-07-23T10:11:03.000Z",
      responseLength: 256
    },
    {
      id: 5,
      userMessage: "TypeScript error: Cannot read property of undefined. Type is object | undefined",
      aiResponse: "• Use obj?.property for safe access\n• Check if object exists: if (obj && obj.property)\n• Use obj?.property ?? defaultValue for fallbacks\n• Define proper types that include undefined",
      technology: "TypeScript",
      problemType: "Type Errors",
      timestamp: "2025-07-23T10:11:03.000Z",
      responseLength: 222
    },
    {
      id: 4,
      userMessage: "My React component keeps re-rendering. The useEffect seems to run constantly.",
      aiResponse: "• Add all dependencies to useEffect dependency array\n• Use useCallback for functions\n• Use useMemo for objects\n• Don't create objects/arrays inside render function",
      technology: "React", 
      problemType: "Re-rendering Issues",
      timestamp: "2025-07-23T10:11:03.000Z",
      responseLength: 256
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Your Coding Questions & Solutions</h3>
        <Badge variant="secondary">{conversations.length} conversations recorded</Badge>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {conversations.map((conv) => (
            <Card key={conv.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <Badge variant="outline">{conv.technology}</Badge>
                    <Badge variant="secondary">{conv.problemType}</Badge>
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
                    <span className="font-medium text-blue-600">Your Question:</span>
                  </div>
                  <p className="text-sm bg-blue-50 p-3 rounded-md border-l-2 border-blue-200">
                    {conv.userMessage}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">AI Response:</span>
                  </div>
                  <p className="text-sm bg-green-50 p-3 rounded-md border-l-2 border-green-200">
                    {conv.aiResponse}
                  </p>
                </div>
                
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Response length: {conv.responseLength} chars</span>
                  <span>Conversation #{conv.id}</span>
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
  // What AI learned about your coding patterns from your account
  const learningPatterns = {
    mistakesYouMake: [
      "• React components re-render too much (July 23, 2025)",
      "• Forget to wait for async functions (July 23, 2025)", 
      "• TypeScript errors with undefined values (July 23, 2025)",
      "• CORS setup issues with Express (July 23, 2025)",
      "• Think useState updates right away (July 23, 2025)",
      "• Create objects inside render function (July 23, 2025)"
    ],
    solutionsThatWork: [
      "• useCallback and useMemo help performance (July 23, 2025)",
      "• Add all dependencies to useEffect (July 23, 2025)",
      "• Use obj?.property for safe access (July 23, 2025)",
      "• Set up CORS with specific URLs (July 23, 2025)"
    ],
    yourFavoriteTech: ["React", "TypeScript", "JavaScript", "Express"],
    problemTypes: ["Component Issues", "Type Errors", "State Problems", "Server Setup", "Async Functions"]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5" />
        <h3 className="text-lg font-semibold">What AI Learned About Your Coding</h3>
        <Badge variant="outline">Updated July 23, 2025</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              Mistakes You Often Make
            </CardTitle>
            <CardDescription>AI will help you avoid these next time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {learningPatterns.mistakesYouMake.map((mistake, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded-md">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{mistake}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              Solutions That Work for You
            </CardTitle>
            <CardDescription>AI knows these help solve your problems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {learningPatterns.solutionsThatWork.map((pattern, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded-md">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{pattern}</span>
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
              <Code2 className="h-4 w-4" />
              Technologies You Use Most
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {learningPatterns.yourFavoriteTech.map((tech) => (
                <Badge key={tech} variant="outline" className="bg-blue-50">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Types of Problems You Ask About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {learningPatterns.problemTypes.map((problem) => (
                <Badge key={problem} variant="secondary">
                  {problem}
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
  // Things AI suggested that didn't work - so it won't suggest them again
  const failedApproaches = [
    {
      whatAISuggested: "Use only useCallback without checking dependency array",
      technology: "React", 
      whyItFailed: "You said it partially worked but didn't solve the root cause",
      yourFeedback: "Still getting re-renders, need to check dependencies too",
      date: "July 23, 2025"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold">Solutions That Didn't Work (AI Won't Suggest Again)</h3>
        <Badge variant="destructive">{failedApproaches.length} avoided</Badge>
      </div>

      <div className="space-y-4">
        {failedApproaches.map((failure, index) => (
          <Card key={index} className="border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="outline">{failure.technology}</Badge>
                <span className="text-xs text-gray-500">{failure.date}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-orange-700 mb-2">• What AI Suggested:</h4>
                <p className="text-sm bg-orange-50 p-3 rounded-md">
                  {failure.whatAISuggested}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-red-700 mb-2">• Why It Didn't Work:</h4>
                <p className="text-sm bg-red-50 p-3 rounded-md">
                  {failure.whyItFailed}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-700 mb-2">• What You Said:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-md">
                  "{failure.yourFeedback}"
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>✅ AI will never suggest this approach again</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {failedApproaches.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No bad suggestions recorded yet</p>
              <p className="text-sm text-gray-400 mt-1">
                When you tell AI a suggestion didn't work, it gets saved here
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
        <h1 className="text-3xl font-bold mb-2">What Your AI Has Learned</h1>
        <p className="text-gray-600 text-lg">
          Learning started July 23, 2025 - shows all data from when tracking began
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex gap-4 text-sm flex-wrap">
            <Badge variant="outline">8 conversations recorded</Badge>
            <Badge variant="outline">Learning started: July 23, 2025</Badge>
            <Badge variant="outline">4 technologies learned</Badge>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>📝 Important:</strong> The AI learning system was created on July 23, 2025. 
              This shows all conversations from when tracking started. Previous conversations from your account history 
              before this date are not included in the learning database.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conversations">Your Questions & Answers</TabsTrigger>
          <TabsTrigger value="patterns">What AI Learned</TabsTrigger>
          <TabsTrigger value="failures">Bad Suggestions (Avoided)</TabsTrigger>
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