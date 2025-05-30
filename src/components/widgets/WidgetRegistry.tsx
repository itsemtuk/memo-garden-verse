
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
  if (widget.type === 'note' || widget.type === 'social') {
    const NoteComponent = WidgetComponent as typeof NoteWidget;
    return (
      <NoteComponent
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
        onUpdate={onUpdate}
      />
    );
  }

  if (widget.type === 'image') {
    const ImageComponent = WidgetComponent as typeof ImageWidget;
    return (
      <ImageComponent
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
      />
    );
  }

  // For specialized widgets (weather, plant_reminder, shopping_list)
  // These widgets use onUpdateSettings but expect it as onUpdate prop
  if (widget.type === 'weather') {
    const WeatherComponent = WidgetComponent as typeof WeatherWidget;
    return (
      <WeatherComponent
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
        onUpdate={onUpdateSettings || (() => {})}
      />
    );
  }

  if (widget.type === 'plant_reminder') {
    const PlantComponent = WidgetComponent as typeof PlantReminderWidget;
    return (
      <PlantComponent
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
        onUpdate={onUpdateSettings || (() => {})}
      />
    );
  }

  if (widget.type === 'shopping_list') {
    const ShoppingComponent = WidgetComponent as typeof ShoppingListWidget;
    return (
      <ShoppingComponent
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
        onUpdate={onUpdateSettings || (() => {})}
      />
    );
  }

  return null;
};

export default WidgetRenderer;
