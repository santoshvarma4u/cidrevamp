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
  scrollInterval = 6000 
}: AutoScrollNewsProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (newsItems.length <= 1) return;

    const interval = setInterval(() => {
      setScrollPosition((prevPosition) => {
        // Calculate total content height (each item takes 120px + 16px margin)
        const itemHeight = 136; // height + margin
        const totalHeight = newsItems.length * itemHeight;
        const containerHeight = 320; // h-80 = 320px
        
        // Move down by 1px for smooth continuous scroll
        const newPosition = prevPosition + 1;
        
        // Reset to top when we've scrolled through all content
        if (newPosition >= totalHeight - containerHeight + itemHeight) {
          return 0;
        }
        
        return newPosition;
      });
    }, 50); // Scroll every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [newsItems.length]);

  if (newsItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No news available
      </div>
    );
  }

  return (
    <div className="relative h-80 overflow-hidden">
      <div 
        className="transition-transform duration-75 ease-linear"
        style={{ 
          transform: `translateY(-${scrollPosition}px)`,
        }}
      >
        {/* Duplicate items for seamless loop */}
        {[...newsItems, ...newsItems].map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            className="mb-4 p-3 bg-gray-50 rounded-lg"
            style={{ minHeight: '120px' }}
          >
            <div className={`border-l-4 ${item.borderColor} pl-4 w-full`}>
              <p className="text-gray-700 leading-relaxed text-sm">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}