import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Search, 
  Trash2, 
  BookOpen, 
  Brain,
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface KnowledgeDocument {
  id: number;
  filename: string;
  documentType: string;
  contentCategory: string;
  fileSize: number;
  uploadedAt: string;
  isProcessed: boolean;
  processingStatus: string;
}

interface AvatarKnowledgeBaseProps {
  avatarId: string;
  avatarName: string;
}

export function AvatarKnowledgeBase({ avatarId, avatarName }: AvatarKnowledgeBaseProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('general');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch documents for this avatar
  const { data: documentsData, isLoading: documentsLoading } = useQuery({
    queryKey: ['/api/avatar-knowledge', avatarId, 'documents'],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/avatar-knowledge/${avatarId}/documents`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    }
  });

  const documents: KnowledgeDocument[] = documentsData?.documents || [];

  // Upload document mutation
  const uploadDocument = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/avatar-knowledge/${avatarId}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/avatar-knowledge', avatarId, 'documents'] });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast({
        title: "📚 Document Uploaded",
        description: `Knowledge uploaded successfully for ${avatarName}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete document mutation
  const deleteDocument = useMutation({
    mutationFn: async (documentId: number) => {
      const response = await apiRequest('DELETE', `/api/avatar-knowledge/documents/${documentId}`);
      if (!response.ok) throw new Error('Failed to delete document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/avatar-knowledge', avatarId, 'documents'] });
      toast({
        title: "🗑️ Document Deleted",
        description: "Knowledge document removed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('category', category);
    
    uploadDocument.mutate(formData);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getProcessingIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Knowledge Base</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload documents to train {avatarName}. Add product pricing, technical manuals, policies, 
          or any content you want your avatar to reference during conversations.
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Knowledge Document
          </CardTitle>
          <CardDescription>
            Supported formats: Text files, PDFs, Word documents, CSV files (max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx,.csv,.json"
                  onChange={handleFileSelect}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                >
                  <option value="general">General</option>
                  <option value="pricing">Pricing</option>
                  <option value="technical">Technical</option>
                  <option value="policy">Policy</option>
                  <option value="product">Product</option>
                  <option value="support">Support</option>
                </select>
                <Button 
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadDocument.isPending}
                  className="whitespace-nowrap"
                >
                  {uploadDocument.isPending ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
            
            {selectedFile && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">{selectedFile.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {formatFileSize(selectedFile.size)}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Knowledge Library
            <Badge variant="outline">{documents.length} documents</Badge>
          </CardTitle>
          <CardDescription>
            Documents that {avatarName} can reference during training conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading knowledge library...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents uploaded yet</p>
              <p className="text-sm text-gray-400">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">{doc.filename}</p>
                        {getProcessingIcon(doc.processingStatus)}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {doc.contentCategory}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(doc.fileSize)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={doc.processingStatus === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {doc.processingStatus}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteDocument.mutate(doc.id)}
                      disabled={deleteDocument.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Knowledge Stats */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Training Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {documents.filter(d => d.processingStatus === 'completed').length}
                </div>
                <div className="text-sm text-green-600">Documents Processed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">
                  {documents.reduce((sum, d) => sum + d.fileSize, 0) > 1024 * 1024 
                    ? `${(documents.reduce((sum, d) => sum + d.fileSize, 0) / (1024 * 1024)).toFixed(1)}MB`
                    : `${(documents.reduce((sum, d) => sum + d.fileSize, 0) / 1024).toFixed(0)}KB`
                  }
                </div>
                <div className="text-sm text-blue-600">Total Knowledge</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">
                  {new Set(documents.map(d => d.contentCategory)).size}
                </div>
                <div className="text-sm text-purple-600">Knowledge Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}