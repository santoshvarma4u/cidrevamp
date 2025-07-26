import { useState, useEffect } from "react";

interface NewsItem {
  id: number;
  content: string;
  borderColor: string;
}

interface AutoScrollNewsProps {
  newsItems: NewsItem[];
  scrollInterval?: number;
}

export default function AutoScrollNews({ 
  newsItems, 
  scrollInterval = 4000 
}: AutoScrollNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (newsItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
      );
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [newsItems.length, scrollInterval]);

  if (newsItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No news available
      </div>
    );
  }

  return (
    <div className="relative h-64 overflow-hidden">
      <div 
        className="transition-transform duration-500 ease-in-out"
        style={{ 
          transform: `translateY(-${currentIndex * 100}%)`,
          height: `${newsItems.length * 100}%`
        }}
      >
        {newsItems.map((item, index) => (
          <div 
            key={item.id}
            className="h-64 flex items-center"
            style={{ height: `${100 / newsItems.length}%` }}
          >
            <div className={`border-l-4 ${item.borderColor} pl-4 w-full`}>
              <p className="text-gray-700 leading-relaxed text-sm">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {newsItems.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}