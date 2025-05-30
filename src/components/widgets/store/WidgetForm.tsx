
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WidgetType } from "@/types";
import { widgetTypes } from "./widgetTypes";
import { StickyNote } from "lucide-react";
import { validateContentSecurity } from "@/lib/contentSecurity";
import { useAuth } from "@/contexts/AuthContext";

interface WidgetFormProps {
  selectedWidget: WidgetType;
  formData: {
    noteContent: string;
    imageUrl: string;
    weatherLocation: string;
    temperatureUnit: string;
    plantName: string;
  };
  errors: Record<string, string>;
  uploading: boolean;
  onFormDataChange: (field: string, value: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddWidget: () => void;
  onBack: () => void;
  isFormValid: () => boolean;
  clearError: (field: string) => void;
}

const popularLocations = [
  "New York", "London", "Tokyo", "Paris", "Sydney",
  "Berlin", "Toronto", "Los Angeles", "Barcelona", "Amsterdam"
];

export const WidgetForm = ({
  selectedWidget,
  formData,
  errors,
  uploading,
  onFormDataChange,
  onFileUpload,
  onAddWidget,
  onBack,
  isFormValid,
  clearError
}: WidgetFormProps) => {
  const { user } = useAuth();
  const widgetInfo = widgetTypes.find(w => w.id === selectedWidget);
  const Icon = widgetInfo?.icon || StickyNote;

  // Enhanced validation with security checks
  const handleContentChange = (field: string, value: string) => {
    const securityCheck = validateContentSecurity(value, user?.id);
    if (!securityCheck.isValid) {
      // Don't update the field if it fails security validation
      return;
    }
    onFormDataChange(field, value);
    clearError(field);
  };

  const renderWidgetForm = () => {
    // For widgets that don't need forms, show simple info
    if (!['note', 'image', 'weather', 'plant_reminder'].includes(selectedWidget)) {
      return (
        <div className="space-y-4">
          <div className="text-center text-gray-600">
            <Icon className="w-12 h-12 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">{widgetInfo?.label} Widget</p>
            <p className="text-sm">{widgetInfo?.description}</p>
          </div>
        </div>
      );
    }

    switch (selectedWidget) {
      case "note":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Note Content</label>
              <Textarea
                placeholder="Write your note here..."
                value={formData.noteContent}
                onChange={(e) => handleContentChange('noteContent', e.target.value)}
                className="min-h-[100px]"
                maxLength={5000}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.noteContent.length}/5000 characters
              </div>
              {errors.note && <p className="text-sm text-red-600 mt-1">{errors.note}</p>}
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Upload Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={onFileUpload}
                disabled={uploading}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-garden-primary file:text-white hover:file:bg-garden-secondary"
              />
              {errors.file && <p className="text-sm text-red-600 mt-1">{errors.file}</p>}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">or</div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Image URL (HTTPS only)</label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleContentChange('imageUrl', e.target.value)}
              />
              {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
            </div>
          </div>
        );

      case "weather":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                placeholder="Enter city name..."
                value={formData.weatherLocation}
                onChange={(e) => handleContentChange('weatherLocation', e.target.value)}
                maxLength={100}
              />
              {errors.weather && <p className="text-sm text-red-600 mt-1">{errors.weather}</p>}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Popular Locations</label>
              <div className="flex flex-wrap gap-2">
                {popularLocations.map((location) => (
                  <Button
                    key={location}
                    variant="outline"
                    size="sm"
                    onClick={() => onFormDataChange('weatherLocation', location)}
                    className="text-xs"
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Temperature Unit</label>
              <Select 
                value={formData.temperatureUnit} 
                onValueChange={(value) => onFormDataChange('temperatureUnit', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C">Celsius (°C)</SelectItem>
                  <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "plant_reminder":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Plant Name</label>
              <Input
                placeholder="e.g., Monstera, Fiddle Leaf Fig"
                value={formData.plantName}
                onChange={(e) => handleContentChange('plantName', e.target.value)}
                maxLength={100}
              />
              {errors.plant && <p className="text-sm text-red-600 mt-1">{errors.plant}</p>}
            </div>
            <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-md">
              <p className="font-medium mb-1">Default Settings:</p>
              <p>• Watering interval: Every 3 days</p>
              <p>• Next reminder: Will be calculated automatically</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-garden-primary"
        >
          ← Back
        </Button>
        <h3 className="font-medium">{widgetInfo?.label}</h3>
      </div>
      
      {renderWidgetForm()}
      
      <div className="flex space-x-2 pt-4">
        <Button
          onClick={onAddWidget}
          disabled={!isFormValid() || uploading}
          className="flex-1 bg-garden-primary hover:bg-garden-secondary"
        >
          {uploading ? "Uploading..." : "Add to Board"}
        </Button>
        <Button
          variant="outline"
          onClick={onBack}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
