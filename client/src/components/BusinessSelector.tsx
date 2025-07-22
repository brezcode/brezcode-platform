import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronRight, Users, Briefcase, Heart } from "lucide-react";
import { useRouter } from "wouter";

interface Business {
  id: string;
  name: string;
  industry: string;
  role: string;
  description: string;
  status: 'active' | 'pending' | 'inactive';
  employeeCount?: number;
  icon: React.ReactNode;
}

interface BusinessSelectorProps {
  userId: number;
  userEmail: string;
}

export default function BusinessSelector({ userId, userEmail }: BusinessSelectorProps) {
  const [, setLocation] = useRouter();
  
  // User's associated businesses
  const userBusinesses: Business[] = [
    {
      id: 'brezcode',
      name: 'BrezCode',
      industry: 'Health & Wellness',
      role: 'Admin',
      description: 'AI-powered breast health assessment and coaching platform',
      status: 'active',
      employeeCount: 5,
      icon: <Heart className="h-6 w-6 text-pink-500" />
    }
  ];

  const handleBusinessSelect = (businessId: string) => {
    // Store selected business in session/localStorage
    localStorage.setItem('selectedBusiness', businessId);
    localStorage.setItem('businessContext', JSON.stringify(userBusinesses.find(b => b.id === businessId)));
    
    // Navigate to business dashboard
    setLocation(`/business/${businessId}/dashboard`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Select Business</h1>
        </div>
        <p className="text-gray-600">
          Choose which business you'd like to manage. You can switch between businesses anytime.
        </p>
      </div>

      <div className="space-y-4">
        {userBusinesses.map((business) => (
          <Card key={business.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {business.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className="text-xl">{business.name}</CardTitle>
                      <Badge className={getStatusColor(business.status)}>
                        {business.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-base mb-2">
                      {business.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{business.industry}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Role:</span>
                        <span>{business.role}</span>
                      </div>
                      {business.employeeCount && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{business.employeeCount} employees</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleBusinessSelect(business.id)}
                  className="ml-4"
                >
                  Select
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
        
        {userBusinesses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No businesses found
              </h3>
              <p className="text-gray-500 mb-6">
                You don't have access to any businesses yet. Contact your administrator or create a new business.
              </p>
              <Button variant="outline">
                Request Access
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Business Access</h4>
            <p className="text-sm text-gray-600">
              Your access is based on your role and permissions within each business. 
              If you need access to additional businesses or features, contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}