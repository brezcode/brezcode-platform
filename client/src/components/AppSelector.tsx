import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface AppInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

const APPS: AppInfo[] = [
  {
    id: 'brezcode',
    name: 'BrezCode Health',
    description: 'AI-powered breast health coaching and wellness guidance with Dr. Sakura',
    icon: '🌸',
    route: '/health',
    color: 'bg-pink-50 hover:bg-pink-100 border-pink-200'
  },
  {
    id: 'skincoach',
    name: 'SkinCoach AI',
    description: 'Advanced skin analysis and personalized skincare recommendations',
    icon: '✨',
    route: '/skincoach',
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
  },
  {
    id: 'leadgen',
    name: 'LeadGen Business',
    description: 'AI-powered business tools and customer engagement automation',
    icon: '🚀',
    route: '/leadgen',
    color: 'bg-green-50 hover:bg-green-100 border-green-200'
  }
];

export default function AppSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to BrezCode Platform
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your AI-powered health, beauty, and business ecosystem
          </p>
          <p className="text-sm text-gray-500">
            Choose your app to get started with personalized AI assistance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {APPS.map((app) => (
            <Card 
              key={app.id} 
              className={`${app.color} transition-all duration-200 hover:shadow-lg cursor-pointer`}
              onClick={() => navigate(app.route)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{app.icon}</div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {app.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-center mb-4">
                  {app.description}
                </CardDescription>
                <Button 
                  className="w-full"
                  variant="default"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(app.route);
                  }}
                >
                  Launch {app.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="text-sm text-gray-500 mb-4">
            🔗 All apps share your account, AI training, and preferences
          </div>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <span>✅ Single Sign-On</span>
            <span>✅ Shared AI Knowledge</span>
            <span>✅ Cross-App Analytics</span>
            <span>✅ WhatsApp Integration</span>
          </div>
        </div>
      </div>
    </div>
  );
}