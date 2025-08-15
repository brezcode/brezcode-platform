// Integration helpers for different frameworks and apps

import React from 'react';
import { MediaResearchModule, defaultConfigs, themes } from './index';
import { MediaResearchConfig } from './types';

// React Hook for easy integration
export function useMediaResearchModule(config?: Partial<MediaResearchConfig>) {
  const [module] = React.useState(() => {
    const finalConfig = {
      ...defaultConfigs.development,
      ...config
    };
    return new MediaResearchModule(finalConfig);
  });

  return module;
}

// Next.js Integration
export class NextJSMediaResearch {
  static create(config: MediaResearchConfig) {
    return new MediaResearchModule(config);
  }

  static createWithEnvironment() {
    const config: MediaResearchConfig = {
      apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
      apiKey: process.env.NEXT_PUBLIC_MEDIA_RESEARCH_API_KEY,
      theme: (process.env.NEXT_PUBLIC_THEME as 'light' | 'dark') || 'light',
      enableResourceLibrary: process.env.NEXT_PUBLIC_ENABLE_RESOURCE_LIBRARY !== 'false',
      enableScheduling: process.env.NEXT_PUBLIC_ENABLE_SCHEDULING !== 'false',
      defaultResourceCount: parseInt(process.env.NEXT_PUBLIC_DEFAULT_RESOURCE_COUNT || '10'),
      resourcesPerBatch: parseInt(process.env.NEXT_PUBLIC_RESOURCES_PER_BATCH || '10'),
    };
    return new MediaResearchModule(config);
  }
}

// Vue.js Integration (composable)
export function createMediaResearchComposable() {
  return function useMediaResearch(config: Partial<MediaResearchConfig> = {}) {
    const finalConfig = {
      ...defaultConfigs.development,
      ...config
    };
    
    return new MediaResearchModule(finalConfig);
  };
}

// Vanilla JS Integration
export class VanillaMediaResearch {
  private module: MediaResearchModule;
  private container: HTMLElement | null = null;

  constructor(config: MediaResearchConfig) {
    this.module = new MediaResearchModule(config);
  }

  // Mount to DOM element (requires React to be available globally)
  mount(containerId: string, props?: any) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container element with id '${containerId}' not found`);
    }

    // This would require React to be available in the global scope
    // In a real implementation, you might want to bundle React or provide a vanilla implementation
    console.warn('Vanilla JS integration requires React to be available globally');
    
    return this;
  }

  unmount() {
    if (this.container) {
      // Unmount React component
      this.container.innerHTML = '';
    }
    return this;
  }

  updateConfig(config: Partial<MediaResearchConfig>) {
    this.module.updateConfig(config);
    return this;
  }
}

// WordPress Plugin Integration
export class WordPressMediaResearch {
  static createShortcode(config: MediaResearchConfig) {
    return `[media-research config='${JSON.stringify(config)}']`;
  }

  static createGutenbergBlock(config: MediaResearchConfig) {
    return {
      name: 'media-research/widget',
      title: 'Media Research Widget',
      category: 'widgets',
      attributes: {
        config: {
          type: 'object',
          default: config
        }
      },
      edit: function(props: any) {
        const module = new MediaResearchModule(props.attributes.config);
        return module.createWidget()();
      },
      save: function() {
        return null; // Dynamic block
      }
    };
  }
}

// Shopify Integration
export class ShopifyMediaResearch {
  static createLiquidTemplate(config: MediaResearchConfig) {
    return `
      <div id="media-research-widget"></div>
      <script>
        window.mediaResearchConfig = ${JSON.stringify(config)};
        // Load the media research widget
        if (window.MediaResearchModule) {
          const module = new window.MediaResearchModule(window.mediaResearchConfig);
          const widget = module.createWidget();
          // Render widget to DOM
        }
      </script>
    `;
  }
}

// Squarespace Integration
export class SquarespaceMediaResearch {
  static createCodeBlock(config: MediaResearchConfig) {
    return `
      <div id="media-research-widget-${Date.now()}"></div>
      <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
      <script>
        // Assuming the MediaResearchModule is loaded
        const config = ${JSON.stringify(config)};
        const module = new MediaResearchModule(config);
        const Widget = module.createWidget();
        
        ReactDOM.render(
          React.createElement(Widget),
          document.getElementById('media-research-widget-${Date.now()}')
        );
      </script>
    `;
  }
}

// Generic Iframe Integration
export class IframeMediaResearch {
  static createIframeUrl(baseUrl: string, config: MediaResearchConfig): string {
    const params = new URLSearchParams({
      config: JSON.stringify(config)
    });
    return `${baseUrl}/media-research-widget?${params.toString()}`;
  }

  static createIframeHtml(iframeUrl: string, width: number = 800, height: number = 600): string {
    return `
      <iframe 
        src="${iframeUrl}"
        width="${width}"
        height="${height}"
        frameborder="0"
        style="border: 1px solid #ddd; border-radius: 8px;"
        title="Media Research Widget">
      </iframe>
    `;
  }
}

// Configuration builder for common use cases
export class ConfigurationBuilder {
  private config: Partial<MediaResearchConfig> = {};

  static create(): ConfigurationBuilder {
    return new ConfigurationBuilder();
  }

  apiUrl(url: string): ConfigurationBuilder {
    this.config.apiBaseUrl = url;
    return this;
  }

  apiKey(key: string): ConfigurationBuilder {
    this.config.apiKey = key;
    return this;
  }

  theme(theme: keyof typeof themes): ConfigurationBuilder {
    this.config.theme = theme as 'light' | 'dark';
    return this;
  }

  enableFeatures(resourceLibrary: boolean = true, scheduling: boolean = true): ConfigurationBuilder {
    this.config.enableResourceLibrary = resourceLibrary;
    this.config.enableScheduling = scheduling;
    return this;
  }

  resourceSettings(defaultCount: number = 10, batchSize: number = 10): ConfigurationBuilder {
    this.config.defaultResourceCount = defaultCount;
    this.config.resourcesPerBatch = batchSize;
    return this;
  }

  callbacks(
    onComplete?: (results: any) => void,
    onResourceSelected?: (resources: any[]) => void,
    onError?: (error: Error) => void
  ): ConfigurationBuilder {
    if (onComplete) this.config.onResearchComplete = onComplete;
    if (onResourceSelected) this.config.onResourceSelected = onResourceSelected;
    if (onError) this.config.onError = onError;
    return this;
  }

  build(): MediaResearchConfig {
    return {
      ...defaultConfigs.development,
      ...this.config
    } as MediaResearchConfig;
  }
}

// Usage examples export
export const examples = {
  // Simple React integration
  react: `
import { MediaResearchModule, defaultConfigs } from './media-research';

function MyApp() {
  const module = new MediaResearchModule(defaultConfigs.development);
  const Widget = module.createWidget({ compact: true });
  
  return <Widget />;
}
  `,

  // Next.js integration
  nextjs: `
import { NextJSMediaResearch } from './media-research/integrations';

export default function ResearchPage() {
  const module = NextJSMediaResearch.createWithEnvironment();
  const Widget = module.createWidget();
  
  return <Widget />;
}
  `,

  // Configuration builder
  builder: `
import { ConfigurationBuilder } from './media-research/integrations';

const config = ConfigurationBuilder
  .create()
  .apiUrl('https://api.example.com')
  .theme('dark')
  .enableFeatures(true, false)
  .resourceSettings(15, 5)
  .callbacks(
    (results) => console.log('Research complete:', results),
    (resources) => console.log('Resources selected:', resources)
  )
  .build();

const module = new MediaResearchModule(config);
  `
};