
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Snowflake, MapPin, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface WeatherWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const WeatherWidget = ({ widget, isSelected, onClick, onUpdate }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [tempLocation, setTempLocation] = useState("");
  
  const location = widget.settings?.location || "London";
  const temperatureUnit = widget.settings?.temperatureUnit || "C";

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
    // Enhanced mock weather data
    const mockWeatherData: Record<string, any> = {
      "London": { temp: 15, condition: "Partly Cloudy", icon: "cloud", humidity: 65, windSpeed: 12 },
      "New York": { temp: 22, condition: "Sunny", icon: "sun", humidity: 45, windSpeed: 8 },
      "Tokyo": { temp: 18, condition: "Rainy", icon: "rain", humidity: 80, windSpeed: 15 },
      "Paris": { temp: 12, condition: "Cloudy", icon: "cloud", humidity: 70, windSpeed: 10 },
      "Sydney": { temp: 25, condition: "Sunny", icon: "sun", humidity: 55, windSpeed: 18 },
      "Berlin": { temp: 8, condition: "Rainy", icon: "rain", humidity: 75, windSpeed: 14 },
      "Toronto": { temp: 5, condition: "Snow", icon: "snow", humidity: 85, windSpeed: 20 },
      "Los Angeles": { temp: 28, condition: "Sunny", icon: "sun", humidity: 40, windSpeed: 6 },
      "Barcelona": { temp: 20, condition: "Partly Cloudy", icon: "cloud", humidity: 60, windSpeed: 11 },
      "Amsterdam": { temp: 10, condition: "Rainy", icon: "rain", humidity: 78, windSpeed: 16 },
    };

    setTimeout(() => {
      const weatherData = mockWeatherData[location] || mockWeatherData["London"];
      
      // Convert temperature if needed
      let displayTemp = weatherData.temp;
      if (temperatureUnit === "F") {
        displayTemp = Math.round((weatherData.temp * 9/5) + 32);
      }
      
      setWeather({ ...weatherData, temp: displayTemp });
      setLoading(false);
    }, 1000);
  }, [location, temperatureUnit]);

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case "sun": return <Sun className="w-8 h-8 text-yellow-500" />;
      case "cloud": return <Cloud className="w-8 h-8 text-gray-500" />;
      case "rain": return <CloudRain className="w-8 h-8 text-blue-500" />;
      case "snow": return <Snowflake className="w-8 h-8 text-blue-200" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const handleLocationUpdate = () => {
    if (tempLocation.trim()) {
      onUpdate({
        ...widget.settings,
        location: tempLocation.trim(),
      });
      setShowSettings(false);
      setTempLocation("");
    }
  };

  const handleUnitChange = (unit: string) => {
    onUpdate({
      ...widget.settings,
      temperatureUnit: unit,
    });
  };

  const popularLocations = [
    "New York", "London", "Tokyo", "Paris", "Sydney",
    "Berlin", "Toronto", "Los Angeles", "Barcelona", "Amsterdam"
  ];

  return (
    <div
      ref={setNodeRef}
      className={`widget widget-weather absolute ${isDragging ? 'dragging' : ''} ${isSelected ? 'ring-2 ring-garden-primary' : ''}`}
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
      
      <div className="bg-gradient-to-br from-sky-100 to-sky-200 p-3 rounded-lg h-full relative">
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
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Enter city name..."
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLocationUpdate()}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {popularLocations.map((loc) => (
                    <Button
                      key={loc}
                      variant="outline"
                      size="sm"
                      onClick={() => setTempLocation(loc)}
                      className="text-xs h-6"
                    >
                      {loc}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Temperature Unit</label>
                <Select value={temperatureUnit} onValueChange={handleUnitChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="C">Celsius (°C)</SelectItem>
                    <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleLocationUpdate} className="w-full" size="sm">
                Update Location
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-gray-600">Loading...</div>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center text-sm font-medium text-gray-700">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center justify-center flex-1">
              {getWeatherIcon(weather?.icon)}
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">
                {weather?.temp}°{temperatureUnit}
              </div>
              <div className="text-xs text-gray-600">{weather?.condition}</div>
              <div className="text-xs text-gray-500 mt-1">
                {weather?.humidity}% humidity • {weather?.windSpeed} km/h
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;
