
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react";

interface WeatherWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const WeatherWidget = ({ widget, isSelected, onClick, onUpdate }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = widget.settings?.location || "London";

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 50 : isSelected ? 10 : 1,
  };

  useEffect(() => {
    // Mock weather data for demo purposes
    const mockWeatherData = {
      London: { temp: 15, condition: "Partly Cloudy", icon: "cloud" },
      "New York": { temp: 22, condition: "Sunny", icon: "sun" },
      Tokyo: { temp: 18, condition: "Rainy", icon: "rain" },
    };

    setTimeout(() => {
      setWeather(mockWeatherData[location as keyof typeof mockWeatherData] || mockWeatherData.London);
      setLoading(false);
    }, 1000);
  }, [location]);

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case "sun": return <Sun className="w-8 h-8 text-yellow-500" />;
      case "cloud": return <Cloud className="w-8 h-8 text-gray-500" />;
      case "rain": return <CloudRain className="w-8 h-8 text-blue-500" />;
      case "snow": return <Snowflake className="w-8 h-8 text-blue-200" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`widget widget-weather absolute ${isDragging ? 'dragging' : ''} ${isSelected ? 'ring-2 ring-garden-primary' : ''}`}
      style={{
        ...style,
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        width: "180px",
        height: "120px",
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
      
      <div className="bg-gradient-to-br from-sky-100 to-sky-200 p-3 rounded-lg h-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-gray-600">Loading...</div>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between">
            <div className="text-sm font-medium text-gray-700">{location}</div>
            <div className="flex items-center justify-center flex-1">
              {getWeatherIcon(weather?.icon)}
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{weather?.temp}°C</div>
              <div className="text-xs text-gray-600">{weather?.condition}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
