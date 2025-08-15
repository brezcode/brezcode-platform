import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Heart, 
  ChevronLeft,
  ShoppingBag,
  Camera,
  Calendar,
  Info,
  Loader2
} from 'lucide-react';
import { useLocation } from 'wouter';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    products?: any[];
    recommendations?: string[];
  };
}

export default function SkinCoachChat() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock user context
  const [userContext] = useState({
    name: 'Sarah',
    recentAnalysis: {
      overall_score: 78,
      main_concerns: ['Dark spots', 'Dehydration'],
      skin_type: 'Combination'
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize conversation with welcome message
    if (!conversationStarted) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hi ${userContext.name}! 👋 I'm Dr. Sophia, your AI dermatology coach. I've reviewed your recent skin analysis and I'm here to help you achieve your skincare goals.\n\nBased on your analysis, I see your main concerns are dark spots and dehydration, with an overall skin health score of ${userContext.recentAnalysis.overall_score}/100. What would you like to discuss today?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
      setConversationStarted(true);
    }
  }, [conversationStarted, userContext]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate mock AI response based on user input
      const aiResponse = generateMockResponse(inputValue, userContext);
      
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        metadata: aiResponse.metadata,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (userInput: string, context: any) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('dark spot') || input.includes('pigmentation')) {
      return {
        content: `Great question about dark spots! Based on your skin analysis showing dark spot concerns, I recommend a targeted approach:\n\n🌟 **Morning Routine:**\n• Vitamin C serum (15-20% L-ascorbic acid)\n• Broad-spectrum SPF 30+ (crucial for preventing new spots)\n\n🌙 **Evening Routine:**\n• Gentle exfoliation with AHA/BHA 2-3x per week\n• Niacinamide serum to reduce melanin transfer\n\nFor your combination skin type, start slowly with one new product every 2 weeks. Would you like specific product recommendations within your budget range?`,
        metadata: {
          recommendations: [
            'Start with vitamin C serum in the morning',
            'Never skip sunscreen - it prevents new dark spots',
            'Consider professional treatments like chemical peels after 3 months'
          ]
        }
      };
    }

    if (input.includes('routine') || input.includes('products')) {
      return {
        content: `Perfect! Let me create a personalized routine for your combination skin with dark spot and dehydration concerns:\n\n**🌅 MORNING (5-7 minutes)**\n1. Gentle foaming cleanser\n2. Vitamin C serum (wait 5 min)\n3. Hyaluronic acid serum\n4. Light moisturizer for combination skin\n5. Broad-spectrum SPF 30+\n\n**🌙 EVENING (5-8 minutes)**\n1. Same gentle cleanser\n2. Treatment (alternate: AHA one night, niacinamide the next)\n3. Hyaluronic acid serum\n4. Richer night moisturizer\n\nShall I recommend specific products that work well together?`,
        metadata: {
          products: [
            { name: 'CeraVe Foaming Cleanser', price: '$14.99', reason: 'Gentle for combination skin' },
            { name: 'SkinCeuticals CE Ferulic', price: '$166', reason: 'Gold standard vitamin C for dark spots' },
            { name: 'The Ordinary Hyaluronic Acid', price: '$8.90', reason: 'Excellent hydration boost' }
          ]
        }
      };
    }

    if (input.includes('progress') || input.includes('results') || input.includes('time')) {
      return {
        content: `Excellent question about timeline! Here's what to expect with consistent routine:\n\n**📅 REALISTIC TIMELINE:**\n• **Week 1-2:** Skin adjusts, may see initial hydration improvement\n• **Week 4-6:** Texture improvements, less dehydration\n• **Week 8-12:** Dark spots start to lighten (10-20% improvement)\n• **Month 3-6:** Significant dark spot reduction (40-60%)\n\n**💡 PROGRESS TIPS:**\n• Take weekly photos in same lighting\n• Track hydration levels daily\n• Note any irritation immediately\n\nRemember: skin renewal takes 28 days, so be patient! Would you like me to set up progress tracking reminders?`,
        metadata: {
          recommendations: [
            'Take progress photos weekly',
            'Be consistent for at least 8 weeks',
            'Expect gradual improvement, not overnight results'
          ]
        }
      };
    }

    if (input.includes('budget') || input.includes('cost') || input.includes('expensive')) {
      return {
        content: `I understand budget is important! Let me suggest an effective routine at different price points:\n\n**💰 BUDGET OPTION ($30-50/month):**\n• CeraVe Cleanser: $14.99\n• The Ordinary Vitamin C: $8.90\n• The Ordinary Hyaluronic Acid: $8.90\n• CeraVe AM/PM Moisturizers: $32 (both)\n\n**⭐ BEST VALUE ($60-80/month):**\nSame base + upgrade to better vitamin C serum\n\n**🏆 PREMIUM ($100+/month):**\nProfessional-grade ingredients for faster results\n\nWhich budget range works best for you? I can create a specific shopping list!`,
        metadata: {
          products: [
            { name: 'The Ordinary Vitamin C 23%', price: '$8.90', reason: 'Budget-friendly vitamin C option' },
            { name: 'CeraVe Foaming Cleanser', price: '$14.99', reason: 'Great value gentle cleanser' }
          ]
        }
      };
    }

    // Default response
    return {
      content: `That's a thoughtful question! Based on your skin profile (combination skin with dark spots and dehydration concerns), I'd love to help you with that.\n\nTo give you the most accurate advice, could you tell me more about:\n• Your current skincare routine\n• Any products you've tried recently\n• Specific areas you'd like to improve\n\nI'm here to provide personalized, science-based recommendations that work for your skin type and lifestyle! 😊`,
      metadata: {}
    };
  };

  const quickSuggestions = [
    "What's the best routine for dark spots?",
    "How long until I see results?",
    "Budget-friendly product recommendations?",
    "Should I add retinol to my routine?"
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/skincoach/results')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Results
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dr. Sophia AI</h1>
              <p className="text-gray-600">Your Personal Dermatology Coach</p>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online
            </Badge>
          </div>
        </div>

        {/* User Context Card */}
        <Card className="mb-6 border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Latest Analysis: {userContext.recentAnalysis.overall_score}/100</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-600" />
                  <span className="text-sm">Skin Type: {userContext.recentAnalysis.skin_type}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setLocation('/skincoach/results')}>
                  <Info className="h-4 w-4 mr-1" />
                  View Full Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-0">
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={
                      message.role === 'user' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gradient-to-br from-pink-100 to-purple-100 text-purple-600'
                    }>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`max-w-md ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`p-4 rounded-2xl ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    </div>
                    
                    {/* Message Metadata */}
                    {message.metadata?.products && (
                      <div className="mt-2 space-y-2">
                        {message.metadata.products.map((product: any, index: number) => (
                          <div key={index} className="p-3 bg-white border rounded-lg shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-sm text-gray-900">{product.name}</h4>
                                <p className="text-xs text-gray-600">{product.reason}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm text-gray-900">{product.price}</p>
                                <Button size="sm" className="mt-1 h-6 px-2 text-xs">
                                  <ShoppingBag className="h-3 w-3 mr-1" />
                                  Shop
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {message.metadata?.recommendations && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Key Takeaways</span>
                        </div>
                        <ul className="space-y-1">
                          {message.metadata.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-xs text-green-700 flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100 text-purple-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-600">Dr. Sophia is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Quick Suggestions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">💡 Quick questions you might have:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your skin routine, products, or concerns..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setLocation('/skincoach/camera')}
          >
            <Camera className="h-4 w-4" />
            Take New Analysis
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setLocation('/skincoach/tracker')}
          >
            <Calendar className="h-4 w-4" />
            Track Progress
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setLocation('/skincoach/shop')}
          >
            <ShoppingBag className="h-4 w-4" />
            Shop Products
          </Button>
        </div>

        {/* Disclaimer */}
        <Alert className="mt-6 border-orange-200 bg-orange-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-orange-800 text-sm">
            Dr. Sophia is an AI assistant providing general skincare guidance. For serious skin conditions or concerns, please consult a licensed dermatologist.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}