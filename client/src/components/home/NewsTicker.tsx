import { useQuery } from "@tanstack/react-query";
import type { NewsTicker as NewsTickerType } from "@shared/schema";

interface NewsTickerProps {
  className?: string;
}

export default function NewsTicker({ className = "" }: NewsTickerProps) {
  const { data: tickers = [], isLoading } = useQuery<NewsTickerType[]>({
    queryKey: ["/api/news-ticker"],
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
        <div className="bg-card backdrop-blur-sm rounded-xl p-6 shadow-md border-2 border-border overflow-hidden">
          <div className="whitespace-nowrap">
            <div className="inline-block text-lg font-bold animate-scroll-slow">
              <span className="text-slate-700">{placeholderText}</span>
              <span className="text-slate-500"> • </span>
              <span className="text-indigo-800">{placeholderText}</span>
              <span className="text-slate-500"> • </span>
              <span className="text-teal-800">{placeholderText}</span>
              <span className="text-slate-500"> • </span>
              <span className="text-rose-800">{placeholderText}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tickerColors = [
    "text-slate-700",
    "text-indigo-800",
    "text-teal-800",
    "text-rose-800",
    "text-amber-800",
    "text-cyan-800",
  ];

  // Repeat the ticker list 3 times for continuous scrolling
  const repeatedTickers = [...tickers, ...tickers, ...tickers];

  return (
    <div className={`container mx-auto px-4 ${className}`}>
      <div className="bg-card backdrop-blur-sm rounded-xl p-4 shadow-md border-2 border-border overflow-hidden">
        <div className="whitespace-nowrap">
          <div className="inline-block text-lg font-bold animate-scroll-slow">
            {repeatedTickers.map((ticker, index) => (
              <span key={index}>
                <span className={tickerColors[index % tickerColors.length]}>
                  {ticker.text}
                </span>
                {index < repeatedTickers.length - 1 && (
                  <span className="text-slate-500"> • </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
