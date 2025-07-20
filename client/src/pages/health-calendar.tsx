import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Target,
  Flame,
  Award,
  TrendingUp,
  Plus
} from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

interface ScheduledActivity {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'skipped';
  template: {
    id: string;
    name: string;
    category: string;
    duration: number;
    difficulty: string;
    description: string;
  };
  isCompleted?: boolean;
  completion?: any;
}

interface HealthStats {
  streaks: Array<{
    category: string;
    currentStreak: number;
    longestStreak: number;
    totalActivities: number;
  }>;
  recentCompletions: number;
  upcomingActivities: number;
  totalActivities: number;
}

export default function HealthCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ScheduledActivity | null>(null);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current date range for calendar
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  // Fetch scheduled activities
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['/api/health/activities', startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]],
  });

  // Fetch health stats
  const { data: stats } = useQuery<HealthStats>({
    queryKey: ['/api/health/stats'],
  });

  // Fetch daily plan for selected date
  const { data: dailyPlan } = useQuery({
    queryKey: ['/api/health/daily-plan', selectedDate.toISOString().split('T')[0]],
  });

  // Complete activity mutation
  const completeActivityMutation = useMutation({
    mutationFn: async (completionData: any) => {
      return apiRequest('/api/health/complete-activity', {
        method: 'POST',
        body: JSON.stringify(completionData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Activity Completed!",
        description: "Great job! Your progress has been recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/health/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/health/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/health/daily-plan'] });
      setShowActivityDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete activity",
        variant: "destructive",
      });
    },
  });

  // Convert activities to calendar events
  const calendarEvents = activities.map((activity: any) => {
    const startTime = new Date(`${activity.activity.scheduledDate}T${activity.activity.scheduledTime || '09:00'}`);
    const endTime = new Date(startTime.getTime() + (activity.template?.duration || 30) * 60000);

    return {
      id: activity.activity.id,
      title: activity.template?.name || 'Health Activity',
      start: startTime,
      end: endTime,
      resource: activity,
      allDay: false,
    };
  });

  const handleSelectEvent = (event: any) => {
    setSelectedActivity(event.resource);
    setShowActivityDialog(true);
  };

  const handleCompleteActivity = (activityId: string, rating: number, notes: string = '') => {
    completeActivityMutation.mutate({
      scheduledActivityId: activityId,
      duration: selectedActivity?.template?.duration || 30,
      intensity: 'medium',
      mood: 'energized',
      notes,
      rating,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'self_exam': 'bg-pink-100 text-pink-800',
      'massage': 'bg-purple-100 text-purple-800',
      'exercise': 'bg-blue-100 text-blue-800',
      'wellness': 'bg-green-100 text-green-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'completed': 'text-green-600',
      'pending': 'text-yellow-600',
      'skipped': 'text-red-600',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading your health calendar...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Calendar</h1>
          <p className="text-gray-600">Track your daily health activities and build healthy habits</p>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Activities</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalActivities}</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-green-600">{stats.recentCompletions}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats?.streaks?.length > 0 ? Math.max(...stats.streaks.map(s => s.currentStreak)) : 0}
                    </p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Upcoming</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.upcomingActivities}</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Activity Calendar</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={calendarView === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCalendarView('month')}
                    >
                      Month
                    </Button>
                    <Button
                      variant={calendarView === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCalendarView('week')}
                    >
                      Week
                    </Button>
                    <Button
                      variant={calendarView === 'day' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCalendarView('day')}
                    >
                      Day
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ height: '500px' }}>
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={handleSelectEvent}
                    onNavigate={setSelectedDate}
                    view={calendarView}
                    onView={setCalendarView}
                    eventPropGetter={(event) => {
                      const activity = event.resource;
                      const isCompleted = activity.activity.status === 'completed';
                      return {
                        style: {
                          backgroundColor: isCompleted ? '#10b981' : '#3b82f6',
                          borderColor: isCompleted ? '#059669' : '#2563eb',
                          color: 'white',
                        },
                      };
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Plan Sidebar */}
          <div className="space-y-6">
            {/* Today's Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Today's Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dailyPlan?.activities?.length > 0 ? (
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{dailyPlan.stats.completed}/{dailyPlan.stats.total}</span>
                      </div>
                      <Progress 
                        value={(dailyPlan.stats.completed / dailyPlan.stats.total) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Activities */}
                    <div className="space-y-3">
                      {dailyPlan.activities.map((activity: any) => (
                        <div
                          key={activity.activity.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedActivity(activity);
                            setShowActivityDialog(true);
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">{activity.template.name}</h4>
                            {activity.isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Badge variant="outline" className={getCategoryColor(activity.template.category)}>
                              {activity.template.category}
                            </Badge>
                            <span>{activity.template.duration} min</span>
                            <span>{activity.activity.scheduledTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No activities scheduled for today</p>
                )}
              </CardContent>
            </Card>

            {/* Streaks */}
            {stats?.streaks && stats.streaks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5" />
                    Your Streaks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats.streaks.map((streak) => (
                    <div key={streak.category} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium capitalize">{streak.category.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">{streak.totalActivities} total</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">{streak.currentStreak}</p>
                        <p className="text-xs text-gray-500">days</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Activity Detail Dialog */}
        <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedActivity?.template?.name}</DialogTitle>
            </DialogHeader>
            {selectedActivity && (
              <div className="space-y-6">
                {/* Activity Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <Badge className={getCategoryColor(selectedActivity.template.category)}>
                      {selectedActivity.template.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="font-medium">{selectedActivity.template.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Difficulty</p>
                    <p className="font-medium capitalize">{selectedActivity.template.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <div className={`flex items-center gap-1 ${getStatusColor(selectedActivity.status)}`}>
                      {selectedActivity.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : selectedActivity.status === 'skipped' ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                      <span className="capitalize">{selectedActivity.status}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-800">{selectedActivity.template.description}</p>
                </div>

                {/* Action Buttons */}
                {selectedActivity.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleCompleteActivity(selectedActivity.id, 5)}
                      disabled={completeActivityMutation.isPending}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Handle skip activity
                        setShowActivityDialog(false);
                      }}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Skip Today
                    </Button>
                  </div>
                )}

                {selectedActivity.isCompleted && selectedActivity.completion && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 font-medium mb-2">✅ Completed!</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <span className="ml-1">{selectedActivity.completion.duration} min</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Mood:</span>
                        <span className="ml-1 capitalize">{selectedActivity.completion.mood}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}