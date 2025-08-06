import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { useLocation } from "wouter";
import TopNavigation from "@/components/TopNavigation";
import SimpleMediaResearch from "@/components/SimpleMediaResearch";

export default function MediaResearchModulePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <TopNavigation 
        businessContext={{
          name: "Media Research Module",
          icon: <Search className="h-5 w-5 text-purple-500" />
        }}
      />
      
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation('/brezcode-backend-dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Simple Media Research Component */}
        <SimpleMediaResearch />
      </div>
    </div>
  );
}