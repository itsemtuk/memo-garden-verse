
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { GraduationCap, Plus, X, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FlashcardsWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

const FlashcardsWidget = ({ widget, isSelected, onClick, onUpdate }: FlashcardsWidgetProps) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ front: "", back: "" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const cards: Flashcard[] = widget.settings?.cards || [];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const addCard = () => {
    if (newCard.front && newCard.back) {
      const card: Flashcard = {
        id: Date.now().toString(),
        ...newCard
      };
      const updatedCards = [...cards, card];
      onUpdate({ ...widget.settings, cards: updatedCards });
      setNewCard({ front: "", back: "" });
      setShowAddCard(false);
    }
  };

  const removeCard = (cardId: string) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    onUpdate({ ...widget.settings, cards: updatedCards });
    if (currentIndex >= updatedCards.length) {
      setCurrentIndex(Math.max(0, updatedCards.length - 1));
    }
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const currentCard = cards[currentIndex];

  return (
    <div
      ref={setNodeRef}
      className={`widget absolute bg-white rounded-lg shadow-lg border-2 transition-all duration-200 ${
        isDragging ? 'dragging shadow-xl scale-105' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        ...style,
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        width: widget.size?.width || "320px",
        height: widget.size?.height || "400px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3 border-b pb-2">
          <GraduationCap className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Flashcards</h3>
          <span className="text-sm text-gray-500 ml-auto">
            {cards.length > 0 ? `${currentIndex + 1}/${cards.length}` : '0/0'}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddCard(!showAddCard);
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {showAddCard && (
          <div className="mb-3 p-2 bg-gray-50 rounded space-y-2">
            <Textarea
              placeholder="Front of card"
              value={newCard.front}
              onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
              className="min-h-[60px]"
            />
            <Textarea
              placeholder="Back of card"
              value={newCard.back}
              onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
              className="min-h-[60px]"
            />
            <Button size="sm" onClick={addCard} className="w-full">
              Add Card
            </Button>
          </div>
        )}

        {cards.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            No flashcards created yet
          </div>
        ) : (
          <>
            <div 
              className="flex-1 flex items-center justify-center p-4 bg-purple-50 rounded cursor-pointer min-h-[200px]"
              onClick={(e) => {
                e.stopPropagation();
                flipCard();
              }}
            >
              <div className="text-center">
                <div className="text-lg font-medium mb-2">
                  {isFlipped ? currentCard.back : currentCard.front}
                </div>
                <div className="text-sm text-gray-500">
                  {isFlipped ? 'Back' : 'Front'} - Click to flip
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  prevCard();
                }}
                disabled={cards.length <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCard(currentCard.id);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  nextCard();
                }}
                disabled={cards.length <= 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlashcardsWidget;
