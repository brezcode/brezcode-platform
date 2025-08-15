
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Trash2, CheckCircle } from 'lucide-react';

interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  isActive: boolean;
}

export default function KnowledgeUploadCenter({ brandId }: { brandId: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('general');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing knowledge
  const { data: knowledgeData, isLoading } = useQuery({
    queryKey: ['/api/knowledge', brandId],
    queryFn: async () => {
      const response = await fetch(`/api/knowledge/${brandId}`);
      if (!response.ok) throw new Error('Failed to fetch knowledge');
      return response.json();
    }
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/knowledge/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: `${data.filename} uploaded with ${data.entries} knowledge entries`,
      });
      setSelectedFile(null);
      setUploadTitle('');
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge', brandId] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Deleted",
        description: "Knowledge entry removed",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge', brandId] });
    }
  });

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('brandId', brandId);
    formData.append('category', uploadCategory);
    if (uploadTitle) {
      formData.append('title', uploadTitle);
    }

    uploadMutation.mutate(formData);
  };

  const knowledge: KnowledgeEntry[] = knowledgeData?.knowledge || [];
  const activeKnowledge = knowledge.filter(k => k.isActive);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Knowledge Files</span>
          </CardTitle>
          <CardDescription>
            Upload files to share knowledge across all your AI avatars (Dr. Sakura, Customer Service, Sales)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".txt,.pdf,.docx,.json,.csv,.md"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upload-title">Title (Optional)</Label>
            <Input
              id="upload-title"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="Custom title for this knowledge"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={uploadCategory} onValueChange={setUploadCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="health">Health & Wellness</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="customer_service">Customer Service</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="policies">Policies</SelectItem>
                <SelectItem value="procedures">Procedures</SelectItem>
                <SelectItem value="faq">FAQ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleFileUpload} 
            disabled={!selectedFile || uploadMutation.isPending}
            className="w-full"
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
          </Button>
        </CardContent>
      </Card>

      {/* Knowledge Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Knowledge Library</span>
          </CardTitle>
          <CardDescription>
            Shared knowledge available to all avatars ({activeKnowledge.length} entries)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading knowledge entries...</div>
          ) : activeKnowledge.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No knowledge entries yet. Upload your first file above!
            </div>
          ) : (
            <div className="space-y-3">
              {activeKnowledge.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h4 className="font-medium">{entry.title}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {entry.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {entry.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      {entry.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(entry.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Avatar Access Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-900">Shared Knowledge System</h4>
              <p className="text-blue-700 text-sm mt-1">
                All uploaded files are automatically shared across your AI avatars:
              </p>
              <ul className="text-blue-700 text-sm mt-2 space-y-1">
                <li>• <strong>Dr. Sakura Wellness</strong> - Health coaching with your knowledge</li>
                <li>• <strong>Customer Service Avatar</strong> - Support with your policies</li>
                <li>• <strong>Sales Avatar</strong> - Sales conversations with your products</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
