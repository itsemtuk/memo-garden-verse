
import React from 'react';
import { Trash2, MoveUp, MoveDown, RotateCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BoardControlsProps {
  selectedWidgetId: string | null;
  onRotateWidget: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onDeleteWidget: () => void;
}

const BoardControls = ({
  selectedWidgetId,
  onRotateWidget,
  onBringToFront,
  onSendToBack,
  onDeleteWidget,
}: BoardControlsProps) => {
  const isMobile = useIsMobile();

  if (!selectedWidgetId) return null;

  if (isMobile) {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border z-50 min-w-[280px] justify-center">
        <button
          onClick={onRotateWidget}
          className="p-3 text-xs bg-purple-500 text-white rounded-full hover:bg-purple-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform min-w-[44px] min-h-[44px]"
          title="Rotate Widget"
        >
          <RotateCw className="w-5 h-5" />
        </button>
        <button
          onClick={onBringToFront}
          className="p-3 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform min-w-[44px] min-h-[44px]"
          title="Bring to Front"
        >
          <MoveUp className="w-5 h-5" />
        </button>
        <button
          onClick={onSendToBack}
          className="p-3 text-xs bg-gray-500 text-white rounded-full hover:bg-gray-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform min-w-[44px] min-h-[44px]"
          title="Send to Back"
        >
          <MoveDown className="w-5 h-5" />
        </button>
        <button
          onClick={onDeleteWidget}
          className="p-3 text-xs bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform min-w-[44px] min-h-[44px]"
          title="Delete Widget"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg border z-50">
      <button
        onClick={onRotateWidget}
        className="px-3 py-2 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-1"
        title="Rotate Widget"
      >
        <RotateCw className="w-3 h-3" />
      </button>
      <button
        onClick={onBringToFront}
        className="px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
        title="Bring to Front"
      >
        <MoveUp className="w-3 h-3" />
      </button>
      <button
        onClick={onSendToBack}
        className="px-3 py-2 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-1"
        title="Send to Back"
      >
        <MoveDown className="w-3 h-3" />
      </button>
      <button
        onClick={onDeleteWidget}
        className="px-3 py-2 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
        title="Delete Widget"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
};

export default BoardControls;
