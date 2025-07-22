import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, User, LogOut, Settings } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TopNavigationProps {
  businessContext?: {
    name: string;
    icon?: React.ReactNode;
  };
}

export default function TopNavigation({ businessContext }: TopNavigationProps) {
  const [, setLocation] = useLocation();

  // Fetch user information
  const { data: currentUser, isError } = useQuery({
    queryKey: ['/api/me'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/me');
      if (!response.ok) {
        return null; // Return null instead of throwing error for unauthenticated users
      }
      const data = await response.json();
      return data;
    },
    retry: false, // Don't retry authentication requests
  });

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/logout');
      setLocation('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setLocation('/login');
    }
  };

  const displayName = businessContext 
    ? businessContext.name 
    : currentUser 
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'User';

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: LeadGen.To Brand */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <div 
              className="flex items-center space-x-1 md:space-x-2 cursor-pointer hover:opacity-80"
              onClick={() => window.open('https://leadgen.to', '_blank')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LeadGen.To
              </span>
            </div>

            {/* Context Separator - Hidden on mobile */}
            <div className="h-6 w-px bg-gray-300 hidden md:block"></div>

            {/* Current Context - Simplified on mobile */}
            <div className="hidden md:flex items-center space-x-2">
              {businessContext ? (
                <>
                  {businessContext.icon || <Building2 className="h-5 w-5 text-gray-600" />}
                  <span className="font-medium text-gray-800">{businessContext.name}</span>
                  <Badge variant="secondary" className="text-xs">Business</Badge>
                </>
              ) : (
                <>
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-800">{displayName}</span>
                  <Badge variant="outline" className="text-xs">Personal</Badge>
                </>
              )}
            </div>
          </div>

          {/* Right: User Actions */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Business/Personal Switcher - Always visible */}
            <div className="flex items-center space-x-1">
              {!businessContext ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation('/business-selector')}
                    className="flex items-center"
                  >
                    <Building2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Business</span>
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="flex items-center bg-blue-600 hover:bg-blue-700"
                  >
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Personal</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="flex items-center bg-blue-600 hover:bg-blue-700"
                  >
                    <Building2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Business</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation('/dashboard')}
                    className="flex items-center"
                  >
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Personal</span>
                  </Button>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-1 md:space-x-2">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex">
                <LogOut className="h-4 w-4" />
              </Button>

              <Avatar 
                className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-300"
                onClick={() => setLocation('/user-profile')}
              >
                {currentUser?.profilePhoto ? (
                  <AvatarImage src={currentUser.profilePhoto} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                    {currentUser ? 
                      `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}` : 
                      'U'
                    }
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}