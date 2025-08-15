import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Clock, User, MessageSquare, Target, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

interface SessionMessage {
  id: number;
  role: string;
  content: string;
  emotion: string | null;
  qualityScore: number | null;
  createdAt: Date;
  sequenceNumber: number;
}

interface SessionDetails {
  session: {
    sessionId: string;
    scenarioName: string;
    avatarType: string;
    status: string;
    totalMessages: number | null;
    sessionDuration: number | null;
    completedAt: Date | null;
    startedAt: Date | null;
    sessionSummary: string | null;
    keyAchievements: any;
    areasForImprovement: any;
    nextRecommendations: any;
  };
  messages: SessionMessage[];
  scenarioDetails: {
    id: string;
    name: string;
    description: string;
    objectives: string[];
    difficulty: string;
    customerPersona: string;
    customerMood: string;
  };
}

export default function TrainingSessionDetails() {
  const [match, params] = useRoute('/training-session/:sessionId');
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = params?.sessionId;

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/performance/session/${sessionId}`);
      const data = await response.json();

      if (data.success) {
        setSessionDetails(data.sessionDetails);
        console.log(`🔍 Loaded session details for ${sessionId}`);
      } else {
        setError(data.error || 'Failed to load session details');
      }
    } catch (err) {
      console.error('Error fetching session details:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number | null): string => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvatarDisplayName = (avatarType: string): string => {
    const avatarNames: { [key: string]: string } = {
      'brezcode_health_coach': 'Dr. Sakura Wellness',
      'brezcode': 'Dr. Sakura Wellness',
      'dr_sakura': 'Dr. Sakura Wellness',
      'health_coach': 'Dr. Sakura Wellness'
    };
    return avatarNames[avatarType] || 'AI Assistant';
  };

  const getMessageIcon = (role: string): string => {
    switch (role) {
      case 'customer':
      case 'patient':
        return '👥';
      case 'avatar':
        return '🏥';
      case 'system':
        return '⚙️';
      default:
        return '💬';
    }
  };

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'customer':
      case 'patient':
        return 'Patient';
      case 'avatar':
        return 'Dr. Sakura';
      case 'system':
        return 'System';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !sessionDetails) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-red-600 font-medium">Error loading session details</div>
            <p className="text-red-500 mt-2">{error || 'Session not found'}</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={fetchSessionDetails} variant="outline">
                Try Again
              </Button>
              <Link href="/performance">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Performance
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { session, messages, scenarioDetails } = sessionDetails;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/performance">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Performance
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Session Details</h1>
        <p className="text-gray-600">Complete conversation history and scenario information</p>
      </div>

      {/* Session Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {session.scenarioName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Avatar</p>
                <p className="font-medium">{getAvatarDisplayName(session.avatarType)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{formatDuration(session.sessionDuration)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Messages</p>
                <p className="font-medium">{session.totalMessages || messages.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="font-medium">{formatDate(session.completedAt)}</p>
              </div>
            </div>
          </div>

          {/* Scenario Details */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">Scenario Information</h3>
            <p className="text-blue-800 mb-3">{scenarioDetails.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Patient Profile</p>
                <p className="text-sm text-blue-800">{scenarioDetails.customerPersona}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Training Objectives</p>
                <div className="flex flex-wrap gap-1">
                  {scenarioDetails.objectives?.map((objective, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {objective}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
            {session.status === 'completed' ? 'Completed' : 'In Progress'}
          </Badge>
        </CardContent>
      </Card>

      {/* Conversation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Full Conversation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages
              .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
              .map((message, index) => (
                <div key={message.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getMessageIcon(message.role)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {getRoleDisplayName(message.role)}
                      </span>
                      {message.emotion && (
                        <Badge variant="outline" className="text-xs">
                          {message.emotion}
                        </Badge>
                      )}
                      {message.qualityScore && (
                        <Badge variant="secondary" className="text-xs">
                          Quality: {message.qualityScore}%
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      message.role === 'avatar' 
                        ? 'bg-blue-50 border-l-4 border-blue-500' 
                        : message.role === 'system'
                        ? 'bg-gray-50 border-l-4 border-gray-400'
                        : 'bg-green-50 border-l-4 border-green-500'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No messages found in this session</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Summary (if available) */}
      {session.sessionSummary && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Session Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{session.sessionSummary}</p>
            
            {(session.keyAchievements || session.areasForImprovement || session.nextRecommendations) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {session.keyAchievements && (
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">Key Achievements</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      {Array.isArray(session.keyAchievements) 
                        ? session.keyAchievements.map((achievement, index) => (
                            <li key={index}>• {achievement}</li>
                          ))
                        : <li>• {session.keyAchievements}</li>
                      }
                    </ul>
                  </div>
                )}
                
                {session.areasForImprovement && (
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-2">Areas for Improvement</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {Array.isArray(session.areasForImprovement) 
                        ? session.areasForImprovement.map((area, index) => (
                            <li key={index}>• {area}</li>
                          ))
                        : <li>• {session.areasForImprovement}</li>
                      }
                    </ul>
                  </div>
                )}
                
                {session.nextRecommendations && (
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Next Recommendations</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {Array.isArray(session.nextRecommendations) 
                        ? session.nextRecommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))
                        : <li>• {session.nextRecommendations}</li>
                      }
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}