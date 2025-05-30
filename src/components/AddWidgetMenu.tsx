
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Widget, WidgetType } from "@/types";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Cloud, Leaf, ShoppingCart, StickyNote, Image } from "lucide-react";
import { 
  noteContentSchema, 
  plantNameSchema, 
  locationSchema, 
  imageUrlSchema,
  validateImageFile 
} from "@/lib/security";
import { handleValidationError } from "@/lib/errorHandling";

interface AddWidgetMenuProps {
  onAddWidget: (widget: Widget) => void;
  centerPosition: { x: number; y: number };
  boardId: string;
}

const AddWidgetMenu = ({ onAddWidget, centerPosition, boardId }: AddWidgetMenuProps) => {
  const [noteContent, setNoteContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [weatherLocation, setWeatherLocation] = useState("");
  const [plantName, setPlantName] = useState("");
  const [open, setOpen] = useState(false);
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

  const handleAddWidget = (type: WidgetType) => {
    const now = new Date();
    const randomRotation = Math.floor(Math.random() * 6) - 3;
    let newWidget: Widget | null = null;

    try {
      switch (type) {
        case "note":
          const validatedContent = noteContentSchema.parse(noteContent);
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
          setNoteContent("");
          clearError('note');
          break;

        case "image":
          const validatedUrl = imageUrlSchema.parse(imageUrl);
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
          setImageUrl("");
          clearError('image');
          break;

        case "weather":
          const validatedLocation = locationSchema.parse(weatherLocation);
          newWidget = {
            id: uuidv4(),
            type: "weather",
            content: "weather",
            position: {
              x: centerPosition.x - 90,
              y: centerPosition.y - 60,
            },
            rotation: randomRotation,
            size: { width: 180, height: 120 },
            settings: { location: validatedLocation },
            createdAt: now,
            updatedAt: now,
          };
          setWeatherLocation("");
          clearError('weather');
          break;

        case "plant_reminder":
          const validatedPlantName = plantNameSchema.parse(plantName);
          newWidget = {
            id: uuidv4(),
            type: "plant_reminder",
            content: "plant_reminder",
            position: {
              x: centerPosition.x - 100,
              y: centerPosition.y - 70,
            },
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
          setPlantName("");
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
      }

      if (newWidget) {
        onAddWidget(newWidget);
        setOpen(false);
      }
    } catch (error) {
      const errorMessage = handleValidationError(error);
      const errorField = type === 'plant_reminder' ? 'plant' : type;
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
      const now = new Date();
      const randomRotation = Math.floor(Math.random() * 6) - 3;

      const newImage: Widget = {
        id: uuidv4(),
        type: "image",
        content: imageUrl,
        position: {
          x: centerPosition.x - 150,
          y: centerPosition.y - 100,
        },
        rotation: randomRotation,
        size: { width: 300, height: "auto" },
        createdAt: now,
        updatedAt: now,
      };
      
      onAddWidget(newImage);
      setOpen(false);
    } catch (error) {
      setErrors(prev => ({ ...prev, file: 'Failed to upload image. Please try again.' }));
    }
  };

  const widgetTypes = [
    { id: "note", label: "Note", icon: StickyNote },
    { id: "image", label: "Image", icon: Image },
    { id: "weather", label: "Weather", icon: Cloud },
    { id: "plant_reminder", label: "Plant Care", icon: Leaf },
    { id: "shopping_list", label: "Shopping", icon: ShoppingCart },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-garden-primary hover:bg-garden-secondary"
          size="icon"
        >
          <span className="text-2xl font-bold">+</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Tabs defaultValue="note" className="w-full">
          <TabsList className="grid w-full grid-cols-5 text-xs">
            {widgetTypes.map((widget) => {
              const Icon = widget.icon;
              return (
                <TabsTrigger key={widget.id} value={widget.id} className="p-1">
                  <Icon className="w-4 h-4" />
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="note" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Add a note</h3>
              <textarea
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 min-h-[100px]"
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => {
                  setNoteContent(e.target.value);
                  clearError('note');
                }}
              />
              {errors.note && (
                <p className="text-sm text-red-600">{errors.note}</p>
              )}
            </div>
            <Button
              className="w-full bg-garden-primary hover:bg-garden-secondary"
              onClick={() => handleAddWidget("note")}
              disabled={!noteContent.trim()}
            >
              Add Note
            </Button>
          </TabsContent>

          <TabsContent value="image" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Add an image</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-garden-primary file:text-white hover:file:bg-garden-secondary"
                />
                {errors.file && (
                  <p className="text-sm text-red-600">{errors.file}</p>
                )}
              </div>

              <div className="text-center text-sm text-muted-foreground">or</div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL (HTTPS only)</label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    clearError('image');
                  }}
                  className="col-span-3"
                />
                {errors.image && (
                  <p className="text-sm text-red-600">{errors.image}</p>
                )}
              </div>
            </div>
            <Button
              className="w-full bg-garden-primary hover:bg-garden-secondary"
              onClick={() => handleAddWidget("image")}
              disabled={!imageUrl.trim() || uploading}
            >
              {uploading ? "Uploading..." : "Add Image"}
            </Button>
          </TabsContent>

          <TabsContent value="weather" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Add weather widget</h3>
              <Input
                placeholder="Enter location (e.g., London, New York)"
                value={weatherLocation}
                onChange={(e) => {
                  setWeatherLocation(e.target.value);
                  clearError('weather');
                }}
              />
              {errors.weather && (
                <p className="text-sm text-red-600">{errors.weather}</p>
              )}
            </div>
            <Button
              className="w-full bg-garden-primary hover:bg-garden-secondary"
              onClick={() => handleAddWidget("weather")}
              disabled={!weatherLocation.trim()}
            >
              Add Weather Widget
            </Button>
          </TabsContent>

          <TabsContent value="plant_reminder" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Add plant reminder</h3>
              <Input
                placeholder="Plant name (e.g., Monstera, Fiddle Leaf Fig)"
                value={plantName}
                onChange={(e) => {
                  setPlantName(e.target.value);
                  clearError('plant');
                }}
              />
              {errors.plant && (
                <p className="text-sm text-red-600">{errors.plant}</p>
              )}
              <p className="text-xs text-gray-600">
                Default watering interval: 3 days
              </p>
            </div>
            <Button
              className="w-full bg-garden-primary hover:bg-garden-secondary"
              onClick={() => handleAddWidget("plant_reminder")}
              disabled={!plantName.trim()}
            >
              Add Plant Reminder
            </Button>
          </TabsContent>

          <TabsContent value="shopping_list" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Add shopping list</h3>
              <p className="text-sm text-gray-600">
                Create a new shopping list to keep track of items you need.
              </p>
            </div>
            <Button
              className="w-full bg-garden-primary hover:bg-garden-secondary"
              onClick={() => handleAddWidget("shopping_list")}
            >
              Add Shopping List
            </Button>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default AddWidgetMenu;
