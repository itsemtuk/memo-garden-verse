import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Widget, WidgetType } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useFileUpload } from "@/hooks/useFileUpload";
import { 
  Cloud, Leaf, ShoppingCart, StickyNote, Image, Plus, Calendar, 
  ListTodo, FileText, Timer, Target, Newspaper, Quote, Smile,
  Bookmark, File, Music, ChefHat, Activity, Clock
} from "lucide-react";
import { 
  noteContentSchema, 
  plantNameSchema, 
  locationSchema, 
  imageUrlSchema,
  validateImageFile 
} from "@/lib/security";
import { handleValidationError } from "@/lib/errorHandling";

interface WidgetStoreProps {
  onAddWidget: (widget: Widget) => void;
  centerPosition: { x: number; y: number };
  boardId: string;
}

const WidgetStore = ({ onAddWidget, centerPosition, boardId }: WidgetStoreProps) => {
  const [open, setOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetType | null>(null);
  const [formData, setFormData] = useState({
    noteContent: "",
    imageUrl: "",
    weatherLocation: "",
    temperatureUnit: "C",
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

  const resetForm = () => {
    setFormData({
      noteContent: "",
      imageUrl: "",
      weatherLocation: "",
      temperatureUnit: "C",
      plantName: "",
    });
    setErrors({});
    setSelectedWidget(null);
  };

  const widgetTypes = [
    { 
      id: "note" as WidgetType, 
      label: "Sticky Note", 
      icon: StickyNote,
      description: "Add quick notes and reminders",
      color: "bg-yellow-100 hover:bg-yellow-200"
    },
    { 
      id: "image" as WidgetType, 
      label: "Image", 
      icon: Image,
      description: "Upload or link images",
      color: "bg-blue-100 hover:bg-blue-200"
    },
    { 
      id: "weather" as WidgetType, 
      label: "Weather", 
      icon: Cloud,
      description: "Display weather information",
      color: "bg-sky-100 hover:bg-sky-200"
    },
    { 
      id: "plant_reminder" as WidgetType, 
      label: "Plant Care", 
      icon: Leaf,
      description: "Track plant watering schedules",
      color: "bg-green-100 hover:bg-green-200"
    },
    { 
      id: "shopping_list" as WidgetType, 
      label: "Shopping List", 
      icon: ShoppingCart,
      description: "Keep track of items to buy",
      color: "bg-purple-100 hover:bg-purple-200"
    },
    { 
      id: "calendar" as WidgetType, 
      label: "Calendar", 
      icon: Calendar,
      description: "Schedule and manage events",
      color: "bg-indigo-100 hover:bg-indigo-200"
    },
    { 
      id: "todo_list" as WidgetType, 
      label: "Todo List", 
      icon: ListTodo,
      description: "Track tasks and to-dos",
      color: "bg-green-100 hover:bg-green-200"
    },
    { 
      id: "rich_text" as WidgetType, 
      label: "Rich Text", 
      icon: FileText,
      description: "Formatted notes with styling",
      color: "bg-blue-100 hover:bg-blue-200"
    },
    { 
      id: "timer" as WidgetType, 
      label: "Timer", 
      icon: Timer,
      description: "Pomodoro and focus timer",
      color: "bg-red-100 hover:bg-red-200"
    },
    { 
      id: "habit_tracker" as WidgetType, 
      label: "Habit Tracker", 
      icon: Target,
      description: "Track daily habits",
      color: "bg-green-100 hover:bg-green-200"
    },
    { 
      id: "news_feed" as WidgetType, 
      label: "News Feed", 
      icon: Newspaper,
      description: "Latest news and updates",
      color: "bg-gray-100 hover:bg-gray-200"
    },
    { 
      id: "quotes" as WidgetType, 
      label: "Daily Quotes", 
      icon: Quote,
      description: "Inspirational quotes",
      color: "bg-purple-100 hover:bg-purple-200"
    },
    { 
      id: "mood_tracker" as WidgetType, 
      label: "Mood Tracker", 
      icon: Smile,
      description: "Log and visualize daily moods",
      color: "bg-pink-100 hover:bg-pink-200"
    },
    { 
      id: "goal_tracker" as WidgetType, 
      label: "Goal Tracker", 
      icon: Target,
      description: "Set and monitor progress toward goals",
      color: "bg-blue-100 hover:bg-blue-200"
    },
    { 
      id: "bookmark_manager" as WidgetType, 
      label: "Bookmark Manager", 
      icon: Bookmark,
      description: "Save and organize useful links",
      color: "bg-orange-100 hover:bg-orange-200"
    },
    { 
      id: "file_attachment" as WidgetType, 
      label: "File Attachments", 
      icon: File,
      description: "Upload and preview documents",
      color: "bg-gray-100 hover:bg-gray-200"
    },
    { 
      id: "music_player" as WidgetType, 
      label: "Music Player", 
      icon: Music,
      description: "Embed music or playlists",
      color: "bg-purple-100 hover:bg-purple-200"
    },
    { 
      id: "recipe_planner" as WidgetType, 
      label: "Recipe Planner", 
      icon: ChefHat,
      description: "Plan meals or store favorite recipes",
      color: "bg-orange-100 hover:bg-orange-200"
    },
    { 
      id: "fitness_tracker" as WidgetType, 
      label: "Fitness Tracker", 
      icon: Activity,
      description: "Log workouts and track fitness goals",
      color: "bg-green-100 hover:bg-green-200"
    },
    { 
      id: "weather_extended" as WidgetType, 
      label: "Extended Weather", 
      icon: Cloud,
      description: "Multi-day weather forecast",
      color: "bg-sky-100 hover:bg-sky-200"
    },
    { 
      id: "countdown_timer" as WidgetType, 
      label: "Countdown Timer", 
      icon: Clock,
      description: "Track time to important dates",
      color: "bg-red-100 hover:bg-red-200"
    },
  ];

  const handleAddWidget = async () => {
    if (!selectedWidget) return;

    const now = new Date();
    const randomRotation = Math.floor(Math.random() * 6) - 3;
    let newWidget: Widget | null = null;

    try {
      switch (selectedWidget) {
        case "note":
          const validatedContent = noteContentSchema.parse(formData.noteContent);
          newWidget = {
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
          clearError('note');
          break;

        case "image":
          const validatedUrl = imageUrlSchema.parse(formData.imageUrl);
          newWidget = {
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
          clearError('image');
          break;

        case "weather":
          const validatedLocation = locationSchema.parse(formData.weatherLocation);
          newWidget = {
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
          clearError('weather');
          break;

        case "plant_reminder":
          const validatedPlantName = plantNameSchema.parse(formData.plantName);
          newWidget = {
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
          clearError('plant');
          break;

        case "shopping_list":
          newWidget = {
            id: uuidv4(),
            type: "shopping_list",
            content: "shopping_list",
            position: {
              x: centerPosition.x - 110,
              y: centerPosition.y - 140,
            },
            rotation: randomRotation,
            size: { width: 220, height: 280 },
            settings: { items: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "calendar":
          newWidget = {
            id: uuidv4(),
            type: "calendar",
            content: "calendar",
            position: {
              x: centerPosition.x - 140,
              y: centerPosition.y - 160,
            },
            rotation: randomRotation,
            size: { width: 280, height: 320 },
            settings: { events: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "todo_list":
          newWidget = {
            id: uuidv4(),
            type: "todo_list",
            content: "todo_list",
            position: {
              x: centerPosition.x - 130,
              y: centerPosition.y - 150,
            },
            rotation: randomRotation,
            size: { width: 260, height: 300 },
            settings: { todos: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "rich_text":
          newWidget = {
            id: uuidv4(),
            type: "rich_text",
            content: "rich_text",
            position: {
              x: centerPosition.x - 160,
              y: centerPosition.y - 120,
            },
            rotation: randomRotation,
            size: { width: 320, height: 240 },
            settings: { content: "" },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "timer":
          newWidget = {
            id: uuidv4(),
            type: "timer",
            content: "timer",
            position: {
              x: centerPosition.x - 100,
              y: centerPosition.y - 120,
            },
            rotation: randomRotation,
            size: { width: 200, height: 240 },
            settings: { duration: 1500 },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "habit_tracker":
          newWidget = {
            id: uuidv4(),
            type: "habit_tracker",
            content: "habit_tracker",
            position: {
              x: centerPosition.x - 140,
              y: centerPosition.y - 160,
            },
            rotation: randomRotation,
            size: { width: 280, height: 320 },
            settings: { habits: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "news_feed":
          newWidget = {
            id: uuidv4(),
            type: "news_feed",
            content: "news_feed",
            position: {
              x: centerPosition.x - 160,
              y: centerPosition.y - 140,
            },
            rotation: randomRotation,
            size: { width: 320, height: 280 },
            settings: { news: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "quotes":
          newWidget = {
            id: uuidv4(),
            type: "quotes",
            content: "quotes",
            position: {
              x: centerPosition.x - 150,
              y: centerPosition.y - 100,
            },
            rotation: randomRotation,
            size: { width: 300, height: 200 },
            settings: {},
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "mood_tracker":
          newWidget = {
            id: uuidv4(),
            type: "mood_tracker",
            content: "mood_tracker",
            position: {
              x: centerPosition.x - 140,
              y: centerPosition.y - 160,
            },
            rotation: randomRotation,
            size: { width: 280, height: 320 },
            settings: { moods: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "goal_tracker":
          newWidget = {
            id: uuidv4(),
            type: "goal_tracker",
            content: "goal_tracker",
            position: {
              x: centerPosition.x - 150,
              y: centerPosition.y - 175,
            },
            rotation: randomRotation,
            size: { width: 300, height: 350 },
            settings: { goals: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "bookmark_manager":
          newWidget = {
            id: uuidv4(),
            type: "bookmark_manager",
            content: "bookmark_manager",
            position: {
              x: centerPosition.x - 160,
              y: centerPosition.y - 200,
            },
            rotation: randomRotation,
            size: { width: 320, height: 400 },
            settings: { bookmarks: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "file_attachment":
          newWidget = {
            id: uuidv4(),
            type: "file_attachment",
            content: "file_attachment",
            position: {
              x: centerPosition.x - 160,
              y: centerPosition.y - 175,
            },
            rotation: randomRotation,
            size: { width: 320, height: 350 },
            settings: { files: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "music_player":
          newWidget = {
            id: uuidv4(),
            type: "music_player",
            content: "music_player",
            position: {
              x: centerPosition.x - 150,
              y: centerPosition.y - 125,
            },
            rotation: randomRotation,
            size: { width: 300, height: 250 },
            settings: { playlist: [], volume: [50] },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "recipe_planner":
          newWidget = {
            id: uuidv4(),
            type: "recipe_planner",
            content: "recipe_planner",
            position: {
              x: centerPosition.x - 160,
              y: centerPosition.y - 200,
            },
            rotation: randomRotation,
            size: { width: 320, height: 400 },
            settings: { recipes: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "fitness_tracker":
          newWidget = {
            id: uuidv4(),
            type: "fitness_tracker",
            content: "fitness_tracker",
            position: {
              x: centerPosition.x - 150,
              y: centerPosition.y - 175,
            },
            rotation: randomRotation,
            size: { width: 300, height: 350 },
            settings: { 
              workouts: [],
              dailyGoals: {
                steps: { current: 0, target: 10000 },
                calories: { current: 0, target: 2000 },
                water: { current: 0, target: 8 }
              }
            },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "weather_extended":
          newWidget = {
            id: uuidv4(),
            type: "weather_extended",
            content: "weather_extended",
            position: {
              x: centerPosition.x - 160,
              y: centerPosition.y - 140,
            },
            rotation: randomRotation,
            size: { width: 320, height: 280 },
            settings: { location: "Default City" },
            createdAt: now,
            updatedAt: now,
          };
          break;

        case "countdown_timer":
          newWidget = {
            id: uuidv4(),
            type: "countdown_timer",
            content: "countdown_timer",
            position: {
              x: centerPosition.x - 150,
              y: centerPosition.y - 175,
            },
            rotation: randomRotation,
            size: { width: 300, height: 350 },
            settings: { countdowns: [] },
            createdAt: now,
            updatedAt: now,
          };
          break;
      }

      if (newWidget) {
        onAddWidget(newWidget);
        setOpen(false);
        resetForm();
      }
    } catch (error) {
      const errorMessage = handleValidationError(error);
      const errorField = selectedWidget === 'plant_reminder' ? 'plant' : selectedWidget;
      setErrors(prev => ({ ...prev, [errorField]: errorMessage }));
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
      setSelectedWidget("image");
    } catch (error) {
      setErrors(prev => ({ ...prev, file: 'Failed to upload image. Please try again.' }));
    }
  };

  const popularLocations = [
    "New York", "London", "Tokyo", "Paris", "Sydney",
    "Berlin", "Toronto", "Los Angeles", "Barcelona", "Amsterdam"
  ];

  const renderWidgetForm = () => {
    if (!selectedWidget) return null;

    // For new widgets that don't need forms, show simple info
    if (['calendar', 'todo_list', 'rich_text', 'timer', 'habit_tracker', 'news_feed', 'quotes', 'mood_tracker', 'goal_tracker', 'bookmark_manager', 'file_attachment', 'music_player', 'recipe_planner', 'fitness_tracker', 'weather_extended', 'countdown_timer'].includes(selectedWidget)) {
      const widgetInfo = widgetTypes.find(w => w.id === selectedWidget);
      const Icon = widgetInfo?.icon || StickyNote;
      
      return (
        <div className="space-y-4">
          <div className="text-center text-gray-600">
            <Icon className="w-12 h-12 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">{widgetInfo?.label} Widget</p>
            <p className="text-sm">{widgetInfo?.description}</p>
          </div>
        </div>
      );
    }

    switch (selectedWidget) {
      case "note":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Note Content</label>
              <Textarea
                placeholder="Write your note here..."
                value={formData.noteContent}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, noteContent: e.target.value }));
                  clearError('note');
                }}
                className="min-h-[100px]"
              />
              {errors.note && <p className="text-sm text-red-600 mt-1">{errors.note}</p>}
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Upload Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-garden-primary file:text-white hover:file:bg-garden-secondary"
              />
              {errors.file && <p className="text-sm text-red-600 mt-1">{errors.file}</p>}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">or</div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Image URL (HTTPS only)</label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
                  clearError('image');
                }}
              />
              {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
            </div>
          </div>
        );

      case "weather":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                placeholder="Enter city name..."
                value={formData.weatherLocation}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, weatherLocation: e.target.value }));
                  clearError('weather');
                }}
              />
              {errors.weather && <p className="text-sm text-red-600 mt-1">{errors.weather}</p>}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Popular Locations</label>
              <div className="flex flex-wrap gap-2">
                {popularLocations.map((location) => (
                  <Button
                    key={location}
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, weatherLocation: location }))}
                    className="text-xs"
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Temperature Unit</label>
              <Select 
                value={formData.temperatureUnit} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, temperatureUnit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C">Celsius (°C)</SelectItem>
                  <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "plant_reminder":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Plant Name</label>
              <Input
                placeholder="e.g., Monstera, Fiddle Leaf Fig"
                value={formData.plantName}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, plantName: e.target.value }));
                  clearError('plant');
                }}
              />
              {errors.plant && <p className="text-sm text-red-600 mt-1">{errors.plant}</p>}
            </div>
            <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-md">
              <p className="font-medium mb-1">Default Settings:</p>
              <p>• Watering interval: Every 3 days</p>
              <p>• Next reminder: Will be calculated automatically</p>
            </div>
          </div>
        );

      case "shopping_list":
        return (
          <div className="space-y-4">
            <div className="text-center text-gray-600">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-purple-500" />
              <p className="font-medium">Shopping List Widget</p>
              <p className="text-sm">Create a new shopping list to keep track of items you need to buy.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isFormValid = () => {
    switch (selectedWidget) {
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
      case "calendar":
      case "todo_list":
      case "rich_text":
      case "timer":
      case "habit_tracker":
      case "news_feed":
      case "quotes":
      case "mood_tracker":
      case "goal_tracker":
      case "bookmark_manager":
      case "file_attachment":
      case "music_player":
      case "recipe_planner":
      case "fitness_tracker":
      case "weather_extended":
      case "countdown_timer":
        return true;
      default:
        return false;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-garden-primary hover:bg-garden-secondary"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Widget Store</SheetTitle>
          <SheetDescription>
            Choose a widget to add to your board
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {!selectedWidget ? (
            <div className="grid gap-3">
              {widgetTypes.map((widget) => {
                const Icon = widget.icon;
                return (
                  <button
                    key={widget.id}
                    onClick={() => setSelectedWidget(widget.id)}
                    className={`p-4 rounded-lg border-2 border-transparent hover:border-garden-primary transition-all ${widget.color} text-left`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Icon className="w-8 h-8 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{widget.label}</h3>
                        <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWidget(null)}
                  className="text-garden-primary"
                >
                  ← Back
                </Button>
                <h3 className="font-medium">
                  {widgetTypes.find(w => w.id === selectedWidget)?.label}
                </h3>
              </div>
              
              {renderWidgetForm()}
              
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={handleAddWidget}
                  disabled={!isFormValid() || uploading}
                  className="flex-1 bg-garden-primary hover:bg-garden-secondary"
                >
                  {uploading ? "Uploading..." : "Add to Board"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedWidget(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WidgetStore;
