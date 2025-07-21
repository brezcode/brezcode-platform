import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface EmailVerificationStepProps {
  email: string;
  onVerificationComplete: (user: any) => void;
  onBack: () => void;
}

export function EmailVerificationStep({ email, onVerificationComplete, onBack }: EmailVerificationStepProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      toast({
        title: "Email verified successfully",
        description: "Welcome to LeadGen.to!",
      });
      onVerificationComplete(data.user);
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired verification code.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      toast({
        title: "Verification code sent",
        description: "Check your email for the new verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend code",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-center">
          We've sent a verification code to <strong>{email}</strong>
          <br />
          <span className="text-xs text-muted-foreground">
            Check the console/logs for your verification code
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">6-Digit Verification Code</Label>
            <Input
              id="verification-code"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              autoComplete="one-time-code"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isVerifying || code.length !== 6}
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </Button>
          
          <div className="text-center space-y-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleResendCode}
              disabled={isResending}
              className="text-sm"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onBack}
              className="text-sm"
            >
              Back to Registration
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}