import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

interface NewsItem {
  id: number;
  title?: string;
  content: string;
  excerpt?: string;
  publishedAt?: string;
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
          <Dialog key={`${item.id}-${index}`}>
            <DialogTrigger asChild>
              <div 
                className="mb-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ minHeight: '120px' }}
              >
                <div className={`border-l-4 ${item.borderColor} pl-4 w-full`}>
                  {item.title && (
                    <h4 className="text-gray-900 font-semibold text-sm mb-2 line-clamp-2">
                      {item.title}
                    </h4>
                  )}
                  <p className="text-gray-700 leading-relaxed text-sm line-clamp-3">
                    {item.excerpt || item.content}
                  </p>
                  <p className="text-blue-600 text-xs mt-2 font-medium">
                    Click to read more →
                  </p>
                </div>
              </div>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {item.title || "News Article"}
                </DialogTitle>
                {item.publishedAt && (
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>CID Telangana</span>
                    </div>
                  </div>
                )}
              </DialogHeader>
              
              <div className="mt-4">
                <div className={`border-l-4 ${item.borderColor} pl-4`}>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}