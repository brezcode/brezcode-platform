import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithGoogle, logout } from "@/lib/firebase";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useToast } from "@/hooks/use-toast";
import { Mail, LogOut, Shield } from "lucide-react";

interface FirebaseAuthProps {
  mode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export default function FirebaseAuth({ mode = 'login', onSuccess }: FirebaseAuthProps) {
  const { user, loading, isAuthenticated, error } = useFirebaseAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        toast({
          title: "Welcome to BrezCode!",
          description: `Successfully signed in as ${result.user.email}`,
          variant: "default",
        });
        onSuccess?.();
      }
    } catch (error: any) {
      console.error("Firebase sign-in error:", error);
      toast({
        title: "Sign In Failed",
        description: `Firebase error: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed Out",
        description: "You've been successfully signed out.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Sign Out Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex justify-center items-center p-6">
          <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-red-600">Configuration Error</CardTitle>
          <CardDescription>
            Firebase authentication is not properly configured. Please check your environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            For now, you can continue using the quiz and other features.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Welcome Back!
          </CardTitle>
          <CardDescription>
            Signed in as {user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>
          {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </CardTitle>
        <CardDescription>
          {mode === 'signup' 
            ? 'Join BrezCode with your Google account' 
            : 'Sign in to access your personalized breast health coach'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGoogleSignIn} className="w-full" size="lg">
          <Mail className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        
        <div className="text-center text-sm text-gray-600">
          <p>Fast, secure, and private</p>
          {!user?.emailVerified && user && (
            <p className="text-amber-600 mt-2">
              Email verification required for full access
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}