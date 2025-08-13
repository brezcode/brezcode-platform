import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mic, MicOff, Phone, PhoneOff, MessageCircle, Video, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AvatarSession {
  sessionId: string;
  accessToken: string;
  serverUrl: string;
}

export function AvatarChat() {
  const [session, setSession] = useState<AvatarSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('default_avatar');
  const [availableAvatars, setAvailableAvatars] = useState<any[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableAvatars();
  }, []);

  const fetchAvailableAvatars = async () => {
    try {
      const response = await fetch('/api/avatar/available');
      const data = await response.json();
      if (data.success) {
        setAvailableAvatars(data.avatars);
      }
    } catch (error) {
      console.error('Error fetching avatars:', error);
    }
  };

  const startAvatarSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/avatar/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatarId: selectedAvatar,
          language: 'en',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSession(data.session);
        toast({
          title: "Avatar Ready",
          description: "Your AI avatar assistant is now active!",
        });

        // Initialize HeyGen streaming if video is enabled
        if (isVideoCall) {
          initializeVideoStream(data.session);
        }
      } else {
        throw new Error(data.message || 'Failed to create avatar session');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start avatar session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeVideoStream = async (sessionData: AvatarSession) => {
    try {
      // This would integrate with HeyGen's streaming SDK
      // For now, we'll show a placeholder
      if (videoRef.current) {
        videoRef.current.src = `${sessionData.serverUrl}/stream?token=${sessionData.accessToken}`;
      }
    } catch (error) {
      console.error('Error initializing video stream:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !session) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/avatar/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          message: inputMessage,
          language: 'en',
        }),
      });

      const data = await response.json();
      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: data.timestamp,
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceRecording = async () => {
    if (!isRecording) {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        // Implement voice recording logic here
        toast({
          title: "Recording Started",
          description: "Speak your message...",
        });
      } catch (error) {
        toast({
          title: "Microphone Error",
          description: "Unable to access microphone",
          variant: "destructive",
        });
      }
    } else {
      // Stop recording
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Processing your voice message...",
      });
    }
  };

  const makePhoneCall = async () => {
    const phoneNumber = prompt("Enter phone number to call:");
    if (!phoneNumber) return;

    try {
      const response = await fetch('/api/voice/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          message: "Hello! This is your AI assistant calling. How can I help you today?",
          language: 'en-US',
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Call Initiated",
          description: `Calling ${phoneNumber}...`,
        });
      } else {
        throw new Error(data.message || 'Failed to make call');
      }
    } catch (error: any) {
      toast({
        title: "Call Failed",
        description: error.message || "Unable to make call",
        variant: "destructive",
      });
    }
  };

  const endSession = async () => {
    if (!session) return;

    try {
      await fetch(`/api/avatar/session/${session.sessionId}/close`, {
        method: 'POST',
      });
      setSession(null);
      setMessages([]);
      toast({
        title: "Session Ended",
        description: "Avatar session has been closed",
      });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            AI Avatar Assistant
            {session && <Badge variant="secondary">Active</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Selection */}
          {!session && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Avatar:</label>
              <select 
                value={selectedAvatar} 
                onChange={(e) => setSelectedAvatar(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="default_avatar">Default Avatar</option>
                {availableAvatars.map((avatar) => (
                  <option key={avatar.id} value={avatar.id}>
                    {avatar.name}
                  </option>
                ))}
              </select>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsVideoCall(!isVideoCall)} 
                  variant={isVideoCall ? "default" : "outline"}
                  size="sm"
                >
                  {isVideoCall ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  {isVideoCall ? 'Video On' : 'Text Only'}
                </Button>
              </div>
            </div>
          )}

          {/* Video Display */}
          {session && isVideoCall && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
              />
            </div>
          )}

          {/* Chat Messages */}
          {session && (
            <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500">
                  Start a conversation with your AI avatar assistant
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Controls */}
          {session ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={isLoading}
                />
                <Button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading}>
                  Send
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={toggleVoiceRecording} 
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isRecording ? 'Stop Recording' : 'Voice Message'}
                </Button>
                
                <Button onClick={makePhoneCall} variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                  Make Call
                </Button>
                
                <Button onClick={endSession} variant="destructive" size="sm">
                  <PhoneOff className="h-4 w-4" />
                  End Session
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={startAvatarSession} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Start Avatar Assistant
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>• <strong>Text Chat:</strong> Type messages to interact with your AI avatar</p>
          <p>• <strong>Voice Messages:</strong> Record voice messages for more natural interaction</p>
          <p>• <strong>Video Calls:</strong> Enable video to see your avatar's visual responses</p>
          <p>• <strong>Phone Calls:</strong> Make outbound calls with AI avatar voice assistance</p>
          <p>• <strong>Multi-language:</strong> Speak in your preferred language - the avatar adapts automatically</p>
        </CardContent>
      </Card>
    </div>
  );
}