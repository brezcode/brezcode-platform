import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Upload, 
  Settings, 
  Database, 
  Bot,
  FileText,
  Brain,
  Search,
  Trash2,
  Edit,
  Save,
  Plus
} from 'lucide-react';

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  fileType?: string;
  fileName?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BrandAiConfig {
  id: string;
  brandId: string;
  assistantName: string;
  systemPrompt?: string;
  temperature: number;
  maxTokens: number;
  model: string;
  expertise: string;
  personality?: string;
  disclaimers?: string[];
  isActive: boolean;
}

export default function BrandAiAdmin() {
  const [selectedBrand] = useState('brezcode'); // For demo, using brezcode brand
  const [newKnowledge, setNewKnowledge] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');

  const queryClient = useQueryClient();

  // Fetch brand AI configuration
  const { data: aiConfig, isLoading: configLoading } = useQuery({
    queryKey: ['/api/brand-ai/config', selectedBrand],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/brand-ai/config/${selectedBrand}`);
      const data = await response.json();
      return data.config as BrandAiConfig;
    }
  });

  // Search knowledge base
  const { data: knowledgeResults, isLoading: searchLoading } = useQuery({
    queryKey: ['/api/brand-ai/knowledge', selectedBrand, searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const response = await apiRequest('GET', `/api/brand-ai/knowledge/${selectedBrand}?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      return data.knowledge as KnowledgeEntry[];
    },
    enabled: !!searchQuery
  });

  // Initialize AI configuration
  const initializeAiMutation = useMutation({
    mutationFn: async (config: { expertise: string; personality?: string }) => {
      const response = await apiRequest('POST', '/api/brand-ai/initialize', {
        brandId: selectedBrand,
        ...config
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/brand-ai/config', selectedBrand] });
    }
  });

  // Add knowledge entry
  const addKnowledgeMutation = useMutation({
    mutationFn: async (knowledge: typeof newKnowledge) => {
      const response = await apiRequest('POST', '/api/brand-ai/knowledge', {
        brandId: selectedBrand,
        title: knowledge.title,
        content: knowledge.content,
        category: knowledge.category,
        tags: knowledge.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      return response.json();
    },
    onSuccess: () => {
      setNewKnowledge({ title: '', content: '', category: 'general', tags: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/brand-ai/knowledge'] });
    }
  });

  // Upload file knowledge
  const uploadFileMutation = useMutation({
    mutationFn: async (fileData: { fileName: string; content: string; category: string }) => {
      const response = await apiRequest('POST', '/api/brand-ai/knowledge/upload', {
        brandId: selectedBrand,
        fileName: fileData.fileName,
        fileType: 'txt',
        content: fileData.content,
        category: fileData.category
      });
      return response.json();
    },
    onSuccess: () => {
      setFileName('');
      setFileContent('');
      queryClient.invalidateQueries({ queryKey: ['/api/brand-ai/knowledge'] });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  if (configLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Bot className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading AI configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand AI Management</h1>
          <p className="text-muted-foreground">
            Configure AI behavior and knowledge base for {selectedBrand}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Brand: {selectedBrand}
        </Badge>
      </div>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            File Upload
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search & Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!aiConfig ? (
                <div className="text-center py-8 space-y-4">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">No AI Configuration Found</h3>
                    <p className="text-sm text-muted-foreground">
                      Initialize AI configuration for this brand to get started.
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={() => initializeAiMutation.mutate({ expertise: 'breast_health' })}
                      disabled={initializeAiMutation.isPending}
                    >
                      Initialize for Breast Health
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => initializeAiMutation.mutate({ expertise: 'general_health' })}
                      disabled={initializeAiMutation.isPending}
                    >
                      Initialize for General Health
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assistant Name</label>
                    <Input value={aiConfig.assistantName} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expertise Area</label>
                    <Input value={aiConfig.expertise} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model</label>
                    <Input value={aiConfig.model} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Temperature</label>
                    <Input value={aiConfig.temperature} readOnly />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">System Prompt</label>
                    <Textarea value={aiConfig.systemPrompt || ''} readOnly rows={6} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Knowledge Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newKnowledge.title}
                    onChange={(e) => setNewKnowledge(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Knowledge entry title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={newKnowledge.category}
                    onValueChange={(value) => setNewKnowledge(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="health_guidance">Health Guidance</SelectItem>
                      <SelectItem value="procedures">Procedures</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="medical_info">Medical Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={newKnowledge.content}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter knowledge content..."
                  rows={8}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  value={newKnowledge.tags}
                  onChange={(e) => setNewKnowledge(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <Button 
                onClick={() => addKnowledgeMutation.mutate(newKnowledge)}
                disabled={addKnowledgeMutation.isPending || !newKnowledge.title || !newKnowledge.content}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Add Knowledge Entry
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Knowledge File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select File</label>
                <Input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </div>
              {fileName && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">File Name</label>
                    <Input value={fileName} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select defaultValue="general">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="health_guidance">Health Guidance</SelectItem>
                        <SelectItem value="procedures">Procedures</SelectItem>
                        <SelectItem value="medical_info">Medical Information</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content Preview</label>
                    <Textarea
                      value={fileContent.substring(0, 500) + (fileContent.length > 500 ? '...' : '')}
                      readOnly
                      rows={6}
                    />
                  </div>
                  <Button 
                    onClick={() => uploadFileMutation.mutate({ 
                      fileName, 
                      content: fileContent, 
                      category: 'general' 
                    })}
                    disabled={uploadFileMutation.isPending}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Knowledge File
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Knowledge Base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search knowledge base..."
                  className="flex-1"
                />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {searchLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                </div>
              )}
              
              {knowledgeResults && knowledgeResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Search Results ({knowledgeResults.length})</h3>
                  {knowledgeResults.map((entry) => (
                    <Card key={entry.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{entry.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {entry.content.substring(0, 200)}...
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">{entry.category}</Badge>
                              {entry.tags?.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {searchQuery && knowledgeResults && knowledgeResults.length === 0 && !searchLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  No knowledge entries found for "{searchQuery}"
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}