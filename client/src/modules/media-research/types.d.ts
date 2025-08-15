declare module '@brezcode/media-research-module' {
  import { ReactNode, ReactElement } from 'react';

  // Configuration Types
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

  // Core Types
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

  // Widget Props
  export interface MediaResearchWidgetProps {
    className?: string;
    showTitle?: boolean;
    compact?: boolean;
    hideResourceLibrary?: boolean;
    customTheme?: {
      primaryColor?: string;
      backgroundColor?: string;
      textColor?: string;
      borderColor?: string;
    };
  }

  // Main Module Class
  export class MediaResearchModule {
    constructor(config: MediaResearchConfig);
    createWidget(props?: Partial<MediaResearchWidgetProps>): React.ComponentType;
    createProvider(): React.ComponentType<{ children: ReactNode }>;
    updateConfig(newConfig: Partial<MediaResearchConfig>): void;
    getConfig(): MediaResearchConfig;
  }

  // Widget Component
  export default function MediaResearchWidget(props: MediaResearchWidgetProps): ReactElement;

  // Provider Component
  export function MediaResearchProvider(props: {
    children: ReactNode;
    config: MediaResearchConfig;
  }): ReactElement;

  // Hooks
  export function useMediaResearch(): {
    state: any;
    actions: any;
  };

  // Factory Functions
  export function createMediaResearchModule(config: MediaResearchConfig): MediaResearchModule;

  // Default Configurations
  export const defaultConfigs: {
    development: MediaResearchConfig;
    production: MediaResearchConfig;
    minimal: MediaResearchConfig;
  };

  // Theme Presets
  export const themes: {
    light: object;
    dark: object;
    corporate: object;
    vibrant: object;
  };

  // Helper Function
  export function SimpleMediaResearchWidget(
    config: MediaResearchConfig,
    props?: Partial<MediaResearchWidgetProps>
  ): ReactElement;
}

// Integration Module
declare module '@brezcode/media-research-module/integrations' {
  import { MediaResearchConfig, MediaResearchModule } from '@brezcode/media-research-module';

  // React Hook
  export function useMediaResearchModule(config?: Partial<MediaResearchConfig>): MediaResearchModule;

  // Next.js Integration
  export class NextJSMediaResearch {
    static create(config: MediaResearchConfig): MediaResearchModule;
    static createWithEnvironment(): MediaResearchModule;
  }

  // Vanilla JS Integration
  export class VanillaMediaResearch {
    constructor(config: MediaResearchConfig);
    mount(containerId: string, props?: any): this;
    unmount(): this;
    updateConfig(config: Partial<MediaResearchConfig>): this;
  }

  // Configuration Builder
  export class ConfigurationBuilder {
    static create(): ConfigurationBuilder;
    apiUrl(url: string): ConfigurationBuilder;
    apiKey(key: string): ConfigurationBuilder;
    theme(theme: string): ConfigurationBuilder;
    enableFeatures(resourceLibrary?: boolean, scheduling?: boolean): ConfigurationBuilder;
    resourceSettings(defaultCount?: number, batchSize?: number): ConfigurationBuilder;
    callbacks(
      onComplete?: (results: any) => void,
      onResourceSelected?: (resources: any[]) => void,
      onError?: (error: Error) => void
    ): ConfigurationBuilder;
    build(): MediaResearchConfig;
  }

  // WordPress Integration
  export class WordPressMediaResearch {
    static createShortcode(config: MediaResearchConfig): string;
    static createGutenbergBlock(config: MediaResearchConfig): object;
  }

  // Iframe Integration
  export class IframeMediaResearch {
    static createIframeUrl(baseUrl: string, config: MediaResearchConfig): string;
    static createIframeHtml(iframeUrl: string, width?: number, height?: number): string;
  }

  // Usage Examples
  export const examples: {
    react: string;
    nextjs: string;
    builder: string;
  };
}