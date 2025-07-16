import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithGoogle } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function FirebaseDebug() {
  const [testResult, setTestResult] = useState<string>("");
  const { toast } = useToast();

  const testFirebaseConfig = () => {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "✓ Set" : "✗ Missing",
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Missing", 
      appId: import.meta.env.VITE_FIREBASE_APP_ID ? "✓ Set" : "✗ Missing",
      domain: window.location.hostname
    };
    
    setTestResult(JSON.stringify(config, null, 2));
    console.log("Firebase config test:", config);
  };

  const testGoogleSignIn = async () => {
    try {
      console.log("Testing Google sign-in...");
      const result = await signInWithGoogle();
      console.log("Sign-in result:", result);
      
      toast({
        title: "Sign-in Success!",
        description: `Signed in as ${result.user?.email}`,
        variant: "default",
      });
      
      setTestResult(`Success: ${result.user?.email}`);
    } catch (error: any) {
      console.error("Sign-in test error:", error);
      
      toast({
        title: "Sign-in Failed",
        description: error.message,
        variant: "destructive",
      });
      
      setTestResult(`Error: ${error.message}`);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Firebase Debug</CardTitle>
        <CardDescription>Test Firebase configuration and authentication</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testFirebaseConfig} variant="outline" className="w-full">
          Test Firebase Config
        </Button>
        
        <Button onClick={testGoogleSignIn} className="w-full">
          Test Google Sign-In
        </Button>
        
        {testResult && (
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}