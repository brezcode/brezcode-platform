import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { 
  Search, 
  FileText, 
  Send, 
  Loader2, 
  TrendingUp, 
  Lightbulb, 
  ExternalLink, 
  Video, 
  Globe, 
  MessageSquare, 
  Plus, 
  Library 
} from "lucide-react";
import { useMediaResearch } from "../provider";
import { MediaResearchRequest, SuggestedResource } from "../types";

export interface MediaResearchWidgetProps {
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
  hideResourceLibrary?: boolean;
  customTheme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

export default function MediaResearchWidget({ 
  className = "",
  showTitle = true,
  compact = false,
  hideResourceLibrary = false,
  customTheme
}: MediaResearchWidgetProps) {
  const { state, actions } = useMediaResearch();
  
  const [formData, setFormData] = useState<MediaResearchRequest>({
    prompt: "",
    researchType: "",
    contentType: "",
    tips: "",
    targetAudience: "",
    urgency: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prompt.trim()) {
      return;
    }
    
    if (!formData.researchType) {
      return;
    }

    await actions.startResearch(formData);
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
    actions.resetResearch();
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <Video className="h-4 w-4 text-red-600" />;
      case 'article': return <FileText className="h-4 w-4 text-blue-600" />;
      case 'blog': return <FileText className="h-4 w-4 text-green-600" />;
      case 'podcast': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'research_paper': return <Globe className="h-4 w-4 text-orange-600" />;
      case 'tool': return <Globe className="h-4 w-4 text-gray-600" />;
      case 'course': return <Video className="h-4 w-4 text-indigo-600" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  const widgetStyle = customTheme ? {
    backgroundColor: customTheme.backgroundColor,
    color: customTheme.textColor,
    borderColor: customTheme.borderColor,
  } : {};

  return (
    <div className={`space-y-6 ${className}`} style={widgetStyle}>
      {/* Header */}
      {showTitle && (
        <div className="border-b pb-4">
          <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold flex items-center gap-2`}>
            <Search className={`${compact ? 'h-5 w-5' : 'h-6 w-6'} text-blue-600`} />
            Media Research Centre
          </h2>
          <p className="text-muted-foreground mt-1">
            AI-powered research to create compelling content and strategies
          </p>
        </div>
      )}

      <div className={`grid grid-cols-1 ${compact ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}>
        {/* Research Request Form */}
        <Card>
          <CardHeader className={compact ? 'pb-3' : ''}>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Research Request
            </CardTitle>
            {!compact && (
              <CardDescription>
                Specify what you want to research and how you want it analyzed
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className={`space-y-${compact ? '3' : '4'}`}>
              {/* Research Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Research Prompt *</Label>
                <Textarea
                  id="prompt"
                  placeholder="What do you want to research? (e.g., 'Latest trends in social media marketing')"
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  rows={compact ? 2 : 3}
                  className={compact ? 'min-h-[60px]' : 'min-h-[80px]'}
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

              {!compact && (
                <>
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
                </>
              )}

              {/* Action Buttons */}
              <div className={`flex gap-3 ${compact ? 'pt-2' : 'pt-4'}`}>
                <Button
                  type="submit"
                  disabled={state.isLoading}
                  className="flex-1"
                  size={compact ? 'sm' : 'default'}
                >
                  {state.isLoading ? (
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
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                  size={compact ? 'sm' : 'default'}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Research Results */}
        <Card>
          <CardHeader className={compact ? 'pb-3' : ''}>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Research Results
            </CardTitle>
            {!compact && (
              <CardDescription>
                AI-generated insights and recommendations
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {state.isLoading && (
              <div className={`text-center ${compact ? 'py-4' : 'py-8'}`}>
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-sm text-muted-foreground">
                  AI is analyzing and researching your request...
                </p>
                {!compact && <Progress value={33} className="mt-4" />}
              </div>
            )}

            {state.currentResearch && (
              <div className={`space-y-${compact ? '3' : '4'}`}>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Research Complete
                  </Badge>
                  {!compact && (
                    <span className="text-xs text-muted-foreground">
                      ID: {state.currentResearch.id}
                    </span>
                  )}
                </div>

                {/* Summary */}
                <div>
                  <h4 className="font-semibold mb-2">Executive Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {state.currentResearch.results.summary}
                  </p>
                </div>

                {/* Key Findings */}
                <div>
                  <h4 className="font-semibold mb-2">Key Findings</h4>
                  <ul className="space-y-1">
                    {state.currentResearch.results.keyFindings.slice(0, compact ? 3 : 5).map((finding, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                {!compact && (
                  <div>
                    <h4 className="font-semibold mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {state.currentResearch.results.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Resources */}
                {state.currentResearch.results.suggestedResources && 
                 state.currentResearch.results.suggestedResources.length > 0 && 
                 !hideResourceLibrary && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Library className="h-4 w-4" />
                        Resources ({state.currentResearch.results.suggestedResources.length})
                      </h4>
                      <div className="flex gap-2">
                        {state.selectedResources.length > 0 && (
                          <Button
                            onClick={actions.addToLibrary}
                            disabled={state.isLoading}
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Library className="h-3 w-3" />
                            Add ({state.selectedResources.length})
                          </Button>
                        )}
                        <Button
                          onClick={actions.generateMoreResources}
                          disabled={state.isLoading}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {state.isLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                          +10 More
                        </Button>
                      </div>
                    </div>
                    
                    <div className={`space-y-3 ${compact ? 'max-h-64' : 'max-h-96'} overflow-y-auto`}>
                      {state.currentResearch.results.suggestedResources
                        .slice(0, compact ? 5 : undefined)
                        .map((resource, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1">
                              <input
                                type="checkbox"
                                checked={state.selectedResources.includes(resource.url)}
                                onChange={(e) => actions.selectResource(resource.url, e.target.checked)}
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
                                {resource.author && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    By {resource.author}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!state.isLoading && !state.currentResearch && (
              <div className={`text-center ${compact ? 'py-4' : 'py-8'} text-muted-foreground`}>
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Submit a research request to see results here</p>
              </div>
            )}

            {state.error && (
              <div className="text-center py-8 text-red-600">
                <p>Error: {state.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}