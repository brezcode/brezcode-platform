import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Mail, Phone, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SignupFlowProps {
  quizAnswers: Record<string, any>;
  onComplete: () => void;
}

interface CountryCode {
  code: string;
  country: string;
  dialCode: string;
}

const countryCodes: CountryCode[] = [
  { code: "US", country: "United States", dialCode: "+1" },
  { code: "CA", country: "Canada", dialCode: "+1" },
  { code: "GB", country: "United Kingdom", dialCode: "+44" },
  { code: "AU", country: "Australia", dialCode: "+61" },
  { code: "DE", country: "Germany", dialCode: "+49" },
  { code: "FR", country: "France", dialCode: "+33" },
  { code: "IT", country: "Italy", dialCode: "+39" },
  { code: "ES", country: "Spain", dialCode: "+34" },
  { code: "CN", country: "China", dialCode: "+86" },
  { code: "JP", country: "Japan", dialCode: "+81" },
  { code: "KR", country: "South Korea", dialCode: "+82" },
  { code: "IN", country: "India", dialCode: "+91" },
  { code: "BR", country: "Brazil", dialCode: "+55" },
  { code: "MX", country: "Mexico", dialCode: "+52" },
  { code: "AR", country: "Argentina", dialCode: "+54" },
];

export default function SignupFlow({ quizAnswers, onComplete }: SignupFlowProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  const { toast } = useToast();

  const sendEmailCodeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/auth/send-email-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Verification code sent",
        description: "Please check your email for the 6-digit verification code.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, code: emailCode }),
      });
    },
    onSuccess: () => {
      setIsEmailVerified(true);
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified.",
      });
    },
    onError: (error) => {
      toast({
        title: "Invalid code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sendPhoneCodeMutation = useMutation({
    mutationFn: async () => {
      const selectedCountryCode = countryCodes.find(c => c.code === selectedCountry);
      const fullPhone = `${selectedCountryCode?.dialCode}${phoneNumber}`;
      await apiRequest("/api/auth/send-phone-verification", {
        method: "POST",
        body: JSON.stringify({ phone: fullPhone }),
      });
    },
    onSuccess: () => {
      toast({
        title: "SMS sent",
        description: "Please check your phone for the 6-digit verification code.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: async () => {
      const selectedCountryCode = countryCodes.find(c => c.code === selectedCountry);
      const fullPhone = `${selectedCountryCode?.dialCode}${phoneNumber}`;
      await apiRequest("/api/auth/verify-phone", {
        method: "POST",
        body: JSON.stringify({ phone: fullPhone, code: phoneCode }),
      });
    },
    onSuccess: () => {
      setIsPhoneVerified(true);
      toast({
        title: "Phone verified",
        description: "Your phone number has been successfully verified.",
      });
    },
    onError: (error) => {
      toast({
        title: "Invalid code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async () => {
      const selectedCountryCode = countryCodes.find(c => c.code === selectedCountry);
      const fullPhone = `${selectedCountryCode?.dialCode}${phoneNumber}`;
      
      await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          phone: fullPhone,
          phoneCountryCode: selectedCountryCode?.dialCode,
          quizAnswers,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Account created successfully",
        description: "Welcome to BrezCode! You can now access your personalized health dashboard.",
      });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStepProgress = () => {
    switch (step) {
      case 1: return 25;
      case 2: return 50;
      case 3: return 75;
      case 4: return 100;
      default: return 0;
    }
  };

  const canProceedFromStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && 
           password.length >= 8 && 
           password === confirmPassword;
  };

  const canProceedFromStep2 = () => {
    return phoneNumber.length >= 10;
  };

  const handleNextStep = () => {
    if (step === 1 && canProceedFromStep1()) {
      setStep(2);
      // Auto-send email verification
      sendEmailCodeMutation.mutate();
    } else if (step === 2 && canProceedFromStep2()) {
      setStep(3);
      // Auto-send phone verification
      sendPhoneCodeMutation.mutate();
    } else if (step === 3 && isEmailVerified) {
      setStep(4);
    } else if (step === 4 && isPhoneVerified) {
      signupMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Create Your Account
          </CardTitle>
          <div className="mt-4">
            <Progress value={getStepProgress()} className="h-2" />
            <p className="text-center text-sm text-gray-600 mt-2">
              Step {step} of 4
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Email & Password</h3>
                <p className="text-sm text-gray-600">
                  Let's start by setting up your login credentials
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleNextStep} 
                disabled={!canProceedFromStep1()}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
                <p className="text-sm text-gray-600">
                  We'll send you important health reminders and alerts
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.country} ({country.dialCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex space-x-2">
                  <div className="w-20 bg-gray-100 border rounded-md flex items-center justify-center text-sm">
                    {countryCodes.find(c => c.code === selectedCountry)?.dialCode}
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234567890"
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              <Button 
                onClick={handleNextStep} 
                disabled={!canProceedFromStep2()}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Mail className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold mb-2">Verify Your Email</h3>
                <p className="text-sm text-gray-600">
                  We sent a 6-digit code to {email}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailCode">Verification Code</Label>
                <Input
                  id="emailCode"
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => verifyEmailMutation.mutate()}
                  disabled={emailCode.length !== 6 || verifyEmailMutation.isPending}
                  className="flex-1"
                >
                  {verifyEmailMutation.isPending ? "Verifying..." : "Verify"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => sendEmailCodeMutation.mutate()}
                  disabled={sendEmailCodeMutation.isPending}
                >
                  {sendEmailCodeMutation.isPending ? "Sending..." : "Resend"}
                </Button>
              </div>

              {isEmailVerified && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Email verified successfully!</span>
                </div>
              )}

              <Button 
                onClick={handleNextStep} 
                disabled={!isEmailVerified}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Phone className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold mb-2">Verify Your Phone</h3>
                <p className="text-sm text-gray-600">
                  We sent a 6-digit code to {countryCodes.find(c => c.code === selectedCountry)?.dialCode}{phoneNumber}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneCode">Verification Code</Label>
                <Input
                  id="phoneCode"
                  type="text"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => verifyPhoneMutation.mutate()}
                  disabled={phoneCode.length !== 6 || verifyPhoneMutation.isPending}
                  className="flex-1"
                >
                  {verifyPhoneMutation.isPending ? "Verifying..." : "Verify"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => sendPhoneCodeMutation.mutate()}
                  disabled={sendPhoneCodeMutation.isPending}
                >
                  {sendPhoneCodeMutation.isPending ? "Sending..." : "Resend"}
                </Button>
              </div>

              {isPhoneVerified && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Phone verified successfully!</span>
                </div>
              )}

              <Button 
                onClick={handleNextStep} 
                disabled={!isPhoneVerified || signupMutation.isPending}
                className="w-full"
              >
                {signupMutation.isPending ? "Creating Account..." : "Complete Signup"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}