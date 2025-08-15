import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Mail, Eye, EyeOff } from "lucide-react";

interface CleanSignupFlowProps {
  quizAnswers: Record<string, any>;
  onComplete: () => void;
}

export default function CleanSignupFlow({ quizAnswers, onComplete }: CleanSignupFlowProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    try {
      // For now, skip actual API and move to verification step
      console.log("Signup data:", { ...formData, quizAnswers });
      setStep(2);
    } catch (error) {
      console.error("Signup error:", error);
      alert("Failed to create account");
    }
  };

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, accept any 6-digit code
    if (verificationCode.length === 6) {
      console.log("Email verified for:", formData.email);
      onComplete();
    } else {
      alert("Please enter a 6-digit code");
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <Progress value={50} className="w-32 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <p className="text-gray-600">Enter your details to get started</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={
                  formData.password !== formData.confirmPassword ||
                  !formData.firstName ||
                  !formData.lastName ||
                  !formData.email ||
                  !formData.password ||
                  !formData.confirmPassword
                }
              >
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <Progress value={100} className="w-32 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <p className="text-gray-600">
            We sent a verification code to {formData.email}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code (any 6 digits for demo)"
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={verificationCode.length !== 6}
            >
              Verify Email
            </Button>
          </form>

          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={() => setStep(1)}
              className="text-sm"
            >
              Back to Account Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}