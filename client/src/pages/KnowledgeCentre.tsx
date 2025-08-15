import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Upload, 
  Download,
  Plus,
  BarChart3,
  Bot,
  FileText,
  Trash2,
  Edit,
  Star
} from "lucide-react";

interface KnowledgeEntry {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

interface AIAssistant {
  id: number;
  name: string;
  description: string;
  systemPrompt: string;
  personality: string;
  expertise: string[];
  isActive: boolean;
}

export default function KnowledgeCentre() {
  const [selectedAssistant, setSelectedAssistant] = useState<number>(1);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{user: string, assistant: string, timestamp: string}>>([]);
  const queryClient = useQueryClient();

  // Fetch knowledge entries
  const { data: knowledgeEntries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ["/api/knowledge/entries"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/knowledge/entries");
      return response.json();
    }
  });

  // Fetch AI assistants
  const { data: assistants = [], isLoading: assistantsLoading } = useQuery({
    queryKey: ["/api/knowledge/assistants"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/knowledge/assistants");
      return response.json();
    }
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ["/api/knowledge/analytics", selectedAssistant],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/knowledge/analytics?assistantId=${selectedAssistant}`);
      return response.json();
    }
  });

  // Create knowledge entry mutation
  const createEntryMutation = useMutation({
    mutationFn: async (entry: Partial<KnowledgeEntry>) => {
      const response = await apiRequest("POST", "/api/knowledge/entries", entry);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/knowledge/entries"] });
    }
  });

  // Create assistant mutation
  const createAssistantMutation = useMutation({
    mutationFn: async (assistant: Partial<AIAssistant>) => {
      const response = await apiRequest("POST", "/api/knowledge/assistants", assistant);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/knowledge/assistants"] });
    }
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async ({ message, assistantId }: { message: string; assistantId: number }) => {
      const response = await apiRequest("POST", "/api/knowledge/chat", {
        message,
        assistantId,
        includeKnowledge: true
      });
      return response.json();
    },
    onSuccess: (data) => {
      setChatHistory(prev => [...prev, {
        user: chatMessage,
        assistant: data.response,
        timestamp: data.timestamp
      }]);
      setChatMessage("");
    }
  });

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      chatMutation.mutate({ message: chatMessage, assistantId: selectedAssistant });
    }
  };

  const KnowledgeEntryForm = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("personal");
    const [tags, setTags] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      createEntryMutation.mutate({
        title,
        content,
        category,
        tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
        isActive: true
      });
      setTitle("");
      setContent("");
      setTags("");
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Knowledge entry title"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
              <SelectItem value="procedures">Procedures</SelectItem>
              <SelectItem value="faq">FAQ</SelectItem>
              <SelectItem value="products">Products</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter detailed information..."
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
          />
        </div>
        <Button type="submit" disabled={createEntryMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge Entry
        </Button>
      </form>
    );
  };

  const AssistantForm = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [systemPrompt, setSystemPrompt] = useState("");
    const [personality, setPersonality] = useState("professional");
    const [expertise, setExpertise] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      createAssistantMutation.mutate({
        name,
        description,
        systemPrompt,
        personality,
        expertise: expertise.split(",").map(exp => exp.trim()).filter(Boolean),
        isActive: true
      });
      setName("");
      setDescription("");
      setSystemPrompt("");
      setExpertise("");
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Assistant Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Personal Assistant"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the assistant's role"
          />
        </div>
        <div>
          <Label htmlFor="personality">Personality</Label>
          <Select value={personality} onValueChange={setPersonality}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="systemPrompt">System Prompt</Label>
          <Textarea
            id="systemPrompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="You are a helpful assistant that..."
            rows={3}
            required
          />
        </div>
        <div>
          <Label htmlFor="expertise">Expertise Areas (comma-separated)</Label>
          <Input
            id="expertise"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            placeholder="customer service, health, technology"
          />
        </div>
        <Button type="submit" disabled={createAssistantMutation.isPending}>
          <Bot className="h-4 w-4 mr-2" />
          Create Assistant
        </Button>
      </form>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Brain className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">AI Knowledge Centre</h1>
      </div>
      
      <p className="text-gray-600">Train AI assistants to act on your behalf with custom knowledge and expertise.</p>

      <Tabs defaultValue="chat" className="space-y-6">
        <div className="flex flex-col space-y-3">
          {/* First row of tabs */}
          <TabsList className="grid w-full grid-cols-3 h-auto p-2">
            <TabsTrigger value="chat" className="flex items-center justify-center space-x-2 py-3">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center justify-center space-x-2 py-3">
              <BookOpen className="h-4 w-4" />
              <span>Knowledge</span>
            </TabsTrigger>
            <TabsTrigger value="assistants" className="flex items-center justify-center space-x-2 py-3">
              <Bot className="h-4 w-4" />
              <span>Assistants</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Second row of tabs */}
          <TabsList className="grid w-full grid-cols-2 h-auto p-2">
            <TabsTrigger value="analytics" className="flex items-center justify-center space-x-2 py-3">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center justify-center space-x-2 py-3">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chat with AI Assistant</CardTitle>
              <CardDescription>Test and train your AI assistants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Assistant</Label>
                <Select value={selectedAssistant.toString()} onValueChange={(value) => setSelectedAssistant(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assistants.map((assistant: AIAssistant) => (
                      <SelectItem key={assistant.id} value={assistant.id.toString()}>
                        {assistant.name} - {assistant.personality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg h-96 p-4 bg-gray-50 overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <p className="text-gray-500 text-center mt-20">Start a conversation with your AI assistant</p>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="bg-blue-100 p-3 rounded-lg ml-8">
                          <p className="font-medium">You:</p>
                          <p>{chat.user}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg mr-8">
                          <p className="font-medium">Assistant:</p>
                          <p>{chat.assistant}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={chatMutation.isPending}>
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Knowledge Entry</CardTitle>
                <CardDescription>Teach your AI assistant new information</CardDescription>
              </CardHeader>
              <CardContent>
                <KnowledgeEntryForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>{knowledgeEntries.length} entries</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {entriesLoading ? (
                      <p>Loading knowledge entries...</p>
                    ) : (
                      knowledgeEntries.map((entry: KnowledgeEntry) => (
                        <div key={entry.id} className="border p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{entry.title}</h4>
                            <Badge variant="outline">{entry.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{entry.content.substring(0, 150)}...</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assistants" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create AI Assistant</CardTitle>
                <CardDescription>Configure a new AI assistant for specific tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <AssistantForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Assistants</CardTitle>
                <CardDescription>{assistants.length} active assistants</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {assistantsLoading ? (
                      <p>Loading assistants...</p>
                    ) : (
                      assistants.map((assistant: AIAssistant) => (
                        <div key={assistant.id} className="border p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{assistant.name}</h4>
                            <Badge>{assistant.personality}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{assistant.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {assistant.expertise.map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalConversations || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {analytics?.averageRating || 0}
                  <Star className="h-4 w-4 ml-1 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Knowledge Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalKnowledgeEntries || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Response Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.responseAccuracy || 0}%</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Training Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Top Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {analytics?.topCategories?.map((category: string) => (
                    <Badge key={category} variant="outline">{category}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Improvement Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {analytics?.improvementAreas?.map((area: string) => (
                    <Badge key={area} variant="secondary">{area}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>LLM Provider Settings</CardTitle>
              <CardDescription>Configure which AI models to use for your assistants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Anthropic Claude</h4>
                  <p className="text-sm text-gray-600 mb-3">Advanced reasoning and analysis</p>
                  <Badge variant="outline" className="text-green-600">
                    Connected
                  </Badge>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h4 className="font-medium mb-2">OpenAI GPT</h4>
                  <p className="text-sm text-gray-600 mb-3">Versatile language understanding</p>
                  <Badge variant="outline" className="text-green-600">
                    Connected
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Export/Import Knowledge Base</h4>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Knowledge
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Knowledge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}