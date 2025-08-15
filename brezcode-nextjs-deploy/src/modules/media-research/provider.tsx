import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { MediaResearchState, MediaResearchActions, MediaResearchConfig, MediaResearchRequest, SuggestedResource } from './types';
import { MediaResearchClient } from './api';

// Default configuration
const defaultConfig: MediaResearchConfig = {
  apiBaseUrl: '',
  theme: 'light',
  enableResourceLibrary: true,
  enableScheduling: true,
  defaultResourceCount: 10,
  resourcesPerBatch: 10,
};

// Initial state
const initialState: MediaResearchState = {
  isLoading: false,
  currentResearch: null,
  selectedResources: [],
  resourcesGenerated: 0,
  error: null,
  config: defaultConfig,
};

// Action types
type MediaResearchAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESEARCH_RESULTS'; payload: any }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_RESOURCE'; payload: { url: string; selected: boolean } }
  | { type: 'ADD_RESOURCES'; payload: SuggestedResource[] }
  | { type: 'RESET_RESEARCH' }
  | { type: 'UPDATE_CONFIG'; payload: Partial<MediaResearchConfig> }
  | { type: 'CLEAR_SELECTED_RESOURCES' }
  | { type: 'INCREMENT_RESOURCES_GENERATED'; payload: number };

// Reducer
function mediaResearchReducer(state: MediaResearchState, action: MediaResearchAction): MediaResearchState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_RESEARCH_RESULTS':
      return { 
        ...state, 
        currentResearch: action.payload, 
        isLoading: false, 
        error: null,
        resourcesGenerated: action.payload?.results?.suggestedResources?.length || 0
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SELECT_RESOURCE':
      const { url, selected } = action.payload;
      return {
        ...state,
        selectedResources: selected
          ? [...state.selectedResources, url]
          : state.selectedResources.filter(u => u !== url),
      };
    
    case 'ADD_RESOURCES':
      if (!state.currentResearch) return state;
      return {
        ...state,
        currentResearch: {
          ...state.currentResearch,
          results: {
            ...state.currentResearch.results,
            suggestedResources: [...state.currentResearch.results.suggestedResources, ...action.payload],
          },
        },
      };
    
    case 'INCREMENT_RESOURCES_GENERATED':
      return { ...state, resourcesGenerated: state.resourcesGenerated + action.payload };
    
    case 'CLEAR_SELECTED_RESOURCES':
      return { ...state, selectedResources: [] };
    
    case 'RESET_RESEARCH':
      return { ...initialState, config: state.config };
    
    case 'UPDATE_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } };
    
    default:
      return state;
  }
}

// Context
interface MediaResearchContextType {
  state: MediaResearchState;
  actions: MediaResearchActions;
}

const MediaResearchContext = createContext<MediaResearchContextType | undefined>(undefined);

// Provider props
interface MediaResearchProviderProps {
  children: ReactNode;
  config: MediaResearchConfig;
}

// Provider component
export function MediaResearchProvider({ children, config }: MediaResearchProviderProps) {
  const [state, dispatch] = useReducer(mediaResearchReducer, {
    ...initialState,
    config: { ...defaultConfig, ...config },
  });

  const client = new MediaResearchClient(state.config);

  const actions: MediaResearchActions = {
    startResearch: useCallback(async (request: MediaResearchRequest) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        const results = await client.research(request);
        dispatch({ type: 'SET_RESEARCH_RESULTS', payload: results });
        
        // Call onResearchComplete callback if provided
        if (state.config.onResearchComplete) {
          state.config.onResearchComplete(results);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Research failed';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        
        // Call onError callback if provided
        if (state.config.onError) {
          state.config.onError(error instanceof Error ? error : new Error(errorMessage));
        }
      }
    }, [state.config]),

    generateMoreResources: useCallback(async () => {
      if (!state.currentResearch) return;
      
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const batchSize = state.config.resourcesPerBatch || 10;
        
        const newResources = await client.generateResources(state.currentResearch.id, batchSize);
        dispatch({ type: 'ADD_RESOURCES', payload: newResources });
        dispatch({ type: 'INCREMENT_RESOURCES_GENERATED', payload: batchSize });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate more resources';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
    }, [state.currentResearch, state.config]),

    selectResource: useCallback((resourceUrl: string, selected: boolean) => {
      dispatch({ type: 'SELECT_RESOURCE', payload: { url: resourceUrl, selected } });
    }, []),

    addToLibrary: useCallback(async () => {
      if (!state.currentResearch || state.selectedResources.length === 0) return;
      
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const result = await client.addToLibrary(state.currentResearch.id, state.selectedResources);
        dispatch({ type: 'CLEAR_SELECTED_RESOURCES' });
        dispatch({ type: 'SET_LOADING', payload: false });
        
        // Call onResourceSelected callback if provided
        if (state.config.onResourceSelected && state.currentResearch) {
          const selectedResourceObjects = state.currentResearch.results.suggestedResources.filter(
            resource => state.selectedResources.includes(resource.url)
          );
          state.config.onResourceSelected(selectedResourceObjects);
        }
        
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add resources to library';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
    }, [state.currentResearch, state.selectedResources, state.config]),

    resetResearch: useCallback(() => {
      dispatch({ type: 'RESET_RESEARCH' });
    }, []),

    updateConfig: useCallback((newConfig: Partial<MediaResearchConfig>) => {
      dispatch({ type: 'UPDATE_CONFIG', payload: newConfig });
      client.updateConfig(newConfig);
    }, []),
  };

  return (
    <MediaResearchContext.Provider value={{ state, actions }}>
      {children}
    </MediaResearchContext.Provider>
  );
}

// Hook to use the context
export function useMediaResearch(): MediaResearchContextType {
  const context = useContext(MediaResearchContext);
  if (context === undefined) {
    throw new Error('useMediaResearch must be used within a MediaResearchProvider');
  }
  return context;
}