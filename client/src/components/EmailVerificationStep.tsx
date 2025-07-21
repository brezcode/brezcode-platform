import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface EmailVerificationStepProps {
  email: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export function EmailVerificationStep({ email, onVerificationComplete, onBack }: EmailVerificationStepProps) {
  const [code, setCode] = useState("");
  const [hasSentCode, setHasSentCode] = useState(false);
  const { sendEmailVerification, verifyEmail, isEmailVerificationPending, isEmailVerifyPending } = useAuth();
  const { toast } = useToast();

  const handleSendCode = async () => {
    try {
      await sendEmailVerification(email);
      setHasSentCode(true);
      toast({
        title: "Verification code sent",
        description: "Please check your email for the 6-digit verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send verification code",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

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

    try {
      await verifyEmail(email, code);
      toast({
        title: "Email verified successfully",
        description: "Your email has been verified. You can now access your account.",
      });
      onVerificationComplete();
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired verification code.",
        variant: "destructive",
      });
    }
  };

  const handleResendCode = async () => {
    await handleSendCode();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-center">
          We've sent a verification code to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasSentCode ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the button below to receive your verification code
            </p>
            <Button 
              onClick={handleSendCode} 
              disabled={isEmailVerificationPending}
              className="w-full"
            >
              {isEmailVerificationPending ? "Sending..." : "Send Verification Code"}
            </Button>
          </div>
        ) : (
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
              disabled={isEmailVerifyPending || code.length !== 6}
            >
              {isEmailVerifyPending ? "Verifying..." : "Verify Email"}
            </Button>
            
            <div className="text-center space-y-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleResendCode}
                disabled={isEmailVerificationPending}
                className="text-sm"
              >
                {isEmailVerificationPending ? "Sending..." : "Resend Code"}
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
        )}
      </CardContent>
    </Card>
  );
}