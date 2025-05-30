
import React from 'react';
import { Plus } from "lucide-react";
import WidgetStore from "@/components/WidgetStore";
import { Widget } from "@/types";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface MobileWidgetStoreProps {
  showMobileWidgetStore: boolean;
  setShowMobileWidgetStore: (show: boolean) => void;
  onAddWidget: (widget: Widget) => void;
  centerPosition: { x: number; y: number };
  boardId: string;
}

const MobileWidgetStore = ({
  showMobileWidgetStore,
  setShowMobileWidgetStore,
  onAddWidget,
  centerPosition,
  boardId
}: MobileWidgetStoreProps) => {
  return (
    <Drawer open={showMobileWidgetStore} onOpenChange={setShowMobileWidgetStore}>
      <DrawerTrigger asChild>
        <button className="fixed bottom-4 right-4 w-16 h-16 bg-garden-primary text-white rounded-full shadow-xl flex items-center justify-center z-40 active:scale-95 transition-transform">
          <Plus className="w-7 h-7" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Add Widget</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-8 overflow-y-auto">
          <WidgetStore 
            onAddWidget={onAddWidget} 
            centerPosition={centerPosition} 
            boardId={boardId}
            isMobile={true}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileWidgetStore;
