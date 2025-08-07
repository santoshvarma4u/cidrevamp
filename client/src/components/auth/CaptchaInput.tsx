import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

interface CaptchaData {
  id: string;
  svg: string;
}

interface CaptchaInputProps {
  onCaptchaChange: (sessionId: string, userInput: string) => void;
  onValidationChange: (isValid: boolean) => void;
  error?: string;
}

export default function CaptchaInput({ onCaptchaChange, onValidationChange, error }: CaptchaInputProps) {
  const [userInput, setUserInput] = useState("");
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  // Generate initial CAPTCHA
  const { refetch: generateCaptcha, isLoading: isGenerating } = useQuery({
    queryKey: ['/api/captcha'],
    queryFn: async (): Promise<CaptchaData> => {
      const response = await fetch('/api/captcha');
      if (!response.ok) {
        throw new Error('Failed to generate CAPTCHA');
      }
      return response.json();
    },
    enabled: false,
  });

  // Refresh CAPTCHA mutation
  const refreshMutation = useMutation({
    mutationFn: async (sessionId?: string): Promise<CaptchaData> => {
      const response = await fetch('/api/captcha/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh CAPTCHA');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setCaptchaData(data);
      setUserInput("");
      onValidationChange(false);
    },
  });

  // Verify CAPTCHA mutation
  const verifyMutation = useMutation({
    mutationFn: async ({ sessionId, input }: { sessionId: string; input: string }) => {
      const response = await fetch('/api/captcha/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, userInput: input }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify CAPTCHA');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setIsValidating(false);
      onValidationChange(data.valid);
      if (!data.valid) {
        // Auto-refresh CAPTCHA on invalid input
        handleRefresh();
      }
    },
    onError: () => {
      setIsValidating(false);
      onValidationChange(false);
    },
  });

  // Load initial CAPTCHA on mount
  useEffect(() => {
    generateCaptcha().then((result) => {
      if (result.data) {
        setCaptchaData(result.data);
      }
    });
  }, [generateCaptcha]);

  // Update SVG when captcha data changes
  useEffect(() => {
    if (captchaData && svgRef.current) {
      svgRef.current.innerHTML = captchaData.svg;
    }
  }, [captchaData]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setUserInput(value);
    onCaptchaChange(captchaData?.id || "", value);
    
    // Auto-verify when user types 5 characters
    if (value.length === 5 && captchaData) {
      setIsValidating(true);
      verifyMutation.mutate({ sessionId: captchaData.id, input: value });
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refreshMutation.mutate(captchaData?.id);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="captcha-input">Security Verification</Label>
      
      {/* CAPTCHA Image */}
      <div className="relative">
        <div 
          ref={svgRef}
          className="border rounded-lg p-4 bg-gray-50 min-h-[80px] flex items-center justify-center"
          style={{ minWidth: '200px' }}
        >
          {isGenerating || refreshMutation.isPending ? (
            <div className="text-center">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-teal-600" />
              <p className="text-sm text-gray-500">Generating CAPTCHA...</p>
            </div>
          ) : !captchaData ? (
            <p className="text-sm text-gray-500">Loading CAPTCHA...</p>
          ) : null}
        </div>
        
        {/* Refresh Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute top-2 right-2"
          onClick={handleRefresh}
          disabled={refreshMutation.isPending}
          title="Refresh CAPTCHA"
        >
          <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Input Field */}
      <div className="relative">
        <Input
          id="captcha-input"
          type="text"
          placeholder="Enter the code shown above"
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value.toUpperCase())}
          maxLength={5}
          className={`text-center text-lg font-mono ${
            error ? 'border-red-500' : 
            verifyMutation.data?.valid ? 'border-green-500' : ''
          }`}
          disabled={isValidating || isGenerating || refreshMutation.isPending}
        />
        
        {/* Validation Indicator */}
        {isValidating && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <RefreshCw className="h-4 w-4 animate-spin text-teal-600" />
          </div>
        )}
        
        {verifyMutation.data?.valid && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Enter the 5-character code shown in the image above. The code is case-insensitive.
      </p>
    </div>
  );
}