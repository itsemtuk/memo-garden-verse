
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
import MoodTrackerWidget from "./MoodTrackerWidget";
import GoalTrackerWidget from "./GoalTrackerWidget";
import BookmarkManagerWidget from "./BookmarkManagerWidget";
import FileAttachmentWidget from "./FileAttachmentWidget";
import MusicPlayerWidget from "./MusicPlayerWidget";
import RecipePlannerWidget from "./RecipePlannerWidget";
import FitnessTrackerWidget from "./FitnessTrackerWidget";
import WeatherExtendedWidget from "./WeatherExtendedWidget";
import CountdownTimerWidget from "./CountdownTimerWidget";
import WhiteboardWidget from "./WhiteboardWidget";
import StockTickerWidget from "./StockTickerWidget";
import CurrencyConverterWidget from "./CurrencyConverterWidget";

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
  mood_tracker: MoodTrackerWidget,
  goal_tracker: GoalTrackerWidget,
  bookmark_manager: BookmarkManagerWidget,
  file_attachment: FileAttachmentWidget,
  music_player: MusicPlayerWidget,
  recipe_planner: RecipePlannerWidget,
  fitness_tracker: FitnessTrackerWidget,
  weather_extended: WeatherExtendedWidget,
  countdown_timer: CountdownTimerWidget,
  whiteboard: WhiteboardWidget,
  stock_ticker: StockTickerWidget,
  currency_converter: CurrencyConverterWidget,
  social: NoteWidget, // Placeholder for now
  // Placeholders for new widgets that need implementation
  translator: NoteWidget,
  travel_planner: NoteWidget,
  expense_tracker: NoteWidget,
  contact_list: NoteWidget,
  social_media_feed: NoteWidget,
  book_tracker: NoteWidget,
  flashcards: NoteWidget,
  news_headlines: NoteWidget,
};

export const WidgetRenderer = ({ widget, isSelected, onClick, onUpdate, onUpdateSettings }: WidgetRendererProps) => {
  const WidgetComponent = widgetRegistry[widget.type as keyof typeof widgetRegistry];
  
  if (!WidgetComponent) {
    console.warn(`Unknown widget type: ${widget.type}`);
    return null;
  }

  // Handle note widgets specifically
  if (widget.type === 'note' || widget.type === 'social') {
    return (
      <NoteWidget
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
        onUpdate={onUpdate}
      />
    );
  }

  // Handle image widgets
  if (widget.type === 'image') {
    return (
      <ImageWidget
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
      />
    );
  }

  // For all other specialized widgets, they expect onUpdate to be for settings
  const props = {
    widget,
    isSelected,
    onClick,
    onUpdate: onUpdateSettings || (() => {}),
  };

  return <WidgetComponent {...props} />;
};

export default WidgetRenderer;
