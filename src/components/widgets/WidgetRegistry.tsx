
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
import TranslatorWidget from "./TranslatorWidget";
import TravelPlannerWidget from "./TravelPlannerWidget";
import ExpenseTrackerWidget from "./ExpenseTrackerWidget";
import ContactListWidget from "./ContactListWidget";
import BookTrackerWidget from "./BookTrackerWidget";
import FlashcardsWidget from "./FlashcardsWidget";

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
  translator: TranslatorWidget,
  travel_planner: TravelPlannerWidget,
  expense_tracker: ExpenseTrackerWidget,
  contact_list: ContactListWidget,
  book_tracker: BookTrackerWidget,
  flashcards: FlashcardsWidget,
  social: NoteWidget, // Keep as placeholder for now
  social_media_feed: NoteWidget, // Will be placeholder until implemented
  news_headlines: NewsFeedWidget, // Use existing news feed component
};

export const WidgetRenderer = ({ widget, isSelected, onClick, onUpdate, onUpdateSettings }: WidgetRendererProps) => {
  const WidgetComponent = widgetRegistry[widget.type as keyof typeof widgetRegistry];
  
  if (!WidgetComponent) {
    console.warn(`Unknown widget type: ${widget.type}`);
    return (
      <div className="absolute bg-red-100 border-2 border-red-500 rounded-lg p-4 text-red-700"
           style={{
             left: `${widget.position.x}px`,
             top: `${widget.position.y}px`,
             transform: `rotate(${widget.rotation || 0}deg)`,
             zIndex: widget.settings?.zIndex || 1,
           }}>
        Unknown widget type: {widget.type}
      </div>
    );
  }

  // Handle note widgets and social widgets specifically
  if (widget.type === 'note' || widget.type === 'social' || widget.type === 'social_media_feed') {
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

  // Handle translator widget specifically - it uses onUpdate instead of onUpdateSettings
  if (widget.type === 'translator') {
    return (
      <TranslatorWidget
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
        onUpdate={onUpdateSettings || (() => {})}
      />
    );
  }

  // Handle specialized widgets that use settings-based updates
  if (['calendar', 'todo_list', 'shopping_list', 'timer', 'habit_tracker', 'mood_tracker', 
       'goal_tracker', 'bookmark_manager', 'file_attachment', 'music_player', 'recipe_planner',
       'fitness_tracker', 'countdown_timer', 'whiteboard', 'stock_ticker', 'currency_converter',
       'weather', 'weather_extended', 'plant_reminder', 'rich_text', 'news_feed', 'quotes',
       'travel_planner', 'expense_tracker', 'contact_list', 'book_tracker', 
       'flashcards', 'news_headlines'].includes(widget.type)) {
    return (
      <WidgetComponent
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
        onUpdate={onUpdateSettings || (() => {})}
      />
    );
  }

  // Fallback for any other widgets
  return (
    <WidgetComponent
      widget={widget}
      isSelected={isSelected}
      onClick={onClick}
      onUpdate={onUpdate}
      onUpdateSettings={onUpdateSettings}
    />
  );
};

export default WidgetRenderer;
