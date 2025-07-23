import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code2, Brain, History, Search, Plus, BookOpen, FileText, Tag, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface CodePattern {
  id: string;
  userId: string;
  title: string;
  description: string;
  codeSnippet: string;
  language: string;
  framework?: string;
  tags: string[];
  effectiveness: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PromptStrategy {
  id: string;
  userId: string;
  title: string;
  description: string;
  promptTemplate: string;
  category: string;
  effectiveness: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface DebuggingSolution {
  id: string;
  userId: string;
  problemDescription: string;
  errorMessage?: string;
  solution: string;
  technology: string;
  tags: string[];
  effectivenessRating: number;
  createdAt: string;
  updatedAt: string;
}

const CodingAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState("patterns");
  const [searchTerm, setSearchTerm] = useState("");
  const [newPattern, setNewPattern] = useState({
    title: "",
    description: "",
    codeSnippet: "",
    language: "",
    framework: "",
    tags: [] as string[],
    tagInput: ""
  });

  const queryClient = useQueryClient();

  // Fetch code patterns
  const { data: patterns = [], isLoading: patternsLoading } = useQuery({
    queryKey: ['/api/coding-assistant/patterns'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/coding-assistant/patterns');
        if (!response.ok) throw new Error('Failed to fetch patterns');
        return await response.json();
      } catch (error) {
        console.log('Error fetching patterns:', error);
        return [];
      }
    }
  });

  // Fetch prompt strategies
  const { data: strategies = [], isLoading: strategiesLoading } = useQuery({
    queryKey: ['/api/coding-assistant/strategies'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/coding-assistant/strategies');
        if (!response.ok) throw new Error('Failed to fetch strategies');
        return await response.json();
      } catch (error) {
        console.log('Error fetching strategies:', error);
        return [];
      }
    }
  });

  // Fetch debugging solutions
  const { data: solutions = [], isLoading: solutionsLoading } = useQuery({
    queryKey: ['/api/coding-assistant/solutions'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/coding-assistant/solutions');
        if (!response.ok) throw new Error('Failed to fetch solutions');
        return await response.json();
      } catch (error) {
        console.log('Error fetching solutions:', error);
        return [];
      }
    }
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/coding-assistant/analytics'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/coding-assistant/analytics');
        if (!response.ok) throw new Error('Failed to fetch analytics');
        return await response.json();
      } catch (error) {
        console.log('Error fetching analytics:', error);
        return {
          totalPatterns: 0,
          totalStrategies: 0,
          totalSolutions: 0,
          avgEffectiveness: 50,
          recentActivity: []
        };
      }
    }
  });

  // Add new pattern mutation
  const addPatternMutation = useMutation({
    mutationFn: async (pattern: any) => {
      try {
        const response = await fetch('/api/coding-assistant/patterns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pattern)
        });
        if (!response.ok) throw new Error('Failed to add pattern');
        return await response.json();
      } catch (error) {
        console.error('Error adding pattern:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coding-assistant/patterns'] });
      setNewPattern({
        title: "",
        description: "",
        codeSnippet: "",
        language: "",
        framework: "",
        tags: [],
        tagInput: ""
      });
    },
    onError: (error: any) => {
      console.error("Error adding pattern:", error);
    }
  });

  const handleAddPattern = () => {
    if (newPattern.title && newPattern.codeSnippet) {
      addPatternMutation.mutate({
        patternName: newPattern.title,
        description: newPattern.description,
        codeExample: newPattern.codeSnippet,
        technology: newPattern.language,
        category: newPattern.framework || 'general',
        tags: newPattern.tags,
        originalPrompt: `Create a ${newPattern.language} pattern for ${newPattern.title}`
      });
    }
  };

  const handleAddTag = () => {
    if (newPattern.tagInput.trim() && !newPattern.tags.includes(newPattern.tagInput.trim())) {
      setNewPattern(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ""
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewPattern(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredPatterns = Array.isArray(patterns) ? patterns.filter((pattern: any) =>
    pattern.patternName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pattern.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pattern.technology?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pattern.tags && pattern.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  ) : [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
          <Code2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Coding Assistant</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Remember coding patterns, prompting strategies, and debugging solutions
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patterns, strategies, or solutions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="solutions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Solutions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Learning
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="mt-6">
          <div className="grid gap-4">
            {patternsLoading ? (
              <div className="text-center py-8">Loading patterns...</div>
            ) : filteredPatterns.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Code Patterns Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Start building your library of reusable code patterns
                    </p>
                    <Button onClick={() => setActiveTab("add")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Pattern
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredPatterns.map((pattern: any) => (
                <Card key={pattern.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{pattern.patternName}</CardTitle>
                        <CardDescription>{pattern.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{pattern.technology}</Badge>
                        {pattern.category && pattern.category !== 'general' && (
                          <Badge variant="outline">{pattern.category}</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 mb-4">
                      <pre className="text-sm overflow-x-auto">
                        <code>{pattern.codeExample}</code>
                      </pre>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {pattern.tags && pattern.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Used {pattern.useCount || 0} times</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(pattern.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="mt-6">
          <div className="grid gap-4">
            {strategiesLoading ? (
              <div className="text-center py-8">Loading strategies...</div>
            ) : strategies.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Prompting Strategies Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Save effective AI prompting strategies and templates
                    </p>
                    <Button onClick={() => setActiveTab("add")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              strategies.map((strategy: any) => (
                <Card key={strategy.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{strategy.strategyName}</CardTitle>
                        <CardDescription>{strategy.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{strategy.useCase}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 mb-4">
                      <pre className="text-sm whitespace-pre-wrap">
                        {strategy.promptTemplate}
                      </pre>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Effectiveness: {strategy.effectiveness || 50}%
                      </span>
                      <span className="text-sm text-gray-500">
                        Used {strategy.usageCount} times
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="solutions" className="mt-6">
          <div className="grid gap-4">
            {solutionsLoading ? (
              <div className="text-center py-8">Loading solutions...</div>
            ) : solutions.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Debugging Solutions Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Build a knowledge base of debugging solutions and fixes
                    </p>
                    <Button onClick={() => setActiveTab("add")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Solution
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              solutions.map((solution: DebuggingSolution) => (
                <Card key={solution.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{solution.problemDescription}</CardTitle>
                    <CardDescription>{solution.technology}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {solution.errorMessage && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-4">
                        <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Error Message:</h4>
                        <pre className="text-sm text-red-700 dark:text-red-300">
                          {solution.errorMessage}
                        </pre>
                      </div>
                    )}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 mb-4">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Solution:</h4>
                      <pre className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                        {solution.solution}
                      </pre>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {solution.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        Rating: {solution.effectivenessRating}/5 stars
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Learning Analytics
                </CardTitle>
                <CardDescription>
                  The AI automatically learns from coding conversations and extracts patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analytics?.totalPatterns || 0}</div>
                    <div className="text-sm text-gray-600">Auto-Extracted Patterns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analytics?.totalStrategies || 0}</div>
                    <div className="text-sm text-gray-600">Prompting Strategies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{analytics?.totalSolutions || 0}</div>
                    <div className="text-sm text-gray-600">Debugging Solutions</div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/coding-assistant/simulate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' }
                        });
                        const result = await response.json();
                        console.log('Simulated conversations:', result);
                        
                        // Refresh data
                        queryClient.invalidateQueries({ queryKey: ['/api/coding-assistant/patterns'] });
                        queryClient.invalidateQueries({ queryKey: ['/api/coding-assistant/strategies'] });
                        queryClient.invalidateQueries({ queryKey: ['/api/coding-assistant/solutions'] });
                        queryClient.invalidateQueries({ queryKey: ['/api/coding-assistant/analytics'] });
                      } catch (error) {
                        console.error('Error simulating:', error);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Simulate AI Learning
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/coding-assistant/insights');
                        const insights = await response.json();
                        console.log('AI Insights:', insights);
                        alert('Check console for detailed insights!');
                      } catch (error) {
                        console.error('Error getting insights:', error);
                      }
                    }}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Get AI Insights
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Conversation Recording</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Every coding conversation with AI is automatically recorded and analyzed
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                    <span className="text-green-600 dark:text-green-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Pattern Recognition</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      AI identifies useful code patterns, debugging strategies, and common solutions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Knowledge Base Building</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Extracted patterns are automatically added to your coding knowledge base
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Pattern Entry</CardTitle>
              <CardDescription>
                Save a reusable code pattern for future reference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="e.g., React State Management Hook"
                  value={newPattern.title}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Input
                  placeholder="Brief description of what this pattern does"
                  value={newPattern.description}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <Input
                    placeholder="e.g., JavaScript, Python, TypeScript"
                    value={newPattern.language}
                    onChange={(e) => setNewPattern(prev => ({ ...prev, language: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Framework (Optional)</label>
                  <Input
                    placeholder="e.g., React, Vue, Django"
                    value={newPattern.framework}
                    onChange={(e) => setNewPattern(prev => ({ ...prev, framework: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Code Snippet</label>
                <Textarea
                  placeholder="Paste your code here..."
                  value={newPattern.codeSnippet}
                  onChange={(e) => setNewPattern(prev => ({ ...prev, codeSnippet: e.target.value }))}
                  rows={8}
                  className="font-mono"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newPattern.tagInput}
                    onChange={(e) => setNewPattern(prev => ({ ...prev, tagInput: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {newPattern.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleAddPattern} 
                disabled={!newPattern.title || !newPattern.codeSnippet || addPatternMutation.isPending}
                className="w-full"
              >
                {addPatternMutation.isPending ? "Saving..." : "Save Pattern"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodingAssistant;