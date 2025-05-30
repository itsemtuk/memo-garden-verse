
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import { Clock, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CountdownTimerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const CountdownTimerWidget = ({ widget, isSelected, onClick, onUpdate }: CountdownTimerWidgetProps) => {
  const [countdowns, setCountdowns] = useState(widget.settings?.countdowns || []);
  const [newEvent, setNewEvent] = useState({ name: "", date: "" });
  const [isAdding, setIsAdding] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const calculateTimeLeft = (targetDate: string) => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      
      return { days, hours, minutes, expired: false };
    }
    
    return { days: 0, hours: 0, minutes: 0, expired: true };
  };

  const addCountdown = () => {
    if (newEvent.name.trim() && newEvent.date) {
      const countdown = {
        id: Date.now(),
        name: newEvent.name.trim(),
        date: newEvent.date,
        created: new Date().toISOString()
      };
      
      const updatedCountdowns = [...countdowns, countdown];
      setCountdowns(updatedCountdowns);
      onUpdate({ ...widget.settings, countdowns: updatedCountdowns });
      setNewEvent({ name: "", date: "" });
      setIsAdding(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      // Force re-render to update countdown displays
      setCountdowns(prev => [...prev]);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

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
        height: widget.size?.height || "350px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3 border-b pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-800">Countdown Timer</h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setIsAdding(!isAdding);
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {isAdding && (
          <div className="mb-3 space-y-2">
            <Input
              value={newEvent.name}
              onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Event name..."
              onClick={(e) => e.stopPropagation()}
            />
            <Input
              type="datetime-local"
              value={newEvent.date}
              onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addCountdown}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3">
          {countdowns.map((countdown: any) => {
            const timeLeft = calculateTimeLeft(countdown.date);
            return (
              <div key={countdown.id} className="border rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">{countdown.name}</h4>
                {timeLeft.expired ? (
                  <div className="text-center text-red-500 text-sm">
                    Event has passed!
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{timeLeft.days}</div>
                      <div className="text-xs text-gray-500">Days</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{timeLeft.hours}</div>
                      <div className="text-xs text-gray-500">Hours</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{timeLeft.minutes}</div>
                      <div className="text-xs text-gray-500">Minutes</div>
                    </div>
                  </div>
                )}
                <div className="text-xs text-gray-500 text-center mt-2">
                  {new Date(countdown.date).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimerWidget;
