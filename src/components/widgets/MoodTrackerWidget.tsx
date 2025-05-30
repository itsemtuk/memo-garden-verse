
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Smile, Frown, Meh, Heart, Angry } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MoodTrackerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const MoodTrackerWidget = ({ widget, isSelected, onClick, onUpdate }: MoodTrackerWidgetProps) => {
  const [moods, setMoods] = useState(widget.settings?.moods || []);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const moodOptions = [
    { icon: Heart, label: "Great", color: "text-pink-500", value: 5 },
    { icon: Smile, label: "Good", color: "text-green-500", value: 4 },
    { icon: Meh, label: "Okay", color: "text-yellow-500", value: 3 },
    { icon: Frown, label: "Bad", color: "text-orange-500", value: 2 },
    { icon: Angry, label: "Awful", color: "text-red-500", value: 1 },
  ];

  const logMood = (moodValue: number, label: string) => {
    const newMood = {
      date: new Date().toISOString().split('T')[0],
      mood: moodValue,
      label,
      timestamp: new Date().toISOString()
    };
    const updatedMoods = [...moods, newMood];
    setMoods(updatedMoods);
    onUpdate({ ...widget.settings, moods: updatedMoods });
  };

  const recentMoods = moods.slice(-7);

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
        width: widget.size?.width || "280px",
        height: widget.size?.height || "320px",
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
          <Smile className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-800">Mood Tracker</h3>
        </div>

        <div className="space-y-3 mb-4">
          <p className="text-sm text-gray-600">How are you feeling today?</p>
          <div className="grid grid-cols-5 gap-2">
            {moodOptions.map((mood) => {
              const Icon = mood.icon;
              return (
                <Button
                  key={mood.value}
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    logMood(mood.value, mood.label);
                  }}
                  className="flex flex-col p-2 h-auto"
                >
                  <Icon className={`w-4 h-4 ${mood.color}`} />
                  <span className="text-xs mt-1">{mood.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <h4 className="text-sm font-medium mb-2">Recent Moods</h4>
          <div className="space-y-2">
            {recentMoods.map((mood, index) => {
              const moodOption = moodOptions.find(m => m.value === mood.mood);
              const Icon = moodOption?.icon || Meh;
              return (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span>{mood.date}</span>
                  <div className="flex items-center gap-1">
                    <Icon className={`w-3 h-3 ${moodOption?.color}`} />
                    <span>{mood.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTrackerWidget;
