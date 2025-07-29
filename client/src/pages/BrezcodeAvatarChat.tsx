import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Send, Heart, Brain, User, Stethoscope, Bot, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";

interface Message {
  id: string;
  role: 'user' | 'avatar';
  content: string;
  timestamp: string;
  qualityScores?: {
    empathy: number;
    medicalAccuracy: number;
    overall: number;
  };
}

interface AvatarResponse {
  content: string;
  avatarId: string;
  avatarName: string;
  role: string;
  qualityScores: {
    empathy: number;
    medicalAccuracy: number;
    overall: number;
  };
  timestamp: string;
}

export default function BrezcodeAvatarChat() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Get Dr. Sakura configuration
  const { data: avatarConfig, isLoading: configLoading } = useQuery({
    queryKey: ['/api/brezcode/avatar/dr-sakura/config'],
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/brezcode/avatar/dr-sakura/chat', {
        userId: 1, // Default user for demo
        message,
        conversationHistory: messages,
        context: {}
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from Dr. Sakura');
      }
      
      return response.json();
    },
    onSuccess: (data: { response: AvatarResponse }) => {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'avatar',
        content: data.response.content,
        timestamp: data.response.timestamp,
        qualityScores: data.response.qualityScores
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    },
    onError: () => {
      setIsTyping(false);
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    chatMutation.mutate(inputMessage.trim());
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (avatarConfig?.avatar && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'avatar',
        content: `Hello! I'm Dr. Sakura Wellness, your breast health coach. I'm here to provide you with evidence-based guidance, emotional support, and personalized recommendations for your breast health journey. Whether you have questions about self-examinations, screening guidelines, lifestyle factors, or simply need someone to talk to about your health concerns, I'm here to help. What would you like to discuss today?`,
        timestamp: new Date().toISOString(),
        qualityScores: { empathy: 90, medicalAccuracy: 95, overall: 92 }
      };
      setMessages([welcomeMessage]);
    }
  }, [avatarConfig, messages.length]);

  if (configLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dr. Sakura...</p>
        </div>
      </div>
    );
  }

  const avatar = avatarConfig?.avatar;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/brezcode')}
            className="mb-4"
          >
            ← Back to BrezCode
          </Button>
          
          <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{avatar?.name}</CardTitle>
                  <p className="opacity-90">{avatar?.role}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {avatar?.expertise?.slice(0, 3).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="h-[700px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Dr. Sakura Wellness Consultation
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Personalized breast health guidance with medical accuracy and empathetic support
            </p>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'avatar' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.role === 'avatar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.role === 'avatar' ? <Stethoscope className="h-4 w-4 text-pink-600" /> : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === 'avatar'
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </div>
                        
                        {message.qualityScores && message.role === 'avatar' && (
                          <div className="flex gap-3 mt-3 text-xs opacity-90">
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>Empathy: {message.qualityScores.empathy}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Brain className="w-3 h-3" />
                              <span>Medical: {message.qualityScores.medicalAccuracy}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-end">
                    <div className="flex gap-2 max-w-[80%] flex-row-reverse">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <Stethoscope className="h-4 w-4 text-pink-600" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-pink-500 text-white rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Dr. Sakura about breast health..."
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Questions to Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "How do I perform a proper breast self-examination?",
                "What should I know about mammogram screening?",
                "I found something unusual during self-exam, what should I do?",
                "How can lifestyle changes support breast health?",
                "What are the most important risk factors I should know about?",
                "How often should I be checking my breasts?"
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => {
                    setInputMessage(question);
                    handleSendMessage();
                  }}
                  className="text-left h-auto p-3 text-sm justify-start hover:bg-pink-50"
                  disabled={isTyping}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}