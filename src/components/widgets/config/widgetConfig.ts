
import NoteWidget from "../Note";
import ImageWidget from "../ImageWidget";
import WeatherWidget from "../WeatherWidget";
import PlantReminderWidget from "../PlantReminderWidget";
import ShoppingListWidget from "../ShoppingListWidget";
import CalendarWidget from "../CalendarWidget";
import TodoWidget from "../TodoWidget";
import RichTextWidget from "../RichTextWidget";
import TimerWidget from "../TimerWidget";
import HabitTrackerWidget from "../HabitTrackerWidget";
import NewsFeedWidget from "../NewsFeedWidget";
import QuotesWidget from "../QuotesWidget";
import MoodTrackerWidget from "../MoodTrackerWidget";
import GoalTrackerWidget from "../GoalTrackerWidget";
import BookmarkManagerWidget from "../BookmarkManagerWidget";
import FileAttachmentWidget from "../FileAttachmentWidget";
import MusicPlayerWidget from "../MusicPlayerWidget";
import RecipePlannerWidget from "../RecipePlannerWidget";
import FitnessTrackerWidget from "../FitnessTrackerWidget";
import WeatherExtendedWidget from "../WeatherExtendedWidget";
import CountdownTimerWidget from "../CountdownTimerWidget";
import WhiteboardWidget from "../WhiteboardWidget";
import StockTickerWidget from "../StockTickerWidget";
import CurrencyConverterWidget from "../CurrencyConverterWidget";
import TranslatorWidget from "../TranslatorWidget";
import TravelPlannerWidget from "../TravelPlannerWidget";
import ExpenseTrackerWidget from "../ExpenseTrackerWidget";
import ContactListWidget from "../ContactListWidget";
import BookTrackerWidget from "../BookTrackerWidget";
import FlashcardsWidget from "../FlashcardsWidget";

export const widgetRegistry = {
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
