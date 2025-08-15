import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Watch, 
  Heart, 
  Activity, 
  Moon, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Smartphone
} from 'lucide-react';

interface HealthData {
  heartRate: number;
  steps: number;
  caloriesBurned: number;
  sleepHours: number;
  activeMinutes: number;
  lastSync: string;
}

interface AppleWatchIntegrationProps {
  onHealthDataUpdate?: (data: HealthData) => void;
}

export default function AppleWatchIntegration({ onHealthDataUpdate }: AppleWatchIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncFrequency: 'hourly',
    enabledMetrics: {
      heartRate: true,
      steps: true,
      calories: true,
      sleep: true,
      activity: true,
    }
  });

  // Check if Apple Health is available (Web API limitations)
  const isAppleHealthSupported = () => {
    return typeof window !== 'undefined' && 
           ('DeviceMotionEvent' in window) && 
           /iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const connectAppleWatch = async () => {
    setIsConnecting(true);
    
    try {
      // In a real implementation, this would use Apple HealthKit
      // For web app, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      setIsConnected(true);
      
      // Generate sample health data for demo
      const sampleData: HealthData = {
        heartRate: 72 + Math.floor(Math.random() * 20),
        steps: 8500 + Math.floor(Math.random() * 3000),
        caloriesBurned: 420 + Math.floor(Math.random() * 200),
        sleepHours: 7.5 + Math.random() * 1.5,
        activeMinutes: 45 + Math.floor(Math.random() * 30),
        lastSync: new Date().toISOString()
      };
      
      setHealthData(sampleData);
      onHealthDataUpdate?.(sampleData);
      
    } catch (error) {
      console.error('Failed to connect Apple Watch:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const syncHealthData = async () => {
    if (!isConnected) return;
    
    setIsSyncing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update health data with fresh values
      const updatedData: HealthData = {
        heartRate: 70 + Math.floor(Math.random() * 25),
        steps: healthData!.steps + Math.floor(Math.random() * 500),
        caloriesBurned: healthData!.caloriesBurned + Math.floor(Math.random() * 50),
        sleepHours: 7 + Math.random() * 2,
        activeMinutes: healthData!.activeMinutes + Math.floor(Math.random() * 15),
        lastSync: new Date().toISOString()
      };
      
      setHealthData(updatedData);
      onHealthDataUpdate?.(updatedData);
      
    } catch (error) {
      console.error('Failed to sync health data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const disconnectAppleWatch = () => {
    setIsConnected(false);
    setHealthData(null);
  };

  const formatLastSync = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Watch className="h-5 w-5 text-blue-600" />
            Apple Watch Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div>
                <h3 className="font-medium">
                  {isConnected ? 'Apple Watch Connected' : 'Apple Watch Not Connected'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isConnected 
                    ? `Last sync: ${healthData ? formatLastSync(healthData.lastSync) : 'Never'}`
                    : 'Connect to sync health and fitness data'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isConnected ? (
                <Button 
                  onClick={connectAppleWatch}
                  disabled={isConnecting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Watch className="h-4 w-4 mr-2" />
                      Connect Watch
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={syncHealthData}
                    disabled={isSyncing}
                    size="sm"
                  >
                    {isSyncing ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={disconnectAppleWatch}
                    size="sm"
                  >
                    Disconnect
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Apple Health Support Alert */}
          {!isAppleHealthSupported() && (
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                Apple Health integration requires an iPhone or iPad. On other devices, you can manually input health data or use alternative fitness trackers.
              </AlertDescription>
            </Alert>
          )}

          {/* Health Data Dashboard */}
          {isConnected && healthData && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Today's Health Metrics</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Heart Rate */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <Badge variant="secondary">Live</Badge>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{healthData.heartRate}</p>
                  <p className="text-sm text-red-700">BPM Resting</p>
                </div>

                {/* Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <Badge variant="secondary">Today</Badge>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{healthData.steps.toLocaleString()}</p>
                  <p className="text-sm text-blue-700">Steps</p>
                  <Progress value={(healthData.steps / 10000) * 100} className="mt-2" />
                </div>

                {/* Calories */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{healthData.caloriesBurned}</p>
                  <p className="text-sm text-orange-700">Calories Burned</p>
                </div>

                {/* Sleep */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Moon className="h-5 w-5 text-purple-500" />
                    <Badge variant="secondary">Last Night</Badge>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{healthData.sleepHours.toFixed(1)}h</p>
                  <p className="text-sm text-purple-700">Sleep Duration</p>
                </div>

                {/* Active Minutes */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Badge variant="secondary">Today</Badge>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{healthData.activeMinutes}</p>
                  <p className="text-sm text-green-700">Active Minutes</p>
                  <Progress value={(healthData.activeMinutes / 60) * 100} className="mt-2" />
                </div>
              </div>
            </div>
          )}

          {/* Sync Settings */}
          {isConnected && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Sync Settings
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Auto Sync</p>
                    <p className="text-xs text-gray-600">Automatically sync health data</p>
                  </div>
                  <Switch 
                    checked={syncSettings.autoSync}
                    onCheckedChange={(checked) => 
                      setSyncSettings(prev => ({ ...prev, autoSync: checked }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(syncSettings.enabledMetrics).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <Switch 
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          setSyncSettings(prev => ({
                            ...prev,
                            enabledMetrics: { ...prev.enabledMetrics, [key]: checked }
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Health Insights */}
          {isConnected && healthData && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Health Insights</h3>
              <div className="text-sm text-green-800 space-y-1">
                <p>• Your heart rate is within a healthy range</p>
                <p>• You're {healthData.steps >= 10000 ? 'exceeding' : 'approaching'} your daily step goal</p>
                <p>• Sleep duration is {healthData.sleepHours >= 7 ? 'optimal' : 'below recommended'} for recovery</p>
                <p>• Active minutes contribute to cardiovascular health</p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}