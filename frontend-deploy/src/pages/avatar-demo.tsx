import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User,
  Sparkles,
  Heart,
  Clock,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AvatarDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI health assistant. I\'m here to help you with personalized breast health guidance, answer questions about wellness routines, and support your health journey. How can I help you today?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId] = useState(`session-${Date.now()}`);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if user has scrolled up to show scroll button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100;
      setShowScrollButton(!isAtBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      // Use the brand-specific AI system
      const response = await apiRequest("POST", "/api/brand-ai/chat", {
        brandId: 'brezcode', // Default brand for demo
        sessionId,
        message,
        language: 'en',
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || data.message || 'I apologize, but I couldn\'t generate a response.',
        timestamp: data.timestamp || new Date().toISOString(),
      }]);
    },
    onError: (error: any) => {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again.',
        timestamp: new Date().toISOString(),
      }]);
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to chat
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    }]);

    // Send to AI
    sendMessageMutation.mutate(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const suggestedQuestions = [
    "What are some daily exercises for breast health?",
    "How do I perform a proper self breast exam?",
    "What are the benefits of breast massage?",
    "Can you create a weekly wellness schedule for me?",
    "What lifestyle changes reduce breast cancer risk?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-blue-200">
                <AvatarImage src="/api/placeholder/80/80" alt="AI Avatar" />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  <Bot className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Health Assistant Demo</h1>
          <p className="text-gray-600">Experience personalized health guidance powered by OpenAI</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by GPT-4o
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Heart className="h-3 w-3 mr-1" />
              Health Focused
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col bg-gray-50">
              {/* WhatsApp-style Header */}
              <CardHeader className="bg-green-600 text-white border-b-0 shrink-0 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-green-200">
                      <AvatarImage src="/api/placeholder/48/48" alt="AI Avatar" />
                      <AvatarFallback className="bg-green-700 text-white">
                        <Bot className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Health Assistant</h3>
                    <p className="text-sm text-green-100">Online • Ready to help</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0 min-h-0 relative">
                {/* Messages Container */}
                <div 
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' version=\'1.1\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' viewBox=\'0 0 40 40\' width=\'40\' height=\'40\' opacity=\'0.03\'%3e%3cg%3e%3cpath d=\'M20 0L30 20L20 40L10 20z\' fill=\'%23000\'/%3e%3c/g%3e%3c/svg%3e")' }}
                >
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
                        <div className={`rounded-2xl p-3 shadow-sm ${
                          message.role === 'user' 
                            ? 'bg-green-500 text-white rounded-br-md' 
                            : 'bg-white text-gray-900 rounded-bl-md'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                            message.role === 'user' ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            <Clock className="h-3 w-3" />
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {sendMessageMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] mr-12">
                        <div className="bg-white rounded-2xl rounded-bl-md p-3 shadow-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Invisible div for scrolling to bottom */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Scroll to bottom button */}
                {showScrollButton && (
                  <Button
                    onClick={scrollToBottom}
                    className="absolute bottom-20 right-4 rounded-full w-10 h-10 bg-green-600 hover:bg-green-700 text-white shadow-lg"
                    size="icon"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                )}

                {/* Input Container */}
                <div className="p-4 bg-white border-t shrink-0">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message about health routines, self-exams, or wellness tips..."
                      disabled={sendMessageMutation.isPending}
                      className="flex-1 rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                      className="rounded-full bg-green-600 hover:bg-green-700 text-white w-10 h-10"
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Try asking:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left h-auto p-3 text-wrap"
                    onClick={() => setInputMessage(question)}
                    disabled={sendMessageMutation.isPending}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Heart className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Health Expertise</h4>
                    <p className="text-sm text-gray-600">Evidence-based breast health guidance</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Personalized</h4>
                    <p className="text-sm text-gray-600">Learns your preferences and needs</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Sparkles className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">24/7 Available</h4>
                    <p className="text-sm text-gray-600">Get support whenever you need it</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Notice */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Ready for HeyGen?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This demo uses OpenAI. The full system is ready for HeyGen avatars with video chat and voice calls.
                </p>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}