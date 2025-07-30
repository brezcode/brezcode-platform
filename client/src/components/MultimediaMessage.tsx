import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Play, Image as ImageIcon, FileText, Download, Eye } from "lucide-react";

export interface MultimediaContent {
  type: 'text' | 'image' | 'video' | 'link' | 'file' | 'audio';
  content: string;
  url?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  metadata?: {
    duration?: string;
    fileSize?: string;
    fileType?: string;
    dimensions?: string;
  };
}

interface MultimediaMessageProps {
  content: MultimediaContent[];
  textContent: string; // Fallback plain text
  className?: string;
}

export function MultimediaMessage({ content, textContent, className = "" }: MultimediaMessageProps) {
  const [expandedImages, setExpandedImages] = useState<Set<number>>(new Set());
  const [loadingMedia, setLoadingMedia] = useState<Set<number>>(new Set());

  const toggleImageExpanded = (index: number) => {
    const newExpanded = new Set(expandedImages);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedImages(newExpanded);
  };

  const handleMediaLoad = (index: number) => {
    const newLoading = new Set(loadingMedia);
    newLoading.delete(index);
    setLoadingMedia(newLoading);
  };

  const handleMediaLoadStart = (index: number) => {
    const newLoading = new Set(loadingMedia);
    newLoading.add(index);
    setLoadingMedia(newLoading);
  };

  // If no multimedia content, show plain text
  if (!content || content.length === 0) {
    return (
      <div className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${className}`}>
        {textContent}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {content.map((item, index) => (
        <div key={index}>
          {item.type === 'text' && (
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {item.content}
            </div>
          )}

          {item.type === 'image' && item.url && (
            <div className="space-y-2">
              {item.title && (
                <div className="text-sm font-medium flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  {item.title}
                </div>
              )}
              <div className="relative group">
                {loadingMedia.has(index) && (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                  </div>
                )}
                <img
                  src={item.url}
                  alt={item.title || item.description || 'Image'}
                  className={`rounded-lg max-w-full transition-all duration-200 cursor-pointer ${
                    expandedImages.has(index) ? 'max-h-none' : 'max-h-64 object-cover'
                  }`}
                  onLoad={() => handleMediaLoad(index)}
                  onLoadStart={() => handleMediaLoadStart(index)}
                  onClick={() => toggleImageExpanded(index)}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleImageExpanded(index);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {item.description && (
                <p className="text-xs text-gray-600 italic">{item.description}</p>
              )}
              {item.metadata?.dimensions && (
                <Badge variant="outline" className="text-xs">
                  {item.metadata.dimensions}
                </Badge>
              )}
            </div>
          )}

          {item.type === 'video' && item.url && (
            <div className="space-y-2">
              {item.title && (
                <div className="text-sm font-medium flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  {item.title}
                </div>
              )}
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                {item.url.includes('youtube.com/embed') ? (
                  <iframe
                    src={item.url}
                    title={item.title || 'Video'}
                    className="w-full h-64 rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : item.thumbnail ? (
                  <div className="relative group">
                    <img
                      src={item.thumbnail}
                      alt={item.title || 'Video thumbnail'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                      <Button
                        size="lg"
                        className="bg-white/90 hover:bg-white text-black rounded-full h-16 w-16 p-0"
                        onClick={() => window.open(item.url, '_blank')}
                      >
                        <Play className="w-8 h-8 ml-1" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <video
                    src={item.url}
                    controls
                    className="w-full max-h-64"
                    poster={item.thumbnail}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-gray-600 italic">{item.description}</p>
              )}
              <div className="flex gap-2">
                {item.metadata?.duration && (
                  <Badge variant="outline" className="text-xs">
                    Duration: {item.metadata.duration}
                  </Badge>
                )}
                {item.metadata?.source && (
                  <Badge variant="secondary" className="text-xs">
                    {item.metadata.source}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {item.type === 'link' && item.url && (
            <Card className="p-3 border-l-4 border-l-blue-500 bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ExternalLink className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-blue-800 truncate">
                      {item.title || item.url}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                  )}
                  <p className="text-xs text-blue-600 truncate">{item.url}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          )}

          {item.type === 'file' && item.url && (
            <Card className="p-3 border-l-4 border-l-green-500 bg-green-50/50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-green-800 truncate">
                      {item.title || 'Download File'}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-600">{item.description}</p>
                    )}
                    <div className="flex gap-2 mt-1">
                      {item.metadata?.fileType && (
                        <Badge variant="outline" className="text-xs">
                          {item.metadata.fileType}
                        </Badge>
                      )}
                      {item.metadata?.fileSize && (
                        <Badge variant="outline" className="text-xs">
                          {item.metadata.fileSize}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          )}

          {item.type === 'audio' && item.url && (
            <div className="space-y-2">
              {item.title && (
                <div className="text-sm font-medium flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  {item.title}
                </div>
              )}
              <audio controls className="w-full">
                <source src={item.url} type="audio/mpeg" />
                <source src={item.url} type="audio/wav" />
                <source src={item.url} type="audio/ogg" />
                Your browser does not support the audio element.
              </audio>
              {item.description && (
                <p className="text-xs text-gray-600 italic">{item.description}</p>
              )}
              {item.metadata?.duration && (
                <Badge variant="outline" className="text-xs">
                  {item.metadata.duration}
                </Badge>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}