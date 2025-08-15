import { MediaResearchAPI, MediaResearchRequest, MediaResearchResponse, SuggestedResource, ResourceLibraryItem, MediaResearchConfig } from './types';

export class MediaResearchClient implements MediaResearchAPI {
  private config: MediaResearchConfig;

  constructor(config: MediaResearchConfig) {
    this.config = config;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.config.apiBaseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response;
  }

  async research(request: MediaResearchRequest): Promise<MediaResearchResponse> {
    const endpoint = this.config.customEndpoints?.research || '/api/media-research';
    const response = await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response.json();
  }

  async generateResources(researchId: string, count: number = 10): Promise<SuggestedResource[]> {
    // For now, generate mock resources - in production this would call the API
    const resourceTypes: SuggestedResource['type'][] = ['youtube', 'article', 'podcast', 'research_paper', 'blog', 'tool', 'course'];
    
    return Array.from({ length: count }, (_, i) => ({
      type: resourceTypes[Math.floor(Math.random() * resourceTypes.length)],
      url: `https://example.com/resource-${Date.now()}-${i}`,
      title: `Generated Resource ${i + 1}: Advanced Research Insights`,
      description: `Detailed resource providing insights and analysis for research topic`,
      duration: Math.random() > 0.5 ? `${Math.floor(Math.random() * 30) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined,
      author: `Expert Author ${i + 1}`,
      publishDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rating: Math.floor(Math.random() * 5) + 1,
      tags: [`tag${i}`, `research`, `insights`],
      selected: false,
    }));
  }

  async addToLibrary(researchId: string, resourceIds: string[]): Promise<{ addedToLibrary: number }> {
    const endpoint = this.config.customEndpoints?.library || `/api/media-research/${researchId}/select-resources`;
    const response = await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ selectedResourceIds: resourceIds }),
    });

    return response.json();
  }

  async getLibrary(): Promise<ResourceLibraryItem[]> {
    const endpoint = this.config.customEndpoints?.library || '/api/resource-library';
    const response = await this.makeRequest(endpoint);
    const data = await response.json();
    return data.resources || [];
  }

  async scheduleDistribution(resourceId: string, schedule: any): Promise<void> {
    const endpoint = this.config.customEndpoints?.schedule || `/api/resource-library/${resourceId}/schedule`;
    await this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  }

  updateConfig(newConfig: Partial<MediaResearchConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}