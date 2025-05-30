
import { Widget, WidgetType } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { 
  noteContentSchema, 
  plantNameSchema, 
  locationSchema, 
  imageUrlSchema 
} from "@/lib/security";

interface CreateWidgetParams {
  type: WidgetType;
  formData: {
    noteContent: string;
    imageUrl: string;
    weatherLocation: string;
    temperatureUnit: string;
    plantName: string;
  };
  centerPosition: { x: number; y: number };
}

export const createWidget = ({ type, formData, centerPosition }: CreateWidgetParams): Widget => {
  const now = new Date();
  const randomRotation = Math.floor(Math.random() * 6) - 3;

  switch (type) {
    case "note":
      const validatedContent = noteContentSchema.parse(formData.noteContent);
      return {
        id: uuidv4(),
        type: "note",
        content: validatedContent,
        position: {
          x: centerPosition.x - 100,
          y: centerPosition.y - 50,
        },
        rotation: randomRotation,
        createdAt: now,
        updatedAt: now,
      };

    case "image":
      const validatedUrl = imageUrlSchema.parse(formData.imageUrl);
      return {
        id: uuidv4(),
        type: "image",
        content: validatedUrl,
        position: {
          x: centerPosition.x - 150,
          y: centerPosition.y - 100,
        },
        rotation: randomRotation,
        size: { width: 250, height: "auto" },
        createdAt: now,
        updatedAt: now,
      };

    case "weather":
      const validatedLocation = locationSchema.parse(formData.weatherLocation);
      return {
        id: uuidv4(),
        type: "weather",
        content: "weather",
        position: {
          x: centerPosition.x - 90,
          y: centerPosition.y - 60,
        },
        rotation: randomRotation,
        size: { width: 200, height: 140 },
        settings: { 
          location: validatedLocation,
          temperatureUnit: formData.temperatureUnit 
        },
        createdAt: now,
        updatedAt: now,
      };

    case "plant_reminder":
      const validatedPlantName = plantNameSchema.parse(formData.plantName);
      return {
        id: uuidv4(),
        type: "plant_reminder",
        content: "plant_reminder",
        position: {
          x: centerPosition.x - 100,
          y: centerPosition.y - 70,
        },
        rotation: randomRotation,
        size: { width: 200, height: 160 },
        settings: {
          plant_name: validatedPlantName,
          last_watered: new Date().toISOString(),
          water_interval_days: 3,
          next_watering: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        createdAt: now,
        updatedAt: now,
      };

    case "calendar":
      return {
        id: uuidv4(),
        type: "calendar",
        content: "calendar",
        position: {
          x: centerPosition.x - 140,
          y: centerPosition.y - 160,
        },
        rotation: randomRotation,
        size: { width: 280, height: 320 },
        settings: {
          events: [],
          zIndex: 1,
        },
        createdAt: now,
        updatedAt: now,
      };

    case "travel_planner":
      return {
        id: uuidv4(),
        type: "travel_planner",
        content: "travel_planner",
        position: {
          x: centerPosition.x - 150,
          y: centerPosition.y - 200,
        },
        rotation: randomRotation,
        size: { width: 300, height: 400 },
        settings: {
          items: [],
          zIndex: 1,
        },
        createdAt: now,
        updatedAt: now,
      };

    // For all other widgets that don't need special form handling
    default:
      return {
        id: uuidv4(),
        type: type,
        content: type,
        position: {
          x: centerPosition.x - 160,
          y: centerPosition.y - 140,
        },
        rotation: randomRotation,
        size: { width: 320, height: 280 },
        settings: {
          zIndex: 1,
        },
        createdAt: now,
        updatedAt: now,
      };
  }
};
