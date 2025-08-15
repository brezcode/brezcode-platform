import { useState, useEffect, createContext, useContext } from 'react';

interface SharedServicesContext {
  currentApp: 'brezcode' | 'skincoach' | 'leadgen' | null;
  user: any;
  sharedAI: any;
  whatsappConnected: boolean;
  switchApp: (app: string) => void;
}

const SharedServicesContext = createContext<SharedServicesContext | null>(null);

export const useSharedServices = () => {
  const context = useContext(SharedServicesContext);
  if (!context) {
    throw new Error('useSharedServices must be used within SharedServicesProvider');
  }
  return context;
};

// Shared services that work across all apps
export const sharedAPI = {
  // Unified authentication
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return response.json();
    },
    register: async (userData: any) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return response.json();
    },
    getProfile: async () => {
      const response = await fetch('/api/auth/profile');
      return response.json();
    }
  },

  // Shared AI training system
  ai: {
    getKnowledge: async (query: string, app?: string) => {
      const response = await fetch('/api/ai/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, app })
      });
      return response.json();
    },
    trainAvatar: async (conversation: any, app: string) => {
      const response = await fetch('/api/ai/training/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...conversation, app })
      });
      return response.json();
    }
  },

  // WhatsApp integration (works for all apps)
  whatsapp: {
    sendMessage: async (phoneNumber: string, message: string, app: string) => {
      const response = await fetch('/api/whatsapp/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, message, app })
      });
      return response.json();
    },
    getConversations: async (app?: string) => {
      const response = await fetch(`/api/whatsapp/conversations${app ? `?app=${app}` : ''}`);
      return response.json();
    }
  },

  // App-specific APIs
  brezcode: {
    getHealthData: async () => {
      const response = await fetch('/api/brezcode/health/profile');
      return response.json();
    },
    chatWithDrSakura: async (message: string) => {
      const response = await fetch('/api/brezcode/avatar/dr-sakura/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      return response.json();
    }
  },

  skincoach: {
    analyzeSkin: async (imageData: string) => {
      const response = await fetch('/api/skincoach/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      });
      return response.json();
    },
    getRecommendations: async () => {
      const response = await fetch('/api/skincoach/recommendations');
      return response.json();
    }
  },

  leadgen: {
    getLeads: async () => {
      const response = await fetch('/api/leadgen/leads');
      return response.json();
    },
    createCampaign: async (campaignData: any) => {
      const response = await fetch('/api/leadgen/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      });
      return response.json();
    }
  }
};

// Analytics that work across all apps
export const sharedAnalytics = {
  track: (event: string, properties: any, app: string) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        properties: { ...properties, app },
        timestamp: new Date().toISOString()
      })
    });
  },

  identifyUser: (userId: string, traits: any) => {
    fetch('/api/analytics/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, traits })
    });
  }
};