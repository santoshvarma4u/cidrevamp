import { useQuery } from "@tanstack/react-query";
import type { NewsTicker as NewsTickerType } from "@shared/schema";

interface NewsTickerProps {
  className?: string;
}

export default function NewsTicker({ className = "" }: NewsTickerProps) {
  const { data: tickers = [], isLoading } = useQuery<NewsTickerType[]>({
    queryKey: ['/api/news-ticker'],
    refetchInterval: 60000, // Refresh every minute
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true, // Refetch when component mounts
  });

  // Show placeholder text while loading to start animation immediately
  if (isLoading || tickers.length === 0) {
    const placeholderText = isLoading 
      ? "Loading latest updates from CID Telangana..." 
      : "No news updates available at this time";
    
    return (
      <div className={`w-full py-4 overflow-hidden ${className}`}>
        <div className="whitespace-nowrap">
          <div className="inline-block text-red-500 text-lg font-bold animate-scroll-slow">
            {placeholderText} • {placeholderText}
          </div>
        </div>
      </div>
    );
  }

  // Create continuous scrolling text from all tickers
  const allTickerText = tickers.map(ticker => ticker.text).join(' • ');

  return (
    <div className={`w-full py-4 overflow-hidden ${className}`}>
      <div className="whitespace-nowrap">
        <div className="inline-block text-red-500 text-lg font-bold animate-scroll-slow">
          {allTickerText} • {allTickerText}
        </div>
      </div>
    </div>
  );
}