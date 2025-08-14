import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Brain, BookOpen, Target } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TrainingImpactItem {
  id: number;
  title: string;
  analysis: string;
  filename: string;
  uploadedAt: string;
}

interface TrainingImpactDisplayProps {
  avatarId: string;
}

export default function TrainingImpactDisplay({ avatarId }: TrainingImpactDisplayProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const { data: trainingImpactData, isLoading } = useQuery({
    queryKey: ['/api/avatar-knowledge', avatarId, 'training-impact'],
    queryFn: async () => {
      const response = await fetch(`/api/avatar-knowledge/${avatarId}/training-impact`);
      if (!response.ok) throw new Error('Failed to fetch training impact');
      return response.json();
    }
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleItem = (itemId: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Training Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Analyzing training impact...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const trainingImpact = trainingImpactData?.trainingImpact || {};
  const categories = Object.keys(trainingImpact);

  if (categories.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Training Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Training Impact Yet</h3>
            <p className="text-gray-600">
              Upload documents to see how they enhance the AI's knowledge and capabilities.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          Training Impact Analysis
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          See how uploaded documents enhance the AI's knowledge and response capabilities
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map(category => {
          const items: TrainingImpactItem[] = trainingImpact[category] || [];
          const isExpanded = expandedCategories[category];
          
          return (
            <Collapsible 
              key={category}
              open={isExpanded}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-emerald-600" />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{category}</h3>
                      <p className="text-sm text-gray-600">
                        {items.length} knowledge {items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="pt-2">
                <div className="ml-4 space-y-3">
                  {items.map(item => {
                    const isItemExpanded = expandedItems[item.id];
                    
                    return (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <Button
                          variant="ghost"
                          onClick={() => toggleItem(item.id)}
                          className="w-full justify-between p-4 h-auto bg-white hover:bg-blue-50 border-0"
                        >
                          <div className="text-left flex-1">
                            <h4 className="font-medium text-blue-700 hover:text-blue-800">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.filename}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(item.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {isItemExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-500 ml-2" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500 ml-2" />
                          )}
                        </Button>

                        {isItemExpanded && (
                          <div className="px-4 pb-4 bg-blue-50 border-t border-blue-100">
                            <div className="pt-3">
                              <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <Brain className="h-4 w-4 text-blue-600" />
                                What the AI Learned:
                              </h5>
                              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {item.analysis}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
}