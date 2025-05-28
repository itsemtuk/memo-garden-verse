
import { Widget } from "@/types";
import NoteWidget from "./Note";
import ImageWidget from "./ImageWidget";
import WeatherWidget from "./WeatherWidget";
import PlantReminderWidget from "./PlantReminderWidget";
import ShoppingListWidget from "./ShoppingListWidget";

interface WidgetRendererProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (content: string) => void;
  onUpdateSettings?: (settings: any) => void;
}

const widgetRegistry = {
  note: NoteWidget,
  image: ImageWidget,
  weather: WeatherWidget,
  plant_reminder: PlantReminderWidget,
  shopping_list: ShoppingListWidget,
  social: NoteWidget, // Placeholder for now
};

export const WidgetRenderer = ({ widget, isSelected, onClick, onUpdate, onUpdateSettings }: WidgetRendererProps) => {
  const WidgetComponent = widgetRegistry[widget.type as keyof typeof widgetRegistry];
  
  if (!WidgetComponent) {
    console.warn(`Unknown widget type: ${widget.type}`);
    return null;
  }

  // Handle different prop patterns for different widget types
  if (widget.type === 'note') {
    return (
      <WidgetComponent
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
        onUpdate={onUpdate}
      />
    );
  }

  if (widget.type === 'image') {
    return (
      <WidgetComponent
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
      />
    );
  }

  // For specialized widgets (weather, plant_reminder, shopping_list)
  // These widgets use onUpdateSettings to update their widget_settings
  return (
    <WidgetComponent
      widget={widget}
      isSelected={isSelected}
      onClick={onClick}
      onUpdate={onUpdateSettings}
    />
  );
};

export default WidgetRenderer;
