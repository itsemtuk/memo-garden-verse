
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Target, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HabitTrackerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

const HabitTrackerWidget = ({ widget, isSelected, onClick, onUpdate }: HabitTrackerWidgetProps) => {
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  
  const habits: Habit[] = widget.settings?.habits || [];
  const today = new Date().toDateString();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit.trim(),
        completedDates: []
      };
      const updatedHabits = [...habits, habit];
      onUpdate({ ...widget.settings, habits: updatedHabits });
      setNewHabit("");
      setShowAddHabit(false);
    }
  };

  const toggleHabitToday = (habitId: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today);
        const completedDates = isCompleted
          ? habit.completedDates.filter(date => date !== today)
          : [...habit.completedDates, today];
        return { ...habit, completedDates };
      }
      return habit;
    });
    onUpdate({ ...widget.settings, habits: updatedHabits });
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
          <Target className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Habits</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddHabit(!showAddHabit);
            }}
            className="ml-auto"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {showAddHabit && (
          <div className="mb-3 flex gap-2">
            <Input
              placeholder="Add new habit..."
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addHabit();
                if (e.key === 'Escape') setShowAddHabit(false);
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1"
              autoFocus
            />
            <Button size="sm" onClick={addHabit}>
              <Check className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {habits.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No habits to track</p>
          ) : (
            habits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Button
                  size="sm"
                  variant={habit.completedDates.includes(today) ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHabitToday(habit.id);
                  }}
                  className="w-8 h-8 p-0"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <span className="flex-1 text-sm">{habit.name}</span>
                <span className="text-xs text-gray-500">
                  {habit.completedDates.length} days
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitTrackerWidget;
