import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Library } from "lucide-react";
import { useLocation } from "wouter";
import TopNavigation from "@/components/TopNavigation";
import MediaResearchWindow from "@/components/MediaResearchWindow";
import ResourceLibraryManager from "@/components/ResourceLibraryManager";

export default function MediaResearchPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <TopNavigation 
        businessContext={{
          name: "BrezCode Research",
          icon: <Search className="h-5 w-5 text-purple-500" />
        }}
      />
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation('/brezcode-backend-dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Search className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Media Research Center</h1>
                <p className="text-gray-600">AI-powered research and content strategy development</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="research" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="research" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Media Research
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              Resource Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="research" className="space-y-6">
            <MediaResearchWindow />
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <ResourceLibraryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}