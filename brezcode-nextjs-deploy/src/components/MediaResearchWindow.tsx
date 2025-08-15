import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, FileText, Send, Loader2, TrendingUp, Lightbulb, ExternalLink, Video, Globe, MessageSquare, Plus, CheckCircle, Library } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface MediaResearchRequest {
  prompt: string;
  researchType: string;
  contentType: string;
  tips: string;
  targetAudience: string;
  urgency: string;
}

interface SuggestedResource {
  type: 'youtube' | 'article' | 'podcast' | 'research_paper';
  url: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration?: string;
  selected?: boolean;
}

interface MediaResearchResponse {
  id: string;
  results: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    sources: string[];
    contentSuggestions: string[];
    suggestedResources: SuggestedResource[];
  };
  status: string;
}

export default function MediaResearchWindow() {
  const [formData, setFormData] = useState<MediaResearchRequest>({
    prompt: "",
    researchType: "",
    contentType: "",
    tips: "",
    targetAudience: "",
    urgency: ""
  });
  const [researchResults, setResearchResults] = useState<MediaResearchResponse | null>(null);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [resourcesGenerated, setResourcesGenerated] = useState(0);
  const { toast } = useToast();

  const researchMutation = useMutation({
    mutationFn: async (data: MediaResearchRequest) => {
      const response = await apiRequest("POST", "/api/media-research", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResearchResults(data);
      setResourcesGenerated(10); // Initial 10 resources
      toast({
        title: "Research Complete",
        description: "Your media research has been completed successfully with 10 suggested resources.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Research Failed",
        description: error.message || "Failed to complete media research",
        variant: "destructive",
      });
    },
  });

  const generateMoreResourcesMutation = useMutation({
    mutationFn: async () => {
      // Simulate generating 10 more resources
      const moreResources: SuggestedResource[] = Array.from({ length: 10 }, (_, i) => ({
        type: ['youtube', 'article', 'podcast', 'research_paper'][Math.floor(Math.random() * 4)] as any,
        url: `https://example.com/resource-${resourcesGenerated + i + 1}`,
        title: `Additional Resource ${resourcesGenerated + i + 1}: ${formData.researchType} insights`,
        description: `Extended research resource for ${formData.prompt}`,
        duration: Math.random() > 0.5 ? `${Math.floor(Math.random() * 30) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined,
        selected: false
      }));
      return moreResources;
    },
    onSuccess: (newResources) => {
      if (researchResults) {
        setResearchResults({
          ...researchResults,
          results: {
            ...researchResults.results,
            suggestedResources: [...researchResults.results.suggestedResources, ...newResources]
          }
        });
        setResourcesGenerated(prev => prev + 10);
        toast({
          title: "More Resources Generated",
          description: `Added 10 more resources. Total: ${resourcesGenerated + 10} resources available.`,
        });
      }
    },
  });

  const selectResourcesMutation = useMutation({
    mutationFn: async ({ researchId, selectedResourceIds }: { researchId: string, selectedResourceIds: string[] }) => {
      const response = await apiRequest("POST", `/api/media-research/${researchId}/select-resources`, { selectedResourceIds });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Resources Added to Library",
        description: `${data.addedToLibrary} resources have been added to the resource library for distribution.`,
      });
      setSelectedResources([]);
    },
    onError: (error: any) => {
      toast({
        title: "Selection Failed",
        description: error.message || "Failed to add resources to library",
        variant: "destructive",
      });
    },
  });

  const handleResourceSelection = (resourceUrl: string, selected: boolean) => {
    if (selected) {
      setSelectedResources(prev => [...prev, resourceUrl]);
    } else {
      setSelectedResources(prev => prev.filter(url => url !== resourceUrl));
    }
  };

  const handleAddToLibrary = () => {
    if (researchResults && selectedResources.length > 0) {
      selectResourcesMutation.mutate({
        researchId: researchResults.id,
        selectedResourceIds: selectedResources
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a research prompt",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.researchType) {
      toast({
        title: "Missing Information", 
        description: "Please select a research type",
        variant: "destructive",
      });
      return;
    }

    researchMutation.mutate(formData);
  };

  const handleReset = () => {
    setFormData({
      prompt: "",
      researchType: "",
      contentType: "",
      tips: "",
      targetAudience: "",
      urgency: ""
    });
    setResearchResults(null);
    setSelectedResources([]);
    setResourcesGenerated(0);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <Video className="h-4 w-4 text-red-600" />;
      case 'article': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'podcast': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'research_paper': return <Globe className="h-4 w-4 text-purple-600" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Search className="h-6 w-6 text-blue-600" />
          Media Research Center
        </h2>
        <p className="text-muted-foreground mt-1">
          AI-powered research to create compelling content and strategies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Research Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Research Request
            </CardTitle>
            <CardDescription>
              Specify what you want to research and how you want it analyzed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Research Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Research Prompt *</Label>
                <Textarea
                  id="prompt"
                  placeholder="What do you want to research? (e.g., 'Latest trends in social media marketing')"
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  rows={3}
                  className="min-h-[80px]"
                />
              </div>

              {/* Research Type - Simple Select */}
              <div className="space-y-2">
                <Label htmlFor="researchType">Research Type *</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.researchType}
                  onChange={(e) => setFormData({ ...formData, researchType: e.target.value })}
                >
                  <option value="">Select research type</option>
                  <option value="competitor-analysis">Competitor Analysis</option>
                  <option value="trend-research">Trend Research</option>
                  <option value="content-ideas">Content Ideas</option>
                  <option value="market-analysis">Market Analysis</option>
                  <option value="social-listening">Social Media Listening</option>
                  <option value="keyword-research">Keyword Research</option>
                </select>
              </div>

              {/* Content Type - Simple Select */}
              <div className="space-y-2">
                <Label htmlFor="contentType">Preferred Content Type</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                >
                  <option value="">Select content type (optional)</option>
                  <option value="blog-posts">Blog Posts & Articles</option>
                  <option value="social-media">Social Media Content</option>
                  <option value="video-content">Video Content</option>
                  <option value="visual-content">Visual Content & Infographics</option>
                  <option value="email-campaigns">Email Campaigns</option>
                </select>
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Small business owners, Healthcare professionals"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>

              {/* Urgency - Simple Select */}
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                >
                  <option value="">Select urgency</option>
                  <option value="low">Low Priority (1-2 weeks)</option>
                  <option value="medium">Medium Priority (3-5 days)</option>
                  <option value="high">High Priority (24-48 hours)</option>
                  <option value="urgent">Urgent (Same day)</option>
                </select>
              </div>

              {/* Tips & Special Instructions */}
              <div className="space-y-2">
                <Label htmlFor="tips">Additional Tips & Instructions</Label>
                <Textarea
                  id="tips"
                  placeholder="Any specific requirements, focus areas, or constraints?"
                  value={formData.tips}
                  onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={researchMutation.isPending}
                  className="flex-1"
                >
                  {researchMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Start Research
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Research Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Research Results
            </CardTitle>
            <CardDescription>
              AI-generated insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {researchMutation.isPending && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-sm text-muted-foreground">
                  AI is analyzing and researching your request...
                </p>
                <Progress value={33} className="mt-4" />
              </div>
            )}

            {researchResults && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Research Complete
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ID: {researchResults.id}
                  </span>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="font-semibold mb-2">Executive Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {researchResults.results.summary}
                  </p>
                </div>

                {/* Key Findings */}
                <div>
                  <h4 className="font-semibold mb-2">Key Findings</h4>
                  <ul className="space-y-1">
                    {researchResults.results.keyFindings.map((finding, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {researchResults.results.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Content Suggestions */}
                {researchResults.results.contentSuggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Content Suggestions</h4>
                    <ul className="space-y-1">
                      {researchResults.results.contentSuggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Lightbulb className="h-3 w-3 text-yellow-600 mt-1 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Resources */}
                {researchResults.results.suggestedResources && researchResults.results.suggestedResources.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Library className="h-4 w-4" />
                        Suggested Resources ({researchResults.results.suggestedResources.length})
                      </h4>
                      <div className="flex gap-2">
                        {selectedResources.length > 0 && (
                          <Button
                            onClick={handleAddToLibrary}
                            disabled={selectResourcesMutation.isPending}
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            {selectResourcesMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Library className="h-3 w-3" />
                            )}
                            Add to Library ({selectedResources.length})
                          </Button>
                        )}
                        <Button
                          onClick={() => generateMoreResourcesMutation.mutate()}
                          disabled={generateMoreResourcesMutation.isPending}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {generateMoreResourcesMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                          Generate 10 More
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {researchResults.results.suggestedResources.map((resource, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1">
                              <input
                                type="checkbox"
                                checked={selectedResources.includes(resource.url)}
                                onChange={(e) => handleResourceSelection(resource.url, e.target.checked)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getResourceIcon(resource.type)}
                                  <Badge variant="secondary" className="text-xs">
                                    {resource.type.replace('_', ' ')}
                                  </Badge>
                                  {resource.duration && (
                                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                                      <MessageSquare className="h-2 w-2" />
                                      {resource.duration}
                                    </Badge>
                                  )}
                                </div>
                                <h5 className="font-medium text-sm text-blue-700 hover:text-blue-800">
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                    {resource.title}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </h5>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {resource.description}
                                </p>
                              </div>
                            </div>
                            {resource.thumbnail && (
                              <img 
                                src={resource.thumbnail} 
                                alt={resource.title}
                                className="w-16 h-12 object-cover rounded border"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Admin Tip:</strong> Select resources to add them to your resource library. 
                        You can then schedule these resources for automatic distribution to frontend users via the AI assistant.
                        Click "Generate 10 More" to get additional resources for your research topic.
                      </p>
                    </div>
                  </div>
                )}

                {/* Sources */}
                {researchResults.results.sources.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Sources & References</h4>
                    <div className="space-y-1">
                      {researchResults.results.sources.map((source, index) => (
                        <p key={index} className="text-xs text-blue-600 underline">
                          {source}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!researchMutation.isPending && !researchResults && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Submit a research request to see results here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}