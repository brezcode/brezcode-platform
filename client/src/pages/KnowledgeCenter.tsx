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
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['/api/conversation-learning/conversations'],
    queryFn: async () => {
      // In a real implementation, this would fetch from the API
      // For demo, returning mock data structure
      return [];
    }
  });

  // Demo data representing what's actually in the database
  const demoConversations: ConversationHistory[] = [
    {
      id: 8,
      userMessage: "CORS error when making API calls from my React app to Express server",
      aiResponse: "Configure CORS middleware: 1) npm install cors, 2) app.use(cors({origin: \"http://localhost:3000\", credentials: true})), 3) Ensure preflight requests are handled, 4) Check that server runs on different port than React app",
      technology: "Express",
      problemType: "cors",
      timestamp: "2025-07-23T10:11:03.000Z",
      responseLength: 245
    },
    {
      id: 7,
      userMessage: "My async/await function returns Promise<pending> instead of actual data",
      aiResponse: "You need to await the function call: 1) await myAsyncFunction(), 2) Or use .then(): myAsyncFunction().then(data => console.log(data)), 3) Make sure calling function is also async if using await",
      technology: "JavaScript",
      problemType: "async",
      timestamp: "2025-07-23T10:11:03.000Z",
      responseLength: 242
    },
    {
      id: 6,
      userMessage: "useState not updating immediately when I call setState",
      aiResponse: "setState is asynchronous in React. Solutions: 1) Use useEffect to react to state changes, 2) Pass function to setState for current value: setState(prev => prev + 1), 3) Don't rely on state immediately after setState call",
      technology: "React",
      problemType: "state_management",
      timestamp: "2025-07-23T10:11:03.000Z",
      responseLength: 256
    },
    {
      id: 5,
      userMessage: "TypeScript error: Cannot read property of undefined. Type is object | undefined",
      aiResponse: "Handle undefined values properly: 1) Use optional chaining: obj?.property, 2) Type guards: if (obj && obj.property), 3) Nullish coalescing: obj?.property ?? defaultValue, 4) Define proper types with | undefined",
      technology: "TypeScript",
      problemType: "type_error",
      timestamp: "2025-07-23T10:11:03.000Z",
      responseLength: 222
    },
    {
      id: 4,
      userMessage: "My React component keeps re-rendering. The useEffect seems to run constantly.",
      aiResponse: "This happens when useEffect dependencies change on every render. Fix by: 1) Add all dependencies to dependency array, 2) Use useCallback for functions, 3) Use useMemo for objects, 4) Check if objects/arrays are created inside render",
      technology: "React",
      problemType: "debugging",
      timestamp: "2025-07-23T10:11:03.000Z",
      responseLength: 256
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Conversation History</h3>
        <Badge variant="secondary">{demoConversations.length} conversations</Badge>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {demoConversations.map((conv) => (
            <Card key={conv.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <Badge variant="outline">{conv.technology}</Badge>
                    <Badge variant="secondary">{conv.problemType}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {new Date(conv.timestamp).toLocaleDateString()}
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
  // Demo data representing analyzed patterns
  const learningPatterns = {
    commonMistakes: [
      "Missing dependencies in useEffect causing infinite re-renders",
      "Not awaiting async functions properly",
      "TypeScript type errors with undefined objects", 
      "Forgetting to handle CORS in Express servers",
      "Expecting useState to update immediately",
      "Creating objects inside render causing re-renders"
    ],
    successfulPatterns: [
      "Using useCallback and useMemo for optimization",
      "Proper dependency arrays in useEffect",
      "Optional chaining for undefined handling",
      "Structured CORS configuration with specific origins"
    ],
    preferredTechnologies: ["React", "TypeScript", "JavaScript", "Express"],
    mostCommonProblems: ["debugging", "type_error", "state_management", "cors", "async"]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Learning Patterns Analysis</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              Common Mistakes Identified
            </CardTitle>
            <CardDescription>Patterns the AI learned to help you avoid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {learningPatterns.commonMistakes.map((mistake, index) => (
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
              Successful Patterns
            </CardTitle>
            <CardDescription>Solutions that worked well for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {learningPatterns.successfulPatterns.map((pattern, index) => (
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
              Preferred Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {learningPatterns.preferredTechnologies.map((tech) => (
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
              Common Problem Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {learningPatterns.mostCommonProblems.map((problem) => (
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
  // Demo data representing failed approaches that are tracked
  const failedApproaches: FailedApproach[] = [
    {
      approachDescription: "Suggested using only useCallback without checking dependency array",
      technology: "React",
      failureReason: "User reported this partially worked but didn't solve root cause", 
      userFeedback: "Still getting re-renders, need to check dependencies too",
      createdAt: "2025-07-23T10:11:16.000Z"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold">Failed Approaches (Won't Repeat)</h3>
        <Badge variant="destructive">{failedApproaches.length} tracked</Badge>
      </div>

      <div className="space-y-4">
        {failedApproaches.map((failure, index) => (
          <Card key={index} className="border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="outline">{failure.technology}</Badge>
                <span className="text-xs text-gray-500">
                  {new Date(failure.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-orange-700 mb-2">Failed Approach:</h4>
                <p className="text-sm bg-orange-50 p-3 rounded-md">
                  {failure.approachDescription}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-red-700 mb-2">Why It Failed:</h4>
                <p className="text-sm bg-red-50 p-3 rounded-md">
                  {failure.failureReason}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-blue-700 mb-2">Your Feedback:</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-md">
                  {failure.userFeedback}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ System will avoid this approach in future recommendations</strong>
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
                When you report that a suggestion didn't work, it gets tracked here
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
        <h1 className="text-3xl font-bold mb-2">AI Knowledge Base Center</h1>
        <p className="text-gray-600">
          View what your AI coding assistant has learned from your conversations and interactions
        </p>
      </div>

      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conversations">Conversation History</TabsTrigger>
          <TabsTrigger value="patterns">Learning Patterns</TabsTrigger>
          <TabsTrigger value="failures">Failed Approaches</TabsTrigger>
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