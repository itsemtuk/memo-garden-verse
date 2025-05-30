
import { Widget } from "@/types";
import NoteWidget from "./Note";
import ImageWidget from "./ImageWidget";
import WeatherWidget from "./WeatherWidget";
import PlantReminderWidget from "./PlantReminderWidget";
import ShoppingListWidget from "./ShoppingListWidget";
import CalendarWidget from "./CalendarWidget";
import TodoWidget from "./TodoWidget";
import RichTextWidget from "./RichTextWidget";
import TimerWidget from "./TimerWidget";
import HabitTrackerWidget from "./HabitTrackerWidget";
import NewsFeedWidget from "./NewsFeedWidget";
import QuotesWidget from "./QuotesWidget";

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
  calendar: CalendarWidget,
  todo_list: TodoWidget,
  rich_text: RichTextWidget,
  timer: TimerWidget,
  habit_tracker: HabitTrackerWidget,
  news_feed: NewsFeedWidget,
  quotes: QuotesWidget,
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

  // For specialized widgets that use onUpdateSettings
  const SpecializedComponent = WidgetComponent as any;
  return (
    <SpecializedComponent
      widget={widget}
      isSelected={isSelected}
      onClick={onClick}
      onUpdate={onUpdateSettings || (() => {})}
    />
  );
};

export default WidgetRenderer;
