import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Library, Calendar, Clock, ExternalLink, Video, FileText, MessageSquare, Globe, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ResourceLibraryItem {
  id: string;
  type: 'youtube' | 'article' | 'podcast' | 'research_paper';
  url: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration?: string;
  addedDate: string;
  researchId: string;
  researchTopic: string;
  scheduledFor: string | null;
  distributed: boolean;
}

interface ScheduleData {
  schedule: string;
  targetAudience: string;
  aiAssistantPrompt: string;
}

export default function ResourceLibraryManager() {
  const [selectedResource, setSelectedResource] = useState<ResourceLibraryItem | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    schedule: "",
    targetAudience: "",
    aiAssistantPrompt: ""
  });
  const { toast } = useToast();

  const { data: resourceLibrary, isLoading, refetch } = useQuery({
    queryKey: ['resource-library'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/resource-library");
      return response.json();
    }
  });

  const scheduleMutation = useMutation({
    mutationFn: async ({ resourceId, scheduleData }: { resourceId: string, scheduleData: ScheduleData }) => {
      const response = await apiRequest("POST", `/api/resource-library/${resourceId}/schedule`, scheduleData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Resource Scheduled",
        description: "Resource has been scheduled for distribution to frontend users.",
      });
      setSelectedResource(null);
      setScheduleData({ schedule: "", targetAudience: "", aiAssistantPrompt: "" });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Scheduling Failed",
        description: error.message || "Failed to schedule resource distribution",
        variant: "destructive",
      });
    },
  });

  const handleSchedule = (resource: ResourceLibraryItem) => {
    setSelectedResource(resource);
    setScheduleData({
      schedule: "",
      targetAudience: "",
      aiAssistantPrompt: `I found this valuable resource about ${resource.researchTopic} that might be helpful for your interests. Here's a ${resource.type === 'youtube' ? 'video' : 'resource'} that provides great insights: "${resource.title}". Check it out when you have a moment!`
    });
  };

  const handleSubmitSchedule = () => {
    if (selectedResource) {
      scheduleMutation.mutate({
        resourceId: selectedResource.id,
        scheduleData
      });
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading resource library...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Library className="h-6 w-6 text-blue-600" />
          Resource Library Manager
        </h2>
        <p className="text-muted-foreground mt-1">
          Schedule and distribute research resources to frontend users via AI assistant
        </p>
      </div>

      {/* Library Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Library className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Resources</p>
                <p className="text-2xl font-bold">{resourceLibrary?.totalCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Distribution</p>
                <p className="text-2xl font-bold">{resourceLibrary?.pendingDistribution || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">
                  {resourceLibrary?.resources?.filter((r: ResourceLibraryItem) => r.scheduledFor && !r.distributed).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Library */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5" />
              Resource Library
            </CardTitle>
            <CardDescription>
              Research resources ready for distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {resourceLibrary?.resources?.map((resource: ResourceLibraryItem) => (
                <div key={resource.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getResourceIcon(resource.type)}
                        <Badge variant="secondary" className="text-xs">
                          {resource.type.replace('_', ' ')}
                        </Badge>
                        {resource.duration && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Clock className="h-2 w-2" />
                            {resource.duration}
                          </Badge>
                        )}
                        {resource.distributed && (
                          <Badge className="text-xs bg-green-600">
                            Distributed
                          </Badge>
                        )}
                        {resource.scheduledFor && !resource.distributed && (
                          <Badge className="text-xs bg-orange-600">
                            Scheduled
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-sm text-blue-700 hover:text-blue-800 mb-1">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          {resource.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {resource.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        From: <span className="font-medium">{resource.researchTopic}</span> • 
                        Added: {new Date(resource.addedDate).toLocaleDateString()}
                      </p>
                    </div>
                    {resource.thumbnail && (
                      <img 
                        src={resource.thumbnail} 
                        alt={resource.title}
                        className="w-16 h-12 object-cover rounded border"
                      />
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {!resource.distributed && !resource.scheduledFor && (
                      <Button
                        onClick={() => handleSchedule(resource)}
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Calendar className="h-3 w-3" />
                        Schedule Distribution
                      </Button>
                    )}
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-muted-foreground">
                  <Library className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No resources in library yet</p>
                  <p className="text-sm">Resources will appear here when selected from research results</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scheduling Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Distribution
            </CardTitle>
            <CardDescription>
              Configure AI assistant distribution for selected resource
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedResource ? (
              <div className="space-y-4">
                {/* Selected Resource Info */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    {getResourceIcon(selectedResource.type)}
                    <span className="font-medium text-sm">{selectedResource.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedResource.description}</p>
                </div>

                {/* Schedule Configuration */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Schedule Type</Label>
                    <Select value={scheduleData.schedule} onValueChange={(value) => setScheduleData({ ...scheduleData, schedule: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select when to distribute" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Distribute Immediately</SelectItem>
                        <SelectItem value="next_interaction">Next User Interaction</SelectItem>
                        <SelectItem value="daily">Daily Distribution</SelectItem>
                        <SelectItem value="weekly">Weekly Distribution</SelectItem>
                        <SelectItem value="contextual">Context-Based (AI decides)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      placeholder="e.g., All users, Premium users, Health-focused users"
                      value={scheduleData.targetAudience}
                      onChange={(e) => setScheduleData({ ...scheduleData, targetAudience: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aiPrompt">AI Assistant Message</Label>
                    <Textarea
                      id="aiPrompt"
                      placeholder="Customize how the AI assistant will present this resource to users..."
                      value={scheduleData.aiAssistantPrompt}
                      onChange={(e) => setScheduleData({ ...scheduleData, aiAssistantPrompt: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSubmitSchedule}
                      disabled={scheduleMutation.isPending || !scheduleData.schedule}
                      className="flex-1"
                    >
                      {scheduleMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Schedule Distribution
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setSelectedResource(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a resource to schedule distribution</p>
                <p className="text-sm">Click "Schedule Distribution" on any resource in the library</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}