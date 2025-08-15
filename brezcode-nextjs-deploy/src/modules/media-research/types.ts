// Media Research Module Types
export interface MediaResearchConfig {
  apiBaseUrl: string;
  apiKey?: string;
  theme?: 'light' | 'dark' | 'auto';
  enableResourceLibrary?: boolean;
  enableScheduling?: boolean;
  defaultResourceCount?: number;
  resourcesPerBatch?: number;
  customEndpoints?: {
    research?: string;
    resources?: string;
    library?: string;
    schedule?: string;
  };
  onResourceSelected?: (resources: SuggestedResource[]) => void;
  onResearchComplete?: (results: MediaResearchResponse) => void;
  onError?: (error: Error) => void;
}

export interface MediaResearchRequest {
  prompt: string;
  researchType: string;
  contentType?: string;
  tips?: string;
  targetAudience?: string;
  urgency?: string;
}

export interface SuggestedResource {
  type: 'youtube' | 'article' | 'podcast' | 'research_paper' | 'blog' | 'tool' | 'course';
  url: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration?: string;
  author?: string;
  publishDate?: string;
  tags?: string[];
  rating?: number;
  selected?: boolean;
  metadata?: Record<string, any>;
}

export interface MediaResearchResponse {
  id: string;
  results: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    sources: string[];
    contentSuggestions: string[];
    suggestedResources: SuggestedResource[];
    confidence?: number;
    processingTime?: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'error';
  timestamp: string;
}

export interface ResourceLibraryItem {
  id: string;
  resource: SuggestedResource;
  addedDate: string;
  researchId: string;
  researchTopic: string;
  scheduledFor?: string;
  distributed: boolean;
  distributionStatus?: 'pending' | 'scheduled' | 'sent' | 'failed';
}

export interface MediaResearchState {
  isLoading: boolean;
  currentResearch: MediaResearchResponse | null;
  selectedResources: string[];
  resourcesGenerated: number;
  error: string | null;
  config: MediaResearchConfig;
}

export interface MediaResearchActions {
  startResearch: (request: MediaResearchRequest) => Promise<void>;
  generateMoreResources: () => Promise<void>;
  selectResource: (resourceUrl: string, selected: boolean) => void;
  addToLibrary: () => Promise<void>;
  resetResearch: () => void;
  updateConfig: (config: Partial<MediaResearchConfig>) => void;
}

export interface MediaResearchAPI {
  research: (request: MediaResearchRequest) => Promise<MediaResearchResponse>;
  generateResources: (researchId: string, count?: number) => Promise<SuggestedResource[]>;
  addToLibrary: (researchId: string, resourceIds: string[]) => Promise<{ addedToLibrary: number }>;
  getLibrary: () => Promise<ResourceLibraryItem[]>;
  scheduleDistribution: (resourceId: string, schedule: any) => Promise<void>;
}