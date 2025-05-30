
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface MusicPlayerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const MusicPlayerWidget = ({ widget, isSelected, onClick, onUpdate }: MusicPlayerWidgetProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(widget.settings?.currentTrack || "No track selected");
  const [playlist, setPlaylist] = useState(widget.settings?.playlist || []);
  const [volume, setVolume] = useState(widget.settings?.volume || [50]);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const updateSettings = (newSettings: any) => {
    onUpdate({ ...widget.settings, ...newSettings });
  };

  return (
    <div
      ref={setNodeRef}
      className={`widget absolute bg-white rounded-lg shadow-lg border-2 transition-all duration-200 ${
        isDragging ? 'dragging shadow-xl scale-105' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        ...style,
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        width: widget.size?.width || "300px",
        height: widget.size?.height || "250px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3 border-b pb-2">
          <Music className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Music Player</h3>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Music className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-medium text-sm truncate">{currentTrack}</h4>
            <p className="text-xs text-gray-500">Unknown Artist</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="h-10 w-10 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <Slider
                  value={volume}
                  onValueChange={(value) => {
                    setVolume(value);
                    updateSettings({ volume: value });
                  }}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Connect to Spotify or Apple Music</p>
          <p>for full functionality</p>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerWidget;
