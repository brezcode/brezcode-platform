import { useState } from "react";
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
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  Settings, 
  Plus,
  Building2,
  User,
  Zap,
  Target,
  Mic,
  Video,
  Phone,
  Mail,
  MessageCircle,
  Globe
} from "lucide-react";
import { Link } from "wouter";

interface Business {
  id: number;
  name: string;
  industry: string;
  description: string;
  isActive: boolean;
}

interface AIAssistant {
  id: number;
  businessId: number | null;
  name: string;
  description: string;
  personality: string;
  expertise: string[];
  channels: string[];
  isActive: boolean;
}

export default function AvatarSetup() {
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [assistantType, setAssistantType] = useState<'personal' | 'business'>('personal');
  const [currentStep, setCurrentStep] = useState(1);
  const queryClient = useQueryClient();

  // Fetch user's businesses (mock data for now)
  const { data: businesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ["/api/user/businesses"],
    queryFn: async () => {
      // Mock data - in production this would come from the API
      return [
        {
          id: 1,
          name: "BrezCode Health",
          industry: "Health & Wellness",
          description: "AI-powered health assessments and coaching",
          isActive: true
        },
        {
          id: 2,
          name: "TechConsult Pro",
          industry: "Technology Consulting", 
          description: "IT consulting and digital transformation",
          isActive: true
        }
      ];
    }
  });

  // Fetch existing assistants
  const { data: assistants = [], isLoading: assistantsLoading } = useQuery({
    queryKey: ["/api/knowledge/assistants"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/knowledge/assistants");
      return response.json();
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
      setCurrentStep(4); // Go to success step
    }
  });

  const AssistantTypeSelection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Choose Assistant Type</CardTitle>
        <CardDescription>Select whether this AI assistant will represent you personally or a specific business</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`border-2 p-4 rounded-lg cursor-pointer transition-colors ${
              assistantType === 'personal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setAssistantType('personal')}
          >
            <div className="flex items-center space-x-3 mb-3">
              <User className="h-8 w-8 text-blue-600" />
              <h3 className="font-medium">Personal Assistant</h3>
            </div>
            <p className="text-sm text-gray-600">
              Acts on your behalf for personal tasks, scheduling, and general assistance
            </p>
            <ul className="text-xs text-gray-500 mt-2 space-y-1">
              <li>• Personal productivity & scheduling</li>
              <li>• General knowledge & advice</li>
              <li>• Cross-business coordination</li>
            </ul>
          </div>

          <div 
            className={`border-2 p-4 rounded-lg cursor-pointer transition-colors ${
              assistantType === 'business' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setAssistantType('business')}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Building2 className="h-8 w-8 text-purple-600" />
              <h3 className="font-medium">Business Representative</h3>
            </div>
            <p className="text-sm text-gray-600">
              Represents a specific business with industry knowledge and brand voice
            </p>
            <ul className="text-xs text-gray-500 mt-2 space-y-1">
              <li>• Customer service & support</li>
              <li>• Sales & lead qualification</li>
              <li>• Industry-specific expertise</li>
            </ul>
          </div>
        </div>

        <Button onClick={() => setCurrentStep(2)} className="w-full">
          Continue Setup
        </Button>
      </CardContent>
    </Card>
  );

  const BusinessSelection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Select Business</CardTitle>
        <CardDescription>Choose which business this assistant will represent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {businessesLoading ? (
          <p>Loading your businesses...</p>
        ) : (
          <div className="space-y-3">
            {businesses.map((business: Business) => (
              <div 
                key={business.id}
                className={`border-2 p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedBusiness === business.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedBusiness(business.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{business.name}</h3>
                  <Badge variant="outline">{business.industry}</Badge>
                </div>
                <p className="text-sm text-gray-600">{business.description}</p>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
              <Building2 className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Don't see your business?</p>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add New Business
              </Button>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            Back
          </Button>
          <Button 
            onClick={() => setCurrentStep(3)} 
            disabled={assistantType === 'business' && !selectedBusiness}
            className="flex-1"
          >
            Continue Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AssistantConfiguration = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [personality, setPersonality] = useState("professional");
    const [expertise, setExpertise] = useState("");
    const [channels, setChannels] = useState<string[]>(['chat']);

    const toggleChannel = (channel: string) => {
      setChannels(prev => 
        prev.includes(channel) 
          ? prev.filter(c => c !== channel)
          : [...prev, channel]
      );
    };

    const handleSubmit = () => {
      createAssistantMutation.mutate({
        businessId: assistantType === 'business' ? selectedBusiness : null,
        name,
        description,
        personality,
        expertise: expertise.split(',').map(e => e.trim()).filter(Boolean),
        channels,
        isActive: true
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Configure Your AI Assistant</CardTitle>
          <CardDescription>
            Customize your assistant's personality, expertise, and communication channels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Assistant Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={assistantType === 'personal' ? "My Personal Assistant" : "Customer Support AI"}
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
                  <SelectItem value="empathetic">Empathetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this assistant will do and how it should behave..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="expertise">Areas of Expertise (comma-separated)</Label>
            <Input
              id="expertise"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder={
                assistantType === 'personal' 
                  ? "productivity, scheduling, health, finance" 
                  : "customer service, sales, product knowledge"
              }
            />
          </div>

          <div>
            <Label>Communication Channels</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {[
                { id: 'chat', label: 'Web Chat', icon: MessageSquare },
                { id: 'email', label: 'Email', icon: Mail },
                { id: 'sms', label: 'SMS', icon: MessageCircle },
                { id: 'phone', label: 'Phone', icon: Phone },
                { id: 'video', label: 'Video', icon: Video },
                { id: 'voice', label: 'Voice', icon: Mic },
                { id: 'social', label: 'Social Media', icon: Globe },
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle }
              ].map((channel) => {
                const IconComponent = channel.icon;
                return (
                  <div
                    key={channel.id}
                    className={`border p-3 rounded-lg cursor-pointer text-center transition-colors ${
                      channels.includes(channel.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => toggleChannel(channel.id)}
                  >
                    <IconComponent className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-xs">{channel.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setCurrentStep(assistantType === 'personal' ? 1 : 2)}>
              Back
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createAssistantMutation.isPending || !name}
              className="flex-1"
            >
              {createAssistantMutation.isPending ? "Creating..." : "Create AI Assistant"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SuccessStep = () => (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Bot className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle>AI Assistant Created Successfully!</CardTitle>
        <CardDescription>
          Your assistant is ready to help and can be customized further in the Knowledge Centre
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Next Steps</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Train your assistant with custom knowledge</li>
              <li>• Upload documents and procedures</li>
              <li>• Test conversations and improve responses</li>
              <li>• Deploy across your chosen channels</li>
            </ul>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/dashboard">
                <Target className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/knowledge-centre">
                <Brain className="h-4 w-4 mr-2" />
                Train Assistant
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center space-x-2 mb-6">
        <Bot className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">AI Assistant Setup</h1>
          <p className="text-gray-600">Create intelligent assistants to act on your behalf</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step}
            </div>
            {step < 4 && <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && <AssistantTypeSelection />}
      {currentStep === 2 && assistantType === 'business' && <BusinessSelection />}
      {currentStep === 3 && <AssistantConfiguration />}
      {currentStep === 4 && <SuccessStep />}

      {/* Skip to personal if step 2 not needed */}
      {currentStep === 2 && assistantType === 'personal' && setCurrentStep(3)}

      {/* Existing Assistants */}
      {currentStep === 1 && assistants.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Existing Assistants</CardTitle>
            <CardDescription>Manage your current AI assistants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assistants.map((assistant: AIAssistant) => (
                <div key={assistant.id} className="border p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{assistant.name}</h3>
                    <Badge>{assistant.personality}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{assistant.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {assistant.expertise?.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/knowledge-centre">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}