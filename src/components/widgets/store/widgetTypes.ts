
import { WidgetType } from "@/types";
import { 
  Cloud, Leaf, ShoppingCart, StickyNote, Image, Calendar, 
  ListTodo, FileText, Timer, Target, Newspaper, Quote, Smile,
  Bookmark, File, Music, ChefHat, Activity, Clock, Brush,
  DollarSign, ArrowUpDown, Globe, MapPin, Receipt, Users,
  Rss, BookOpen, GraduationCap
} from "lucide-react";

export interface WidgetTypeInfo {
  id: WidgetType;
  label: string;
  icon: any;
  description: string;
  color: string;
  category: string;
}

export const widgetTypes: WidgetTypeInfo[] = [
  // Productivity
  { 
    id: "note" as WidgetType, 
    label: "Sticky Note", 
    icon: StickyNote,
    description: "Add quick notes and reminders",
    color: "bg-yellow-100 hover:bg-yellow-200",
    category: "productivity"
  },
  { 
    id: "todo_list" as WidgetType, 
    label: "Todo List", 
    icon: ListTodo,
    description: "Track tasks and to-dos",
    color: "bg-green-100 hover:bg-green-200",
    category: "productivity"
  },
  { 
    id: "calendar" as WidgetType, 
    label: "Calendar", 
    icon: Calendar,
    description: "Schedule and manage events",
    color: "bg-indigo-100 hover:bg-indigo-200",
    category: "productivity"
  },
  { 
    id: "timer" as WidgetType, 
    label: "Timer", 
    icon: Timer,
    description: "Pomodoro and focus timer",
    color: "bg-red-100 hover:bg-red-200",
    category: "productivity"
  },
  { 
    id: "rich_text" as WidgetType, 
    label: "Rich Text", 
    icon: FileText,
    description: "Formatted notes with styling",
    color: "bg-blue-100 hover:bg-blue-200",
    category: "productivity"
  },
  { 
    id: "countdown_timer" as WidgetType, 
    label: "Countdown Timer", 
    icon: Clock,
    description: "Track time to important dates",
    color: "bg-red-100 hover:bg-red-200",
    category: "productivity"
  },
  
  // Media & Content
  { 
    id: "image" as WidgetType, 
    label: "Image", 
    icon: Image,
    description: "Upload or link images",
    color: "bg-blue-100 hover:bg-blue-200",
    category: "media"
  },
  { 
    id: "music_player" as WidgetType, 
    label: "Music Player", 
    icon: Music,
    description: "Embed music or playlists",
    color: "bg-purple-100 hover:bg-purple-200",
    category: "media"
  },
  { 
    id: "file_attachment" as WidgetType, 
    label: "File Attachments", 
    icon: File,
    description: "Upload and preview documents",
    color: "bg-gray-100 hover:bg-gray-200",
    category: "media"
  },
  { 
    id: "whiteboard" as WidgetType, 
    label: "Whiteboard", 
    icon: Brush,
    description: "Free-form drawing and sketching",
    color: "bg-purple-100 hover:bg-purple-200",
    category: "media"
  },
  
  // Information & News
  { 
    id: "weather" as WidgetType, 
    label: "Weather", 
    icon: Cloud,
    description: "Display weather information",
    color: "bg-sky-100 hover:bg-sky-200",
    category: "information"
  },
  { 
    id: "weather_extended" as WidgetType, 
    label: "Extended Weather", 
    icon: Cloud,
    description: "Multi-day weather forecast",
    color: "bg-sky-100 hover:bg-sky-200",
    category: "information"
  },
  { 
    id: "news_feed" as WidgetType, 
    label: "News Feed", 
    icon: Newspaper,
    description: "Latest news and updates",
    color: "bg-gray-100 hover:bg-gray-200",
    category: "information"
  },
  { 
    id: "news_headlines" as WidgetType, 
    label: "News Headlines", 
    icon: Rss,
    description: "Quick news flashes",
    color: "bg-gray-100 hover:bg-gray-200",
    category: "information"
  },
  { 
    id: "quotes" as WidgetType, 
    label: "Daily Quotes", 
    icon: Quote,
    description: "Inspirational quotes",
    color: "bg-purple-100 hover:bg-purple-200",
    category: "information"
  },
  { 
    id: "stock_ticker" as WidgetType, 
    label: "Stock Ticker", 
    icon: DollarSign,
    description: "Track financial data",
    color: "bg-green-100 hover:bg-green-200",
    category: "information"
  },
  
  // Health & Lifestyle
  { 
    id: "plant_reminder" as WidgetType, 
    label: "Plant Care", 
    icon: Leaf,
    description: "Track plant watering schedules",
    color: "bg-green-100 hover:bg-green-200",
    category: "lifestyle"
  },
  { 
    id: "habit_tracker" as WidgetType, 
    label: "Habit Tracker", 
    icon: Target,
    description: "Track daily habits",
    color: "bg-green-100 hover:bg-green-200",
    category: "lifestyle"
  },
  { 
    id: "mood_tracker" as WidgetType, 
    label: "Mood Tracker", 
    icon: Smile,
    description: "Log and visualize daily moods",
    color: "bg-pink-100 hover:bg-pink-200",
    category: "lifestyle"
  },
  { 
    id: "fitness_tracker" as WidgetType, 
    label: "Fitness Tracker", 
    icon: Activity,
    description: "Log workouts and track fitness goals",
    color: "bg-green-100 hover:bg-green-200",
    category: "lifestyle"
  },
  { 
    id: "recipe_planner" as WidgetType, 
    label: "Recipe Planner", 
    icon: ChefHat,
    description: "Plan meals or store favorite recipes",
    color: "bg-orange-100 hover:bg-orange-200",
    category: "lifestyle"
  },
  
  // Organization & Planning
  { 
    id: "shopping_list" as WidgetType, 
    label: "Shopping List", 
    icon: ShoppingCart,
    description: "Keep track of items to buy",
    color: "bg-purple-100 hover:bg-purple-200",
    category: "organization"
  },
  { 
    id: "goal_tracker" as WidgetType, 
    label: "Goal Tracker", 
    icon: Target,
    description: "Set and monitor progress toward goals",
    color: "bg-blue-100 hover:bg-blue-200",
    category: "organization"
  },
  { 
    id: "bookmark_manager" as WidgetType, 
    label: "Bookmark Manager", 
    icon: Bookmark,
    description: "Save and organize useful links",
    color: "bg-orange-100 hover:bg-orange-200",
    category: "organization"
  },
  { 
    id: "travel_planner" as WidgetType, 
    label: "Travel Planner", 
    icon: MapPin,
    description: "Organize trips and itineraries",
    color: "bg-blue-100 hover:bg-blue-200",
    category: "organization"
  },
  { 
    id: "expense_tracker" as WidgetType, 
    label: "Expense Tracker", 
    icon: Receipt,
    description: "Monitor spending or group expenses",
    color: "bg-red-100 hover:bg-red-200",
    category: "organization"
  },
  { 
    id: "contact_list" as WidgetType, 
    label: "Contact List", 
    icon: Users,
    description: "Store team or personal contacts",
    color: "bg-gray-100 hover:bg-gray-200",
    category: "organization"
  },
  
  // Tools & Utilities
  { 
    id: "currency_converter" as WidgetType, 
    label: "Currency Converter", 
    icon: ArrowUpDown,
    description: "Quick currency calculations",
    color: "bg-green-100 hover:bg-green-200",
    category: "tools"
  },
  { 
    id: "translator" as WidgetType, 
    label: "Language Translator", 
    icon: Globe,
    description: "Translate snippets or notes",
    color: "bg-blue-100 hover:bg-blue-200",
    category: "tools"
  },
  
  // Learning & Social
  { 
    id: "book_tracker" as WidgetType, 
    label: "Book Tracker", 
    icon: BookOpen,
    description: "Track books and reading progress",
    color: "bg-orange-100 hover:bg-orange-200",
    category: "learning"
  },
  { 
    id: "flashcards" as WidgetType, 
    label: "Flashcards", 
    icon: GraduationCap,
    description: "Study aids for memorization",
    color: "bg-purple-100 hover:bg-purple-200",
    category: "learning"
  },
  { 
    id: "social_media_feed" as WidgetType, 
    label: "Social Media Feed", 
    icon: Rss,
    description: "Embed Twitter, Instagram, or other feeds",
    color: "bg-blue-100 hover:bg-blue-200",
    category: "social"
  },
];
