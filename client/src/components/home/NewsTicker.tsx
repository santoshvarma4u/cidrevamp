import { useQuery } from "@tanstack/react-query";
import type { NewsTicker as NewsTickerType } from "@shared/schema";

interface NewsTickerProps {
  className?: string;
}

export default function NewsTicker({ className = "" }: NewsTickerProps) {
  const { data: tickers = [], isLoading } = useQuery<NewsTickerType[]>({
    queryKey: ['/api/news-ticker'],
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Cache for 30 seconds
    refetchOnMount: true, // Refetch when component mounts
  });

  // Show placeholder text while loading to start animation immediately
  if (isLoading || tickers.length === 0) {
    const placeholderText = isLoading 
      ? "Loading latest updates from CID Telangana..." 
      : "No news updates available at this time";
    
    return (
      <div className={`container mx-auto px-4 ${className}`}>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-md border-2 border-teal-300 overflow-hidden">
          <div className="whitespace-nowrap">
            <div className="inline-block text-red-600 text-lg font-bold animate-scroll-slow">
              {placeholderText} • {placeholderText} • {placeholderText} • {placeholderText}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create continuous scrolling text from all tickers
  const allTickerText = tickers.map(ticker => ticker.text).join(' • ');
  const repeatedText = `${allTickerText} • ${allTickerText} • ${allTickerText}`;

  return (
    <div className={`container mx-auto px-4 ${className}`}>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-md border-2 border-teal-300 overflow-hidden">
        <div className="whitespace-nowrap">
          <div className="inline-block text-red-600 text-lg font-bold animate-scroll-slow">
            {repeatedText}
          </div>
        </div>
      </div>
    </div>
  );
}