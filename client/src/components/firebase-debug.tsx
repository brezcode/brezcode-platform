import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithGoogle } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function FirebaseDebug() {
  const [testResult, setTestResult] = useState<string>("");
  const { toast } = useToast();

  const testFirebaseConfig = () => {
    const currentDomain = window.location.hostname;
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "✓ Set" : "✗ Missing",
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Missing", 
      appId: import.meta.env.VITE_FIREBASE_APP_ID ? "✓ Set" : "✗ Missing",
      currentDomain: currentDomain,
      fullURL: window.location.href,
      authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      domainStatus: "⚠️ Need to add this domain to Firebase Console"
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
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Domain Authorization Issue</h4>
          <p className="text-sm text-yellow-700 mb-3">
            The current domain needs to be added to Firebase Console:
          </p>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Go to <a href="https://console.firebase.google.com" target="_blank" className="underline">Firebase Console</a></li>
            <li>Select project: <code className="bg-yellow-100 px-1 rounded">{import.meta.env.VITE_FIREBASE_PROJECT_ID}</code></li>
            <li>Go to Authentication → Settings → Authorized domains</li>
            <li>Add: <code className="bg-yellow-100 px-1 rounded">{window.location.hostname}</code></li>
          </ol>
        </div>
        
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