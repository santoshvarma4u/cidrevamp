import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Calendar,
  Clock,
} from "lucide-react";

interface Video {
  id: number;
  title: string;
  description?: string;
  fileName: string;
  filePath: string;
  thumbnailPath?: string;
  duration?: number;
  category?: string;
  createdAt: string;
}

interface VideoPlayerProps {
  video: Video;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

export default function VideoPlayer({ 
  video, 
  autoPlay = false, 
  showControls = true,
  className = "" 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowOverlay(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowOverlay(true);
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover cursor-pointer"
        autoPlay={autoPlay}
        muted={isMuted}
        onClick={handleVideoClick}
        onEnded={handleVideoEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        poster={video.thumbnailPath ? `/uploads/videos/${video.thumbnailPath}` : undefined}
      >
        <source src={`/uploads/videos/${video.fileName}`} type="video/mp4" />
        <source src={`/uploads/videos/${video.fileName}`} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity">
          <Button
            onClick={togglePlay}
            size="lg"
            className="bg-white bg-opacity-90 text-black hover:bg-white rounded-full p-4"
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
      )}

      {/* Video Info Overlay */}
      <div className="absolute top-4 left-4 right-4">
        <div className="flex items-start justify-between">
          <div className="bg-black bg-opacity-75 rounded-lg p-3 max-w-md">
            <h3 className="text-white font-semibold mb-1 text-sm">{video.title}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-200">
              {video.category && (
                <Badge variant="secondary" className="text-xs">
                  {video.category}
                </Badge>
              )}
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(video.createdAt).toLocaleDateString()}
              </div>
              {video.duration && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(video.duration)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-75 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={togglePlay}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  onClick={toggleMute}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={toggleFullscreen}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!videoRef.current && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}
    </div>
  );
}