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
}