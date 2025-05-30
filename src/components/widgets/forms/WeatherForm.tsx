
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WeatherFormProps {
  location: string;
  onLocationChange: (location: string) => void;
  error?: string;
}

const popularLocations = [
  "New York", "London", "Tokyo", "Paris", "Sydney",
  "Berlin", "Toronto", "Los Angeles", "Barcelona", "Amsterdam"
];

export const WeatherForm = ({ location, onLocationChange, error }: WeatherFormProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Add weather widget</h3>
      <Input
        placeholder="Enter location (e.g., London, New York)"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <div className="flex flex-wrap gap-1 mt-2">
        {popularLocations.map((loc) => (
          <Button
            key={loc}
            variant="outline"
            size="sm"
            onClick={() => onLocationChange(loc)}
            className="text-xs h-6"
          >
            {loc}
          </Button>
        ))}
      </div>
    </div>
  );
};
