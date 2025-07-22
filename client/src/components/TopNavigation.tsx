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
  const { data: currentUser } = useQuery({
    queryKey: ['/api/me'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/me');
      const data = await response.json();
      return data.user;
    }
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
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs md:text-sm">L</span>
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
            {/* Business Switcher - Hidden on mobile */}
            {!businessContext && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation('/business-selector')}
                className="hidden md:flex"
              >
                <Building2 className="h-4 w-4 mr-1" />
                Select Business
              </Button>
            )}

            {businessContext && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation('/dashboard')}
                className="hidden md:flex"
              >
                <User className="h-4 w-4 mr-1" />
                Personal
              </Button>
            )}

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