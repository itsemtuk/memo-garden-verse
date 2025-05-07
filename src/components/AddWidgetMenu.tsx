
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Widget, WidgetType } from "@/types";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface AddWidgetMenuProps {
  onAddWidget: (widget: Widget) => void;
  centerPosition: { x: number; y: number };
}

const AddWidgetMenu = ({ onAddWidget, centerPosition }: AddWidgetMenuProps) => {
  const [noteContent, setNoteContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);

  const handleAddWidget = (type: WidgetType) => {
    const now = new Date();
    const randomRotation = Math.floor(Math.random() * 6) - 3; // Between -3 and 3 degrees

    if (type === "note" && noteContent.trim()) {
      const newNote: Widget = {
        id: uuidv4(),
        type: "note",
        content: noteContent,
        position: {
          x: centerPosition.x - 100, // Center the widget
          y: centerPosition.y - 50,
        },
        rotation: randomRotation,
        createdAt: now,
        updatedAt: now,
      };
      onAddWidget(newNote);
      setNoteContent("");
      setOpen(false);
    } else if (type === "image" && imageUrl.trim()) {
      const newImage: Widget = {
        id: uuidv4(),
        type: "image",
        content: imageUrl,
        position: {
          x: centerPosition.x - 150, // Center the widget
          y: centerPosition.y - 100,
        },
        rotation: randomRotation,
        size: { width: 250, height: "auto" },
        createdAt: now,
        updatedAt: now,
      };
      onAddWidget(newImage);
      setImageUrl("");
      setOpen(false);
    }
  };

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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="note">Note</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>
          <TabsContent value="note" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Add a note</h3>
              <textarea
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 min-h-[100px]"
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
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
              <Input
                placeholder="Enter image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <Button
              className="w-full bg-garden-primary hover:bg-garden-secondary"
              onClick={() => handleAddWidget("image")}
              disabled={!imageUrl.trim()}
            >
              Add Image
            </Button>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default AddWidgetMenu;
