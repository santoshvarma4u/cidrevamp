import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import CaptchaInput from "@/components/auth/CaptchaInput";
import type { LoginData } from "@shared/schema";

export default function AdminAuth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [captchaSessionId, setCaptchaSessionId] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [captchaError, setCaptchaError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      setLocation('/admin');
    }
  }, [user, isLoading, setLocation]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData & { captchaSessionId: string; captchaInput: string }) => {
      console.log("Making fetch request to /api/login");
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        console.error("Login request failed:", res.status, res.statusText);
        const contentType = res.headers.get('content-type');
        console.error("Response content-type:", contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const error = await res.json();
          throw new Error(error.message || 'Login failed');
        } else {
          const text = await res.text();
          console.error("Non-JSON response:", text.substring(0, 200));
          throw new Error(`Login failed: ${res.status} ${res.statusText}`);
        }
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.firstName || data.username}!`,
      });
      
      // Refresh the page to update auth state
      window.location.href = '/admin';
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Form submitted");
    e.preventDefault();
    console.log("Form data:", formData);
    
    if (!formData.username || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Calling loginMutation.mutate");
    // Reset CAPTCHA error
    setCaptchaError("");
    
    // Validate CAPTCHA
    if (!isCaptchaValid) {
      setCaptchaError("Please complete the CAPTCHA verification");
      return;
    }
    
    loginMutation.mutate({
      ...formData,
      captchaSessionId,
      captchaInput,
    });
  };

  const handleCaptchaChange = (sessionId: string, userInput: string) => {
    setCaptchaSessionId(sessionId);
    setCaptchaInput(userInput);
  };

  const handleCaptchaValidation = (isValid: boolean) => {
    setIsCaptchaValid(isValid);
    if (isValid) {
      setCaptchaError("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-lg text-gray-600 font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gov-blue to-gov-light-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="h-10 w-10 text-gov-blue" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CID Admin Portal</h1>
          <p className="text-blue-100">Telangana State Police - Crime Investigation Department</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-10 placeholder:text-white/70"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 placeholder:text-white/70"
                    required
                  />
                </div>
              </div>

              {/* CAPTCHA Component */}
              <CaptchaInput
                onCaptchaChange={handleCaptchaChange}
                onValidationChange={handleCaptchaValidation}
                error={captchaError}
              />

              <Button
                type="submit"
                onClick={(e) => {
                  console.log("Button clicked");
                  // Don't prevent default here, let form submission handle it
                }}
                className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white !py-3 !px-4 !rounded-md !font-medium !transition-colors !shadow-lg !border-blue-600 hover:!border-blue-700"
                disabled={loginMutation.isPending || !isCaptchaValid}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: '1px solid #2563eb',
                  minHeight: '44px'
                }}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> admin</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-100 text-sm">
            © 2025 Crime Investigation Department
          </p>
          <p className="text-blue-200 text-xs mt-1">
            Telangana State Police
          </p>
        </div>
      </div>
    </div>
  );
}