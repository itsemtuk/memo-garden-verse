
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TimerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const TimerWidget = ({ widget, isSelected, onClick, onUpdate }: TimerWidgetProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(widget.settings?.duration || 1500); // Default 25 minutes
  const [inputMinutes, setInputMinutes] = useState("25");

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Timer finished - could add notification here
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const newDuration = parseInt(inputMinutes) * 60;
    setTimeLeft(newDuration);
    onUpdate({ ...widget.settings, duration: newDuration });
  };

  const setCustomTime = () => {
    const newDuration = parseInt(inputMinutes) * 60;
    setTimeLeft(newDuration);
    setIsRunning(false);
    onUpdate({ ...widget.settings, duration: newDuration });
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
        width: widget.size?.width || "200px",
        height: widget.size?.height || "240px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 h-full flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-4">
          <Timer className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-gray-800">Timer</h3>
        </div>

        <div className="text-4xl font-mono mb-4 text-center">
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-2 mb-4">
          {!isRunning ? (
            <Button size="sm" onClick={startTimer} disabled={timeLeft === 0}>
              <Play className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={pauseTimer}>
              <Pause className="w-4 h-4" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={resetTimer}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-16 text-center"
            min="1"
            max="60"
          />
          <span className="text-sm text-gray-600">min</span>
          <Button size="sm" variant="outline" onClick={setCustomTime}>
            Set
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimerWidget;
