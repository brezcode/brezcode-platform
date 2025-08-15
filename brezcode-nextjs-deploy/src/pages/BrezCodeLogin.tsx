import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, ArrowLeft } from "lucide-react";

export default function BrezCodeLogin() {
  const [, setLocation] = useLocation();
  const { user, login, isLoggingIn } = useAuth();
  const { toast } = useToast();
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  if (user) {
    setTimeout(() => setLocation("/brezcode-frontend-dashboard"), 0);
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to BrezCode",
      });
      setLocation("/brezcode-frontend-dashboard");
    } catch (error: any) {
      console.log('BrezCode login error:', error);
      toast({
        title: "Sign In Failed", 
        description: error.message || "Please check your email and password and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to BrezCode Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/brezcode")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to BrezCode
          </Button>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back to BrezCode
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to continue your breast health journey
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="border-gray-200 focus:border-pink-400 focus:ring-pink-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="border-gray-200 focus:border-pink-400 focus:ring-pink-400"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3"
              >
                {isLoggingIn ? "Signing in..." : "Sign In to BrezCode"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => setLocation("/brezcode/quiz")}
                  className="text-pink-600 hover:text-pink-700 font-semibold"
                >
                  Take the health quiz to get started
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}