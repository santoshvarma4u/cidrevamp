// Protected Email Display Component
// Prevents email harvesting by displaying emails as images or obfuscated text

import React, { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';

interface ProtectedEmailProps {
  email: string;
  method?: 'image' | 'obfuscated' | 'encoded';
  showIcon?: boolean;
  className?: string;
  fallbackText?: string;
}

interface EmailProtectionData {
  type: 'image' | 'text';
  content: string;
  original?: string;
}

export function ProtectedEmail({ 
  email, 
  method = 'obfuscated', 
  showIcon = true,
  className = '',
  fallbackText 
}: ProtectedEmailProps) {
  const [protectionData, setProtectionData] = useState<EmailProtectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    protectEmail();
  }, [email, method]);

  const protectEmail = async () => {
    if (!email) {
      setError('No email provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // For client-side protection, we'll use obfuscation methods
      let protectedContent: string;
      let type: 'image' | 'text' = 'text';

      switch (method) {
        case 'obfuscated':
          protectedContent = obfuscateEmail(email);
          break;
        case 'encoded':
          protectedContent = encodeEmail(email);
          break;
        case 'image':
          // For images, we'll use obfuscated text as fallback
          // In production, this would call the server API
          protectedContent = obfuscateEmail(email);
          break;
        default:
          protectedContent = obfuscateEmail(email);
      }

      setProtectionData({
        type,
        content: protectedContent,
        original: email,
      });
    } catch (err) {
      console.error('Error protecting email:', err);
      setError('Failed to protect email');
      setProtectionData({
        type: 'text',
        content: fallbackText || email,
        original: email,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const obfuscateEmail = (email: string): string => {
    return email
      .replace(/@/g, '[at]')
      .replace(/\./g, '[dot]');
  };

  const encodeEmail = (email: string): string => {
    return email
      .replace(/@/g, '&#64;')
      .replace(/\./g, '&#46;')
      .replace(/a/g, '&#97;')
      .replace(/e/g, '&#101;')
      .replace(/i/g, '&#105;')
      .replace(/o/g, '&#111;')
      .replace(/u/g, '&#117;');
  };

  const handleRevealEmail = () => {
    setShowOriginal(!showOriginal);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showIcon && <Mail className="h-4 w-4 text-gray-600" />}
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showIcon && <Mail className="h-4 w-4 text-gray-600" />}
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  if (!protectionData) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showIcon && <Mail className="h-4 w-4 text-gray-600" />}
        <span className="text-gray-500">{fallbackText || 'No email available'}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && <Mail className="h-4 w-4 text-gray-600" />}
      
      <div className="flex items-center space-x-2">
        {protectionData.type === 'image' ? (
          <img 
            src={protectionData.content} 
            alt="Email address" 
            className="h-5"
            onError={() => {
              // Fallback to obfuscated text if image fails to load
              setProtectionData({
                type: 'text',
                content: obfuscateEmail(email),
                original: email,
              });
            }}
          />
        ) : (
          <span 
            className="text-gray-600 select-none"
            dangerouslySetInnerHTML={{ 
              __html: showOriginal ? email : protectionData.content 
            }}
          />
        )}
        
        {/* Reveal/Hide button for admin users */}
        {protectionData.original && (
          <button
            onClick={handleRevealEmail}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={showOriginal ? 'Hide email' : 'Reveal email'}
          >
            {showOriginal ? (
              <EyeOff className="h-3 w-3 text-gray-500" />
            ) : (
              <Eye className="h-3 w-3 text-gray-500" />
            )}
          </button>
        )}
        
        {/* Copy button */}
        {protectionData.original && (
          <button
            onClick={handleCopyEmail}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Copy email"
          >
            <svg className="h-3 w-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Hook for email protection
export function useEmailProtection(email: string, method: 'image' | 'obfuscated' | 'encoded' = 'obfuscated') {
  const [protectionData, setProtectionData] = useState<EmailProtectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    protectEmail();
  }, [email, method]);

  const protectEmail = async () => {
    if (!email) {
      setError('No email provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let protectedContent: string;
      let type: 'image' | 'text' = 'text';

      switch (method) {
        case 'obfuscated':
          protectedContent = email.replace(/@/g, '[at]').replace(/\./g, '[dot]');
          break;
        case 'encoded':
          protectedContent = email
            .replace(/@/g, '&#64;')
            .replace(/\./g, '&#46;')
            .replace(/a/g, '&#97;')
            .replace(/e/g, '&#101;')
            .replace(/i/g, '&#105;')
            .replace(/o/g, '&#111;')
            .replace(/u/g, '&#117;');
          break;
        case 'image':
          // For images, we'll use obfuscated text as fallback
          protectedContent = email.replace(/@/g, '[at]').replace(/\./g, '[dot]');
          break;
        default:
          protectedContent = email.replace(/@/g, '[at]').replace(/\./g, '[dot]');
      }

      setProtectionData({
        type,
        content: protectedContent,
        original: email,
      });
    } catch (err) {
      console.error('Error protecting email:', err);
      setError('Failed to protect email');
      setProtectionData({
        type: 'text',
        content: email,
        original: email,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    protectionData,
    isLoading,
    error,
    protectEmail,
  };
}

// Utility function for protecting emails in text
export function protectEmailInText(text: string, method: 'obfuscated' | 'encoded' = 'obfuscated'): string {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  
  return text.replace(emailRegex, (match) => {
    switch (method) {
      case 'obfuscated':
        return match.replace(/@/g, '[at]').replace(/\./g, '[dot]');
      case 'encoded':
        return match
          .replace(/@/g, '&#64;')
          .replace(/\./g, '&#46;')
          .replace(/a/g, '&#97;')
          .replace(/e/g, '&#101;')
          .replace(/i/g, '&#105;')
          .replace(/o/g, '&#111;')
          .replace(/u/g, '&#117;');
      default:
        return match.replace(/@/g, '[at]').replace(/\./g, '[dot]');
    }
  });
}

export default ProtectedEmail;
