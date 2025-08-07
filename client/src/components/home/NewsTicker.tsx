import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { NewsTicker as NewsTickerType } from "@shared/schema";

interface NewsTickerProps {
  className?: string;
}

export default function NewsTicker({ className = "" }: NewsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: tickers = [], isLoading } = useQuery<NewsTickerType[]>({
    queryKey: ['/api/news-ticker'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Auto-scroll through tickers
  useEffect(() => {
    if (tickers.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === tickers.length - 1 ? 0 : prevIndex + 1
        );
        setIsAnimating(false);
      }, 500); // Half-second for slide out animation
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [tickers.length]);

  // Don't render if no tickers available
  if (tickers.length === 0) {
    return null;
  }

  const currentTicker = tickers[currentIndex];

  return (
    <div className={`bg-red-600 text-white w-full min-h-[60px] flex items-center overflow-hidden ${className}`}>
      {/* Breaking News Label */}
      <div className="bg-red-800 px-4 py-3 font-bold text-sm uppercase tracking-wide flex-shrink-0 flex items-center">
        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
        Breaking News
      </div>
      
      {/* Scrolling Text Container */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          className={`px-8 py-3 text-sm font-medium transition-transform duration-500 ease-in-out ${
            isAnimating ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
          }`}
        >
          {currentTicker?.text}
        </div>
      </div>
      
      {/* Ticker Counter */}
      <div className="bg-red-800 px-3 py-3 text-xs font-bold flex-shrink-0">
        {currentIndex + 1}/{tickers.length}
      </div>
    </div>
  );
}