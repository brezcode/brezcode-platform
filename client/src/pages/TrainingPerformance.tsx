import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, User, MessageSquare, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

interface CompletedSession {
  sessionId: string;
  sessionNumber: number;
  scenarioName: string;
  avatarType: string;
  completedAt: Date | null;
  sessionDuration: number | null;
  averageQuality: number;
  totalMessages: number | null;
}

export default function TrainingPerformance() {
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompletedSessions();
  }, []);

  const fetchCompletedSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/performance/completed-sessions?businessContext=brezcode');
      const data = await response.json();

      if (data.success) {
        setCompletedSessions(data.sessions);
        console.log(`📊 Loaded ${data.sessions.length} completed training sessions`);
      } else {
        setError(data.error || 'Failed to load completed sessions');
      }
    } catch (err) {
      console.error('Error fetching completed sessions:', err);
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQualityColor = (quality: number): string => {
    if (quality >= 90) return 'bg-green-500';
    if (quality >= 80) return 'bg-blue-500';
    if (quality >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAvatarDisplayName = (avatarType: string): string => {
    const avatarNames: { [key: string]: string } = {
      'brezcode_health_coach': 'Dr. Sakura Wellness',
      'brezcode': 'Dr. Sakura Wellness',
      'dr_sakura': 'Dr. Sakura Wellness',
      'health_coach': 'Dr. Sakura Wellness',
      'sales_specialist': 'Alex Thunder',
      'customer_service': 'Miko Harmony',
      'technical_support': 'Kai TechWiz',
      'business_consultant': 'Luna Strategic',
      'education_specialist': 'Professor Sage'
    };
    return avatarNames[avatarType] || 'AI Assistant';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-red-600 font-medium">Error loading training performance</div>
            <p className="text-red-500 mt-2">{error}</p>
            <Button 
              onClick={fetchCompletedSessions} 
              variant="outline" 
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Performance</h1>
        <p className="text-gray-600">Review your completed AI training sessions and track your progress</p>
      </div>

      {completedSessions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No completed sessions yet</h3>
            <p className="text-gray-500 mb-4">
              Complete your first training session to see performance analytics here.
            </p>
            <Link href="/business/brezcode/avatar-training">
              <Button>Start Training Session</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Sessions</p>
                    <p className="text-2xl font-bold">{completedSessions.length}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg Quality</p>
                    <p className="text-2xl font-bold">
                      {Math.round(completedSessions.reduce((sum, s) => sum + s.averageQuality, 0) / completedSessions.length)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Messages</p>
                    <p className="text-2xl font-bold">
                      {completedSessions.reduce((sum, s) => sum + (s.totalMessages || 0), 0)}
                    </p>
                  </div>
                  <User className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Time</p>
                    <p className="text-2xl font-bold">
                      {formatDuration(completedSessions.reduce((sum, s) => sum + (s.sessionDuration || 0), 0))}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* BrezCode Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                BrezCode Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedSessions.map((session) => (
                  <div key={session.sessionId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link href={`/training-session/${session.sessionId}`}>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-blue-600 hover:text-blue-800 font-medium text-left"
                            >
                              Session {session.sessionNumber} completed
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                          <Badge 
                            className={`${getQualityColor(session.averageQuality)} text-white`}
                          >
                            {session.averageQuality}% Quality
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{getAvatarDisplayName(session.avatarType)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>{session.scenarioName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatDuration(session.sessionDuration)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(session.completedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {session.totalMessages} messages exchanged
                      </span>
                      <Link href={`/training-session/${session.sessionId}`}>
                        <Button variant="outline" size="sm">
                          View Full Conversation
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}