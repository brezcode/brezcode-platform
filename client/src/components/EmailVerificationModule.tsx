/**
 * Email Verification React Component Module
 * Reusable email verification UI components for any React application
 * 
 * Features:
 * - Email verification step component
 * - Customizable styling
 * - Built-in API integration
 * - Resend functionality
 * - Error handling
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export interface EmailVerificationConfig {
  codeLength?: number;
  title?: string;
  description?: string;
  developmentMode?: boolean;
  apiEndpoints?: {
    verify: string;
    resend: string;
  };
}

export interface EmailVerificationProps {
  email: string;
  onVerificationComplete: (user: any) => void;
  onBack?: () => void;
  config?: EmailVerificationConfig;
  className?: string;
}

export function EmailVerificationStep({ 
  email, 
  onVerificationComplete, 
  onBack, 
  config = {},
  className = ""
}: EmailVerificationProps) {
  const {
    codeLength = 6,
    title = "Verify Your Email",
    description = "We've sent a verification code to",
    developmentMode = process.env.NODE_ENV === "development",
    apiEndpoints = {
      verify: "/api/auth/verify-email",
      resend: "/api/auth/resend-verification"
    }
  } = config;

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== codeLength) {
      toast({
        title: "Invalid code",
        description: `Please enter the ${codeLength}-digit verification code.`,
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch(apiEndpoints.verify, {
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
        description: "Welcome! Your email has been verified.",
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
      const response = await fetch(apiEndpoints.resend, {
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
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <CardDescription className="text-center">
          {description} <strong>{email}</strong>
          {developmentMode && (
            <>
              <br />
              <span className="text-xs text-muted-foreground">
                Development mode: Check console/logs for verification code
              </span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">{codeLength}-Digit Verification Code</Label>
            <Input
              id="verification-code"
              placeholder={"0".repeat(codeLength)}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, codeLength))}
              maxLength={codeLength}
              className="text-center text-lg tracking-widest"
              autoComplete="one-time-code"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isVerifying || code.length !== codeLength}
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
            
            {onBack && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onBack}
                className="text-sm"
              >
                Back to Registration
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Hook for email verification functionality
 */
export function useEmailVerification(config: EmailVerificationConfig = {}) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const apiEndpoints = config.apiEndpoints || {
    verify: "/api/auth/verify-email",
    resend: "/api/auth/resend-verification"
  };

  const verifyEmail = async (email: string, code: string) => {
    setIsVerifying(true);
    try {
      const response = await fetch(apiEndpoints.verify, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      return data;
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerification = async (email: string) => {
    setIsResending(true);
    try {
      const response = await fetch(apiEndpoints.resend, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      return data;
    } finally {
      setIsResending(false);
    }
  };

  return {
    verifyEmail,
    resendVerification,
    isVerifying,
    isResending
  };
}

// Export for easy integration
export default EmailVerificationStep;