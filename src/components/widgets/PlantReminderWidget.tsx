
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useMemo } from "react";
import { Droplets, Leaf, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createSystemError } from "@/lib/errorHandling";
import { plantNameSchema } from "@/lib/security";
import { handleValidationError } from "@/lib/errorHandling";

interface PlantReminderWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate?: (settings: any) => void;
}

const PlantReminderWidget = ({ widget, isSelected, onClick, onUpdate }: PlantReminderWidgetProps) => {
  const plantName = widget.settings?.plant_name || "My Plant";
  const lastWatered = widget.settings?.last_watered || new Date().toISOString();
  const waterIntervalDays = widget.settings?.water_interval_days || 3;
  const [error, setError] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [tempPlantName, setTempPlantName] = useState(plantName);
  const [tempInterval, setTempInterval] = useState(waterIntervalDays.toString());

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 50 : isSelected ? 10 : 1,
  };

  // Memoized calculations for better performance
  const wateringStatus = useMemo(() => {
    const lastWateredDate = new Date(lastWatered);
    const now = new Date();
    const daysSinceWatered = Math.floor((now.getTime() - lastWateredDate.getTime()) / (1000 * 60 * 60 * 24));
    const needsWater = daysSinceWatered >= waterIntervalDays;
    const daysUntilWater = Math.max(0, waterIntervalDays - daysSinceWatered);
    const nextWateringDate = new Date(lastWateredDate.getTime() + waterIntervalDays * 24 * 60 * 60 * 1000);
    
    return {
      daysSinceWatered,
      needsWater,
      daysUntilWater,
      nextWateringDate,
      isOverdue: daysSinceWatered > waterIntervalDays
    };
  }, [lastWatered, waterIntervalDays]);

  const handleWatering = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setError("");
    
    try {
      const now = new Date().toISOString();
      const newSettings = {
        ...widget.settings,
        last_watered: now,
        next_watering: new Date(Date.now() + waterIntervalDays * 24 * 60 * 60 * 1000).toISOString(),
      };
      onUpdate?.(newSettings);
    } catch (error) {
      const appError = createSystemError(error, "Failed to update watering status. Please try again.");
      setError(appError.message);
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      const validatedPlantName = plantNameSchema.parse(tempPlantName);
      const interval = parseInt(tempInterval, 10);
      
      if (interval < 1 || interval > 30) {
        setError("Watering interval must be between 1 and 30 days");
        return;
      }
      
      const newSettings = {
        ...widget.settings,
        plant_name: validatedPlantName,
        water_interval_days: interval,
      };
      
      onUpdate?.(newSettings);
      setShowSettings(false);
      setError("");
    } catch (error) {
      const errorMessage = handleValidationError(error);
      setError(errorMessage);
    }
  };

  const getStatusColor = () => {
    if (wateringStatus.isOverdue) return "text-red-600";
    if (wateringStatus.needsWater) return "text-orange-600";
    return "text-green-600";
  };

  const getStatusMessage = () => {
    if (wateringStatus.isOverdue) {
      return `Overdue by ${wateringStatus.daysSinceWatered - waterIntervalDays} day(s)`;
    }
    if (wateringStatus.needsWater) {
      return "Time to water!";
    }
    return `Water in ${wateringStatus.daysUntilWater} day(s)`;
  };

  return (
    <div
      ref={setNodeRef}
      className={`widget widget-plant absolute ${isDragging ? 'dragging' : ''} ${isSelected ? 'ring-2 ring-garden-primary' : ''}`}
      style={{
        ...style,
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        width: "200px",
        height: "160px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="widget-pin widget-pin-left"></div>
      <div className="widget-pin widget-pin-right"></div>
      
      <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-lg h-full relative">
        <Popover open={showSettings} onOpenChange={setShowSettings}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 p-1 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(true);
              }}
            >
              <Settings className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Plant Name</label>
                <Input
                  value={tempPlantName}
                  onChange={(e) => setTempPlantName(e.target.value)}
                  placeholder="Enter plant name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Watering Interval</label>
                <Select value={tempInterval} onValueChange={setTempInterval}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Every day</SelectItem>
                    <SelectItem value="2">Every 2 days</SelectItem>
                    <SelectItem value="3">Every 3 days</SelectItem>
                    <SelectItem value="5">Every 5 days</SelectItem>
                    <SelectItem value="7">Weekly</SelectItem>
                    <SelectItem value="14">Bi-weekly</SelectItem>
                    <SelectItem value="30">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {error && <p className="text-sm text-red-600">{error}</p>}
              
              <Button onClick={handleSettingsUpdate} className="w-full" size="sm">
                Update Settings
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex items-center mb-2">
          <Leaf className="w-4 h-4 text-green-600 mr-2" />
          <div className="text-sm font-medium text-green-800 truncate flex-1">{plantName}</div>
        </div>
        
        <div className="flex flex-col items-center justify-center flex-1 mb-3">
          {wateringStatus.needsWater ? (
            <div className="text-center">
              <Droplets className={`w-8 h-8 mx-auto mb-1 ${wateringStatus.isOverdue ? 'text-red-500' : 'text-blue-500'}`} />
              <div className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusMessage()}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-5 h-5 text-green-600 mr-1" />
                <div className="text-lg font-bold text-green-700">{wateringStatus.daysUntilWater}</div>
              </div>
              <div className="text-xs text-green-600">days until watering</div>
              <div className="text-xs text-green-500 mt-1">
                Next: {wateringStatus.nextWateringDate.toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="text-xs text-red-600 mb-2 text-center">{error}</div>
        )}
        
        <Button
          onClick={handleWatering}
          size="sm"
          className={`w-full text-xs ${wateringStatus.needsWater ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          {wateringStatus.needsWater ? 'Water Now!' : 'Mark as Watered'}
        </Button>
      </div>
    </div>
  );
};

export default PlantReminderWidget;
