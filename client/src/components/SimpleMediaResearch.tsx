import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Video, Send, Loader2, CheckCircle, XCircle, ExternalLink, Library } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  channel: string;
  duration: string;
  views: string;
  description: string;
  thumbnail: string;
  verified: boolean;
}

interface ResearchResponse {
  videos: YouTubeVideo[];
  query: string;
  timestamp: string;
}

export default function SimpleMediaResearch() {
  const [prompt, setPrompt] = useState("");
  const [researchResults, setResearchResults] = useState<ResearchResponse | null>(null);
  const [approvedVideos, setApprovedVideos] = useState<YouTubeVideo[]>([]);
  const { toast } = useToast();

  const researchMutation = useMutation({
    mutationFn: async (searchPrompt: string) => {
      // Call the backend API to get real, verified YouTube videos
      const response = await apiRequest('/api/media-research/youtube-search', 'POST', {
        query: searchPrompt,
        maxResults: 10,
        verifyAccess: true // This tells the backend to verify each video is accessible
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to search YouTube videos');
      }

      return {
        videos: response.videos,
        query: searchPrompt,
        timestamp: new Date().toISOString()
      };
    },
    onSuccess: (data) => {
      setResearchResults(data);
      toast({
        title: "Research Complete!",
        description: `Found ${data.videos.length} credible YouTube videos from renowned KOLs.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Research Failed",
        description: error.message || "Failed to find YouTube videos",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Enter a search prompt",
        description: "Please describe what videos you're looking for",
        variant: "destructive",
      });
      return;
    }

    researchMutation.mutate(prompt.trim());
  };

  const handleVideoReview = (video: YouTubeVideo, approved: boolean) => {
    if (approved) {
      // Move to approved list
      setApprovedVideos(prev => [...prev, video]);
      toast({
        title: "Video Approved ✓",
        description: `"${video.title}" added to Resource Library`,
      });
    } else {
      toast({
        title: "Video Removed ✗",
        description: `"${video.title}" deleted from results`,
        variant: "destructive",
      });
    }

    // Remove from research results
    if (researchResults) {
      setResearchResults({
        ...researchResults,
        videos: researchResults.videos.filter(v => v.id !== video.id)
      });
    }
  };

  const getTopicCategory = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('exercise') || titleLower.includes('fitness') || titleLower.includes('workout')) {
      return 'Fitness/Exercise';
    } else if (titleLower.includes('cook') || titleLower.includes('recipe') || titleLower.includes('food')) {
      return 'Cooking/Nutrition';
    } else if (titleLower.includes('business') || titleLower.includes('marketing') || titleLower.includes('entrepreneur')) {
      return 'Business/Marketing';
    } else if (titleLower.includes('health') || titleLower.includes('wellness') || titleLower.includes('meditation')) {
      return 'Health/Wellness';
    } else if (titleLower.includes('learn') || titleLower.includes('education') || titleLower.includes('tutorial')) {
      return 'Education/Learning';
    }
    return 'General';
  };

  const groupedApprovedVideos = approvedVideos.reduce((groups, video) => {
    const category = getTopicCategory(video.title);
    if (!groups[category]) groups[category] = [];
    groups[category].push(video);
    return groups;
  }, {} as Record<string, YouTubeVideo[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Video className="h-6 w-6 text-red-600" />
          Simple YouTube Research
        </h2>
        <p className="text-muted-foreground mt-1">
          Find credible YouTube videos from renowned KOLs - Just enter what you're looking for
        </p>
      </div>

      {/* Step 1: Research Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Step 1: Enter Your Search
          </CardTitle>
          <CardDescription>
            Describe the type of YouTube videos you want to find
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Search Prompt</Label>
              <Input
                id="prompt"
                placeholder="e.g., 10mins exercise video for women without equipment"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={researchMutation.isPending}
              className="w-full"
            >
              {researchMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding Videos...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Start Research
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Step 2: Review Videos */}
      {researchResults && researchResults.videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Step 2: Review Videos ({researchResults.videos.length} found)
            </CardTitle>
            <CardDescription>
              Click OK to approve videos for your Resource Library, or NOT OK to remove them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {researchResults.videos.map((video, index) => (
                <div key={video.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                        <Badge className="bg-red-100 text-red-800">
                          <Video className="h-3 w-3 mr-1" />
                          YouTube
                        </Badge>
                        {video.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified KOL
                          </Badge>
                        )}
                      </div>
                      
                      <h4 className="font-medium text-blue-700 hover:text-blue-800 mb-1">
                        <a href={video.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          {video.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </h4>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Channel:</strong> {video.channel}</p>
                        <p><strong>Duration:</strong> {video.duration} • {video.views}</p>
                        <p className="line-clamp-2">{video.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleVideoReview(video, true)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        OK
                      </Button>
                      <Button
                        onClick={() => handleVideoReview(video, false)}
                        size="sm"
                        variant="destructive"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        NOT OK
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Resource Library */}
      {approvedVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5" />
              Step 3: Resource Library ({approvedVideos.length} approved videos)
            </CardTitle>
            <CardDescription>
              Approved videos organized by topics - Ready for distribution pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedApprovedVideos).map(([category, videos]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                      {category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">({videos.length} videos)</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {videos.map((video) => (
                      <div key={video.id} className="border rounded-lg p-3 bg-green-50">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Ready for Distribution
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium text-sm text-blue-700 hover:text-blue-800 mb-1">
                          <a href={video.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            {video.title}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </h4>
                        
                        <div className="text-xs text-muted-foreground">
                          <p><strong>{video.channel}</strong> • {video.duration} • {video.views}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border">
                <p className="text-sm text-blue-800">
                  <strong>📊 Distribution Pipeline:</strong> These approved videos are now ready for automated distribution to users. 
                  They are categorized by topic for targeted delivery based on user interests and preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!researchResults && !researchMutation.isPending && (
        <Card className="text-center py-12">
          <CardContent>
            <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Find Great Videos</h3>
            <p className="text-muted-foreground">
              Enter a search prompt above to find credible YouTube videos from renowned KOLs
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}