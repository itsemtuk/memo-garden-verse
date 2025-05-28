
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Droplets, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlantReminderWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const PlantReminderWidget = ({ widget, isSelected, onClick, onUpdate }: PlantReminderWidgetProps) => {
  const plantName = widget.settings?.plant_name || "My Plant";
  const lastWatered = widget.settings?.last_watered || new Date().toISOString();
  const waterIntervalDays = widget.settings?.water_interval_days || 3;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 50 : isSelected ? 10 : 1,
  };

  const daysSinceWatered = Math.floor(
    (new Date().getTime() - new Date(lastWatered).getTime()) / (1000 * 60 * 60 * 24)
  );
  const needsWater = daysSinceWatered >= waterIntervalDays;
  const daysUntilWater = Math.max(0, waterIntervalDays - daysSinceWatered);

  const handleWatering = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSettings = {
      ...widget.settings,
      last_watered: new Date().toISOString(),
    };
    onUpdate(newSettings);
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
        height: "140px",
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
      
      <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-lg h-full">
        <div className="flex items-center mb-2">
          <Leaf className="w-5 h-5 text-green-600 mr-2" />
          <div className="text-sm font-medium text-green-800 truncate">{plantName}</div>
        </div>
        
        <div className="flex flex-col items-center justify-center flex-1 mb-3">
          {needsWater ? (
            <div className="text-center">
              <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-blue-700">Time to water!</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-lg font-bold text-green-700">{daysUntilWater}</div>
              <div className="text-xs text-green-600">days until watering</div>
            </div>
          )}
        </div>
        
        <Button
          onClick={handleWatering}
          size="sm"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs"
        >
          Mark as Watered
        </Button>
      </div>
    </div>
  );
};

export default PlantReminderWidget;
