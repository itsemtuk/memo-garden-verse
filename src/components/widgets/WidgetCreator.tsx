
import { useState } from "react";
import { Widget, WidgetType } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useFileUpload } from "@/hooks/useFileUpload";
import { 
  noteContentSchema, 
  plantNameSchema, 
  locationSchema, 
  imageUrlSchema,
  validateImageFile 
} from "@/lib/security";
import { handleValidationError } from "@/lib/errorHandling";

interface UseWidgetCreatorProps {
  boardId: string;
  centerPosition: { x: number; y: number };
  onAddWidget: (widget: Widget) => void;
}

export const useWidgetCreator = ({ boardId, centerPosition, onAddWidget }: UseWidgetCreatorProps) => {
  const [formData, setFormData] = useState({
    noteContent: "",
    imageUrl: "",
    weatherLocation: "",
    plantName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { uploadImage, uploading } = useFileUpload(boardId);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const errorField = field === 'plantName' ? 'plant' : field.replace('Content', '').replace('Location', '');
    clearError(errorField);
  };

  const resetForm = () => {
    setFormData({
      noteContent: "",
      imageUrl: "",
      weatherLocation: "",
      plantName: "",
    });
    setErrors({});
  };

  const isFormValid = (type: WidgetType): boolean => {
    switch (type) {
      case "note":
        return formData.noteContent.trim().length > 0;
      case "image":
        return formData.imageUrl.trim().length > 0;
      case "weather":
        return formData.weatherLocation.trim().length > 0;
      case "plant_reminder":
        return formData.plantName.trim().length > 0;
      case "shopping_list":
        return true;
      default:
        return false;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, file: validation.error! }));
      return;
    }

    try {
      clearError('file');
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl }));
    } catch (error) {
      setErrors(prev => ({ ...prev, file: 'Failed to upload image. Please try again.' }));
    }
  };

  const createWidget = async (type: WidgetType) => {
    const now = new Date();
    const randomRotation = Math.floor(Math.random() * 6) - 3;
    let newWidget: Widget | null = null;

    console.log('Creating widget:', type, 'at position:', centerPosition);

    try {
      switch (type) {
        case "note":
          const validatedContent = noteContentSchema.parse(formData.noteContent);
          newWidget = {
            id: uuidv4(),
            type: "note",
            content: validatedContent,
            position: { x: centerPosition.x - 100, y: centerPosition.y - 50 },
            rotation: randomRotation,
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "image":
          const validatedUrl = imageUrlSchema.parse(formData.imageUrl);
          newWidget = {
            id: uuidv4(),
            type: "image",
            content: validatedUrl,
            position: { x: centerPosition.x - 150, y: centerPosition.y - 100 },
            rotation: randomRotation,
            size: { width: 250, height: "auto" },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "weather":
          const validatedLocation = locationSchema.parse(formData.weatherLocation);
          newWidget = {
            id: uuidv4(),
            type: "weather",
            content: "weather",
            position: { x: centerPosition.x - 90, y: centerPosition.y - 60 },
            rotation: randomRotation,
            size: { width: 180, height: 120 },
            settings: { location: validatedLocation },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "plant_reminder":
          const validatedPlantName = plantNameSchema.parse(formData.plantName);
          newWidget = {
            id: uuidv4(),
            type: "plant_reminder",
            content: "plant_reminder",
            position: { x: centerPosition.x - 100, y: centerPosition.y - 70 },
            rotation: randomRotation,
            size: { width: 200, height: 140 },
            settings: {
              plant_name: validatedPlantName,
              last_watered: new Date().toISOString(),
              water_interval_days: 3,
            },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "shopping_list":
          newWidget = {
            id: uuidv4(),
            type: "shopping_list",
            content: "shopping_list",
            position: { x: centerPosition.x - 110, y: centerPosition.y - 140 },
            rotation: randomRotation,
            size: { width: 220, height: 280 },
            settings: { items: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;
      }

      if (newWidget) {
        console.log('Widget created successfully:', newWidget);
        onAddWidget(newWidget);
        return true;
      }
    } catch (error) {
      console.error('Error creating widget:', error);
      const errorMessage = handleValidationError(error);
      const errorField = type === 'plant_reminder' ? 'plant' : type;
      setErrors(prev => ({ ...prev, [errorField]: errorMessage }));
      return false;
    }
    return false;
  };

  return {
    formData,
    errors,
    uploading,
    updateFormData,
    resetForm,
    isFormValid,
    handleFileUpload,
    createWidget,
  };
};
