
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  CheckCircle, 
  AlertCircle, 
  Trash2,
  Brain,
  BookOpen,
  Zap
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  extractedContent?: string;
  knowledgePoints?: string[];
  avatarType?: string;
}

interface AvatarKnowledgeUploaderProps {
  selectedAvatarType: string;
  onKnowledgeExtracted: (knowledge: any) => void;
}

export default function AvatarKnowledgeUploader({ 
  selectedAvatarType, 
  onKnowledgeExtracted 
}: AvatarKnowledgeUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const,
      progress: 0,
      avatarType: selectedAvatarType
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setIsProcessing(true);

    // Process each file
    for (const file of acceptedFiles) {
      const fileData = newFiles.find(f => f.name === file.name);
      if (!fileData) continue;

      try {
        // Update progress to uploading
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileData.id 
              ? { ...f, status: 'uploading', progress: 25 }
              : f
          )
        );

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('avatarType', selectedAvatarType);
        formData.append('fileId', fileData.id);

        // Upload and process file
        const response = await fetch('/api/avatar-training/upload-knowledge', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();

        // Update progress to processing
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileData.id 
              ? { 
                  ...f, 
                  status: 'processing', 
                  progress: 50,
                  extractedContent: result.extractedContent 
                }
              : f
          )
        );

        // Extract knowledge points using AI
        const knowledgeResponse = await fetch('/api/avatar-training/extract-knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: result.extractedContent,
            fileName: file.name,
            avatarType: selectedAvatarType,
            fileId: fileData.id
          })
        });

        const knowledgeResult = await knowledgeResponse.json();

        // Update to completed
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileData.id 
              ? { 
                  ...f, 
                  status: 'completed', 
                  progress: 100,
                  knowledgePoints: knowledgeResult.knowledgePoints 
                }
              : f
          )
        );

        // Notify parent component
        onKnowledgeExtracted({
          fileId: fileData.id,
          fileName: file.name,
          avatarType: selectedAvatarType,
          knowledgePoints: knowledgeResult.knowledgePoints,
          extractedContent: result.extractedContent
        });

        toast({
          title: "Knowledge Extracted Successfully",
          description: `${knowledgeResult.knowledgePoints?.length || 0} knowledge points extracted from ${file.name}`,
        });

      } catch (error) {
        console.error('File processing error:', error);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileData.id 
              ? { ...f, status: 'error', progress: 0 }
              : f
          )
        );
        
        toast({
          title: "Upload Failed",
          description: `Failed to process ${file.name}. Please try again.`,
          variant: "destructive"
        });
      }
    }

    setIsProcessing(false);
  }, [selectedAvatarType, onKnowledgeExtracted, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
      'application/json': ['.json'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/csv': ['.csv']
    },
    maxFileSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Brain className="h-4 w-4 text-blue-500 animate-pulse" />;
    }
  };

  const totalKnowledgePoints = uploadedFiles
    .filter(f => f.status === 'completed')
    .reduce((acc, f) => acc + (f.knowledgePoints?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Knowledge Files
          </CardTitle>
          <CardDescription>
            Upload documents, PDFs, images, and other files to train your {selectedAvatarType} avatar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">PDF</Badge>
                <Badge variant="outline">DOC/DOCX</Badge>
                <Badge variant="outline">TXT</Badge>
                <Badge variant="outline">MD</Badge>
                <Badge variant="outline">Images</Badge>
                <Badge variant="outline">CSV</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 10MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Summary */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Knowledge Base Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{uploadedFiles.length}</div>
                <div className="text-sm text-muted-foreground">Files Uploaded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {uploadedFiles.filter(f => f.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Successfully Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalKnowledgePoints}</div>
                <div className="text-sm text-muted-foreground">Knowledge Points Extracted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="font-medium text-sm">{file.name}</span>
                        {getStatusIcon(file.status)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {file.status !== 'completed' && file.status !== 'error' && (
                      <Progress value={file.progress} className="mb-2" />
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <Badge variant={
                        file.status === 'completed' ? 'default' :
                        file.status === 'error' ? 'destructive' : 'secondary'
                      }>
                        {file.status}
                      </Badge>
                    </div>
                    
                    {file.knowledgePoints && file.knowledgePoints.length > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="text-xs font-medium text-green-600 mb-1">
                          {file.knowledgePoints.length} knowledge points extracted
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {file.knowledgePoints.slice(0, 2).map((point, index) => (
                            <div key={index} className="truncate">• {point}</div>
                          ))}
                          {file.knowledgePoints.length > 2 && (
                            <div>... and {file.knowledgePoints.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
