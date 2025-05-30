
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePlantAPI } from "@/hooks/usePlantAPI";
import { useEffect, useState } from "react";
import { Leaf, Search } from "lucide-react";

interface PlantFormProps {
  plantName: string;
  onPlantNameChange: (name: string) => void;
  error?: string;
}

export const PlantForm = ({ plantName, onPlantNameChange, error }: PlantFormProps) => {
  const { loading, searchResults, searchPlants } = usePlantAPI();
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        searchPlants(searchQuery);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchPlants]);

  const handlePlantSelect = (plant: any) => {
    onPlantNameChange(plant.common_name);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    onPlantNameChange(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Leaf className="w-5 h-5 text-green-600" />
        Add plant reminder
      </h3>
      
      <div className="relative">
        <div className="relative">
          <Input
            placeholder="Search for a plant (e.g., Monstera, Fiddle Leaf Fig)"
            value={searchQuery || plantName}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        
        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {loading && (
              <div className="p-3 text-center text-gray-500">
                Searching plants...
              </div>
            )}
            {searchResults.slice(0, 10).map((plant) => (
              <button
                key={plant.id}
                onClick={() => handlePlantSelect(plant)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-b-0 focus:outline-none focus:bg-blue-50"
              >
                <div className="flex items-center gap-3">
                  {plant.default_image?.thumbnail ? (
                    <img 
                      src={plant.default_image.thumbnail} 
                      alt={plant.common_name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-sm">{plant.common_name}</div>
                    {plant.scientific_name?.[0] && (
                      <div className="text-xs text-gray-500 italic">
                        {plant.scientific_name[0]}
                      </div>
                    )}
                    {plant.watering && (
                      <div className="text-xs text-blue-600">
                        Watering: {plant.watering}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {showResults && searchResults.length === 0 && !loading && searchQuery.length > 2 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 text-center text-gray-500">
            No plants found. Try a different search term.
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-md">
        <p className="font-medium mb-1">💡 Tips:</p>
        <p>• Search by common name (e.g., "Snake Plant", "Pothos")</p>
        <p>• Watering schedule will be automatically set based on plant type</p>
        <p>• You can always adjust the watering interval later</p>
      </div>
    </div>
  );
};
