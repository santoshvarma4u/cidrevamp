import { useEffect, useState } from 'react';

interface WatermarkProps {
  type?: 'single' | 'pattern';
  opacity?: number;
  size?: number;
}

export default function Watermark({ 
  type = 'pattern', 
  opacity = 0.02, 
  size = 150 
}: WatermarkProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide watermark in admin/edit modes
    const hideInAdminPaths = ['/admin', '/login'];
    const currentPath = window.location.pathname;
    const shouldHide = hideInAdminPaths.some(path => currentPath.includes(path));
    setIsVisible(!shouldHide);
  }, []);

  if (!isVisible) return null;

  if (type === 'single') {
    return (
      <div 
        className="watermark"
        style={{ 
          opacity,
          width: `${size}px`,
          height: `${size}px`
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div 
      className="watermark-pattern"
      style={{ 
        opacity,
        backgroundSize: `${size}px ${size}px`
      }}
      aria-hidden="true"
    />
  );
}