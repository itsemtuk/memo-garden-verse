
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { WidgetType } from "@/types";
import { NoteForm } from "./NoteForm";
import { ImageForm } from "./ImageForm";
import { WeatherForm } from "./WeatherForm";
import { PlantForm } from "./PlantForm";
import { ShoppingListForm } from "./ShoppingListForm";

interface WidgetTabContentProps {
  type: WidgetType;
  formData: {
    noteContent: string;
    imageUrl: string;
    weatherLocation: string;
    plantName: string;
  };
  errors: Record<string, string>;
  uploading: boolean;
  onFormDataChange: (field: string, value: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddWidget: (type: WidgetType) => void;
  isFormValid: (type: WidgetType) => boolean;
}

export const WidgetTabContent = ({
  type,
  formData,
  errors,
  uploading,
  onFormDataChange,
  onFileUpload,
  onAddWidget,
  isFormValid,
}: WidgetTabContentProps) => {
  const renderForm = () => {
    switch (type) {
      case "note":
        return (
          <NoteForm
            content={formData.noteContent}
            onChange={(value) => onFormDataChange('noteContent', value)}
            error={errors.note}
          />
        );
      case "image":
        return (
          <ImageForm
            imageUrl={formData.imageUrl}
            onUrlChange={(value) => onFormDataChange('imageUrl', value)}
            onFileUpload={onFileUpload}
            uploading={uploading}
            errors={{ file: errors.file, image: errors.image }}
          />
        );
      case "weather":
        return (
          <WeatherForm
            location={formData.weatherLocation}
            onLocationChange={(value) => onFormDataChange('weatherLocation', value)}
            error={errors.weather}
          />
        );
      case "plant_reminder":
        return (
          <PlantForm
            plantName={formData.plantName}
            onPlantNameChange={(value) => onFormDataChange('plantName', value)}
            error={errors.plant}
          />
        );
      case "shopping_list":
        return <ShoppingListForm />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    if (uploading) return "Uploading...";
    switch (type) {
      case "note": return "Add Note";
      case "image": return "Add Image";
      case "weather": return "Add Weather Widget";
      case "plant_reminder": return "Add Plant Reminder";
      case "shopping_list": return "Add Shopping List";
      default: return "Add Widget";
    }
  };

  return (
    <TabsContent value={type} className="space-y-4 pt-4">
      {renderForm()}
      <Button
        className="w-full bg-garden-primary hover:bg-garden-secondary"
        onClick={() => onAddWidget(type)}
        disabled={!isFormValid(type) || uploading}
      >
        {getButtonText()}
      </Button>
    </TabsContent>
  );
};
