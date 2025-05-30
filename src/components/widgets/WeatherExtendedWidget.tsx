
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Snow } from "lucide-react";

interface WeatherExtendedWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const WeatherExtendedWidget = ({ widget, isSelected, onClick, onUpdate }: WeatherExtendedWidgetProps) => {
  const [forecast, setForecast] = useState([]);

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
    // Mock 7-day forecast data
    const mockForecast = [
      { day: 'Today', high: 22, low: 15, condition: 'sunny', icon: Sun },
      { day: 'Tomorrow', high: 19, low: 12, condition: 'cloudy', icon: Cloud },
      { day: 'Wed', high: 17, low: 10, condition: 'rainy', icon: CloudRain },
      { day: 'Thu', high: 20, low: 13, condition: 'sunny', icon: Sun },
      { day: 'Fri', high: 18, low: 11, condition: 'cloudy', icon: Cloud },
      { day: 'Sat', high: 16, low: 9, condition: 'rainy', icon: CloudRain },
      { day: 'Sun', high: 21, low: 14, condition: 'sunny', icon: Sun },
    ];
    setForecast(mockForecast);
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
        width: widget.size?.width || "320px",
        height: widget.size?.height || "280px",
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
          <Cloud className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">7-Day Forecast</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {forecast.map((day: any, index) => {
            const Icon = day.icon;
            return (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium w-16">{day.day}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-gray-500">{day.low}°</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-gray-500 text-center mt-2">
          Location: {widget.settings?.location || 'Default City'}
        </div>
      </div>
    </div>
  );
};

export default WeatherExtendedWidget;
