// Media Research Module - Main Entry Point
export * from './types';
export * from './api';
export * from './provider';
export { default as MediaResearchWidget } from './components/MediaResearchWidget';

// Main module class
import React from 'react';
import { MediaResearchProvider } from './provider';
import MediaResearchWidget, { MediaResearchWidgetProps } from './components/MediaResearchWidget';
import { MediaResearchConfig } from './types';

export class MediaResearchModule {
  private config: MediaResearchConfig;

  constructor(config: MediaResearchConfig) {
    this.config = config;
  }

  // Create a wrapped component with provider
  createWidget(props?: Partial<MediaResearchWidgetProps>) {
    const WrappedWidget = () => React.createElement(
      MediaResearchProvider,
      { config: this.config },
      React.createElement(MediaResearchWidget, props)
    );

    return WrappedWidget;
  }

  // Create provider for custom implementations
  createProvider() {
    return (props: { children: React.ReactNode }) => 
      React.createElement(MediaResearchProvider, { 
        config: this.config, 
        children: props.children 
      });
  }

  // Update configuration
  updateConfig(newConfig: Partial<MediaResearchConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): MediaResearchConfig {
    return { ...this.config };
  }
}

// Factory function for easy initialization
export function createMediaResearchModule(config: MediaResearchConfig): MediaResearchModule {
  return new MediaResearchModule(config);
}

// Default configurations for different environments
export const defaultConfigs = {
  development: {
    apiBaseUrl: 'http://localhost:5000',
    theme: 'light' as const,
    enableResourceLibrary: true,
    enableScheduling: true,
    defaultResourceCount: 10,
    resourcesPerBatch: 10,
  },
  production: {
    apiBaseUrl: '', // Should be set by the consuming app
    theme: 'light' as const,
    enableResourceLibrary: true,
    enableScheduling: true,
    defaultResourceCount: 10,
    resourcesPerBatch: 10,
  },
  minimal: {
    apiBaseUrl: '',
    theme: 'light' as const,
    enableResourceLibrary: false,
    enableScheduling: false,
    defaultResourceCount: 5,
    resourcesPerBatch: 5,
  }
};

// Preset themes
export const themes = {
  light: {
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderColor: '#e5e7eb',
  },
  dark: {
    primaryColor: '#60a5fa',
    backgroundColor: '#1f2937',
    textColor: '#f9fafb',
    borderColor: '#374151',
  },
  corporate: {
    primaryColor: '#059669',
    backgroundColor: '#ffffff',
    textColor: '#111827',
    borderColor: '#d1d5db',
  },
  vibrant: {
    primaryColor: '#7c3aed',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderColor: '#c4b5fd',
  }
};

// Helper function to create a simple widget without provider wrapper (for single use)
export function SimpleMediaResearchWidget(config: MediaResearchConfig, props?: Partial<MediaResearchWidgetProps>) {
  return React.createElement(
    MediaResearchProvider,
    { config },
    React.createElement(MediaResearchWidget, props)
  );
}