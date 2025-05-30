
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Target, Plus, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface GoalTrackerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const GoalTrackerWidget = ({ widget, isSelected, onClick, onUpdate }: GoalTrackerWidgetProps) => {
  const [goals, setGoals] = useState(widget.settings?.goals || []);
  const [newGoal, setNewGoal] = useState("");
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

  const addGoal = () => {
    if (newGoal.trim()) {
      const goal = {
        id: Date.now(),
        title: newGoal.trim(),
        progress: 0,
        target: 100,
        created: new Date().toISOString()
      };
      const updatedGoals = [...goals, goal];
      setGoals(updatedGoals);
      onUpdate({ ...widget.settings, goals: updatedGoals });
      setNewGoal("");
      setIsAdding(false);
    }
  };

  const updateProgress = (goalId: number, newProgress: number) => {
    const updatedGoals = goals.map((goal: any) =>
      goal.id === goalId ? { ...goal, progress: Math.min(newProgress, goal.target) } : goal
    );
    setGoals(updatedGoals);
    onUpdate({ ...widget.settings, goals: updatedGoals });
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
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Goal Tracker</h3>
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
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter goal title..."
              onClick={(e) => e.stopPropagation()}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addGoal}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3">
          {goals.map((goal: any) => (
            <div key={goal.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{goal.title}</h4>
                {goal.progress >= goal.target && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>
              <Progress value={(goal.progress / goal.target) * 100} className="mb-2" />
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{goal.progress} / {goal.target}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateProgress(goal.id, goal.progress + 1);
                  }}
                  className="h-6 px-2"
                >
                  +1
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalTrackerWidget;
