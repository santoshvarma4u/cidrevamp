import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Photo } from "@shared/schema";

interface AutoScrollSliderProps {
  photos: Photo[];
  autoScrollInterval?: number;
}

export default function AutoScrollSlider({ 
  photos, 
  autoScrollInterval = 3000 
}: AutoScrollSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === photos.length - 1 ? 0 : prevIndex + 1
      );
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [photos.length, autoScrollInterval]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? photos.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === photos.length - 1 ? 0 : currentIndex + 1);
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full">
      {/* Main Image Display */}
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100 h-full">
        <div className="h-full">
          <img
            src={`/uploads/${photos[currentIndex].fileName}`}
            alt={photos[currentIndex].title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          
          {/* Overlay with title and description */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <h3 className="text-white text-sm font-bold mb-1">
              {photos[currentIndex].title}
            </h3>
            {photos[currentIndex].description && (
              <p className="text-white/90 text-xs line-clamp-2">
                {photos[currentIndex].description}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Dot Indicators - positioned inside the image */}
        {photos.length > 1 && (
          <div className="absolute top-2 right-2 flex space-x-1">
            {photos.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex 
                    ? "bg-white" 
                    : "bg-white/50 hover:bg-white/70"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Photo Counter - positioned inside the image */}
        {photos.length > 1 && (
          <div className="absolute top-2 left-2 text-xs text-white bg-black/30 px-2 py-1 rounded">
            {currentIndex + 1} / {photos.length}
          </div>
        )}
      </div>
    </div>
  );
}