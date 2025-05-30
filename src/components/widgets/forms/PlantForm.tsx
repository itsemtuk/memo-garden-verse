
import { Input } from "@/components/ui/input";

interface PlantFormProps {
  plantName: string;
  onPlantNameChange: (name: string) => void;
  error?: string;
}

export const PlantForm = ({ plantName, onPlantNameChange, error }: PlantFormProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Add plant reminder</h3>
      <Input
        placeholder="Plant name (e.g., Monstera, Fiddle Leaf Fig)"
        value={plantName}
        onChange={(e) => onPlantNameChange(e.target.value)}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <p className="text-xs text-gray-600">
        Default watering interval: 3 days
      </p>
    </div>
  );
};
