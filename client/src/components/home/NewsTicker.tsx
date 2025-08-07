import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { NewsTicker as NewsTickerType } from "@shared/schema";

// Debug: Always render a visible ticker component for testing
const DEBUG_MODE = true;

interface NewsTickerProps {
  className?: string;
}

export default function NewsTicker({ className = "" }: NewsTickerProps) {
  // Simplified version - just return a visible element
  return (
    <div className="bg-red-600 text-white w-full min-h-[60px] flex items-center border-4 border-yellow-400">
      <div className="bg-red-800 px-4 py-3 font-bold text-sm uppercase tracking-wide flex-shrink-0 flex items-center">
        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
        SIMPLE NEWS TICKER TEST
      </div>
      <div className="flex-1 px-8 text-sm">
        This is a simplified test to see if component renders at all
      </div>
    </div>
  );

  // Always show something for debugging
  if (isLoading) {
    return (
      <div className="bg-red-600 text-white w-full min-h-[60px] flex items-center">
        <div className="bg-red-800 px-4 py-3 font-bold text-sm uppercase tracking-wide flex-shrink-0 flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
          Loading News...
        </div>
      </div>
    );
  }

  if (tickers.length === 0) {
    return (
      <div className="bg-orange-600 text-white w-full min-h-[60px] flex items-center">
        <div className="bg-orange-800 px-4 py-3 font-bold text-sm uppercase tracking-wide flex-shrink-0 flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
          No News Available
        </div>
      </div>
    );
  }

  const currentTicker = tickers[currentIndex];

  return (
    <div className={`bg-red-600 text-white overflow-hidden w-full min-h-[60px] relative ${className || ''}`}>
      <div className="flex items-center h-full">
        {/* Breaking News Label */}
        <div className="bg-red-800 px-4 py-3 font-bold text-sm uppercase tracking-wide flex-shrink-0 flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
          Breaking News
        </div>
        
        {/* Scrolling Text Container */}
        <div className="flex-1 py-3 relative overflow-hidden">
          <div 
            className={`transition-all duration-500 ease-in-out ${
              isAnimating ? 'transform translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
            }`}
          >
            {/* Horizontal scrolling text */}
            <div className="whitespace-nowrap">
              <span className="px-8 text-sm font-medium animate-marquee inline-block">
                {currentTicker?.text}
              </span>
            </div>
          </div>
        </div>

        {/* Ticker count indicator */}
        {tickers.length > 1 && (
          <div className="px-4 py-3 text-xs bg-red-800 flex-shrink-0">
            {currentIndex + 1} / {tickers.length}
          </div>
        )}
      </div>
    </div>
  );
}