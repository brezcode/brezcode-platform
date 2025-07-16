import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Mail, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
// Firebase authentication removed - using email-only signup

interface SimpleSignupFlowProps {
  quizAnswers: Record<string, any>;
  onComplete: () => void;
}

export default function SimpleSignupFlow({ quizAnswers, onComplete }: SimpleSignupFlowProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const { toast } = useToast();

  // Step 1: Choose Authentication Method
  const renderAuthChoice = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
        <p className="text-gray-600">Enter your email to create your account</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
            onClick={() => setStep(2)}
          >
            <Mail className="w-5 h-5 mr-2" />
            Create Your Account
          </Button>
          
          <p className="text-center text-sm text-gray-500">
            Simple email signup with verification code
          </p>
        </div>
      </CardContent>
    </Card>
  );

  // Email signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: { email: string; password: string; quizAnswers: Record<string, any> }) => {
      try {
        const response = await apiRequest("POST", "/api/auth/signup", data);
        return response.json();
      } catch (error) {
        console.error("Signup error:", error);
        throw error;
      }
    },
    onSuccess: async () => {
      // Send email verification code after account creation
      try {
        await apiRequest("POST", "/api/auth/send-email-verification", { email: formData.email });
        toast({
          title: "Account Created",
          description: "Please check your email for a verification code.",
        });
        setStep(3);
      } catch (error) {
        console.error("Failed to send verification email:", error);
        toast({
          title: "Account Created",
          description: "Account created but failed to send verification email. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  // Email verification mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      try {
        const response = await apiRequest("POST", "/api/auth/verify-email", data);
        return response.json();
      } catch (error) {
        console.error("Email verification error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Email Verified",
        description: "Your account is now active!",
      });
      onComplete();
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    },
  });

  // Step 2: Email & Password
  const renderEmailSignup = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Progress value={50} className="w-32" />
          <span className="ml-3 text-sm text-gray-600">Step 1 of 2</span>
        </div>
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <p className="text-gray-600">Enter your email and create a password</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={(e) => {
          e.preventDefault();
          
          // Validate passwords match
          if (formData.password !== formData.confirmPassword) {
            toast({
              title: "Password Mismatch",
              description: "Passwords do not match. Please try again.",
              variant: "destructive",
            });
            return;
          }
          
          signupMutation.mutate({
            email: formData.email,
            password: formData.password,
            quizAnswers,
          });
        }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Create a password (min 8 characters)"
                required
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
                required
                minLength={8}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-600">Passwords do not match</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={
              signupMutation.isPending || 
              formData.password !== formData.confirmPassword ||
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword
            }
          >
            {signupMutation.isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <Button variant="outline" onClick={() => setStep(1)} className="w-full">
          Back to Sign Up Options
        </Button>
      </CardContent>
    </Card>
  );

  // Step 3: Email Verification
  const renderEmailVerification = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Progress value={100} className="w-32" />
          <span className="ml-3 text-sm text-gray-600">Step 2 of 2</span>
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <p className="text-gray-600">
          We've sent a 6-digit code to <strong>{formData.email}</strong>
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={(e) => {
          e.preventDefault();
          verifyEmailMutation.mutate({
            email: formData.email,
            code: verificationCode,
          });
        }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-center text-lg tracking-widest"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={verifyEmailMutation.isPending}
          >
            {verifyEmailMutation.isPending ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => {
                // Resend verification code
                signupMutation.mutate({
                  email: formData.email,
                  password: formData.password,
                  quizAnswers,
                });
              }}
            >
              Resend Code
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      {step === 1 && renderAuthChoice()}
      {step === 2 && renderEmailSignup()}
      {step === 3 && renderEmailVerification()}
    </div>
  );
}