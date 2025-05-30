
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Activity, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface FitnessTrackerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const FitnessTrackerWidget = ({ widget, isSelected, onClick, onUpdate }: FitnessTrackerWidgetProps) => {
  const [workouts, setWorkouts] = useState(widget.settings?.workouts || []);
  const [dailyGoals, setDailyGoals] = useState(widget.settings?.dailyGoals || {
    steps: { current: 0, target: 10000 },
    calories: { current: 0, target: 2000 },
    water: { current: 0, target: 8 }
  });

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const addWorkout = () => {
    const workout = {
      id: Date.now(),
      type: "Workout",
      duration: 30,
      calories: 200,
      date: new Date().toISOString().split('T')[0]
    };
    
    const updatedWorkouts = [...workouts, workout];
    setWorkouts(updatedWorkouts);
    onUpdate({ ...widget.settings, workouts: updatedWorkouts });
  };

  const updateGoal = (type: string, value: number) => {
    const updatedGoals = {
      ...dailyGoals,
      [type]: { ...dailyGoals[type], current: value }
    };
    setDailyGoals(updatedGoals);
    onUpdate({ ...widget.settings, dailyGoals: updatedGoals });
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
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">Fitness Tracker</h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              addWorkout();
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Steps</span>
              <span className="text-xs text-gray-500">
                {dailyGoals.steps.current} / {dailyGoals.steps.target}
              </span>
            </div>
            <Progress value={(dailyGoals.steps.current / dailyGoals.steps.target) * 100} />
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                updateGoal('steps', dailyGoals.steps.current + 1000);
              }}
              className="mt-1 h-6 text-xs"
            >
              +1K Steps
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Calories Burned</span>
              <span className="text-xs text-gray-500">
                {dailyGoals.calories.current} / {dailyGoals.calories.target}
              </span>
            </div>
            <Progress value={(dailyGoals.calories.current / dailyGoals.calories.target) * 100} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Water (glasses)</span>
              <span className="text-xs text-gray-500">
                {dailyGoals.water.current} / {dailyGoals.water.target}
              </span>
            </div>
            <Progress value={(dailyGoals.water.current / dailyGoals.water.target) * 100} />
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                updateGoal('water', Math.min(dailyGoals.water.current + 1, dailyGoals.water.target));
              }}
              className="mt-1 h-6 text-xs"
            >
              +1 Glass
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <h4 className="text-sm font-medium mb-2">Recent Workouts</h4>
          <div className="space-y-2">
            {workouts.slice(-3).map((workout: any) => (
              <div key={workout.id} className="border rounded-lg p-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{workout.type}</span>
                  <span className="text-gray-500">{workout.date}</span>
                </div>
                <div className="text-gray-600">
                  {workout.duration}min • {workout.calories} cal
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessTrackerWidget;
