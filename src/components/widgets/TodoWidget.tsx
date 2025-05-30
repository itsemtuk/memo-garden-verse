
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { ListTodo, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface TodoWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const TodoWidget = ({ widget, isSelected, onClick, onUpdate }: TodoWidgetProps) => {
  const [newTodo, setNewTodo] = useState("");
  const [showInput, setShowInput] = useState(false);
  
  const todos: TodoItem[] = widget.settings?.todos || [];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false
      };
      const updatedTodos = [...todos, todo];
      onUpdate({ ...widget.settings, todos: updatedTodos });
      setNewTodo("");
      setShowInput(false);
    }
  };

  const toggleTodo = (todoId: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    onUpdate({ ...widget.settings, todos: updatedTodos });
  };

  const deleteTodo = (todoId: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    onUpdate({ ...widget.settings, todos: updatedTodos });
  };

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
        width: widget.size?.width || "260px",
        height: widget.size?.height || "300px",
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
          <ListTodo className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Todo List</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setShowInput(!showInput);
            }}
            className="ml-auto"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {showInput && (
          <div className="mb-3 flex gap-2">
            <Input
              placeholder="Add new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addTodo();
                if (e.key === 'Escape') setShowInput(false);
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1"
              autoFocus
            />
            <Button size="sm" onClick={addTodo}>
              <Check className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No tasks yet</p>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.text}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(todo.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoWidget;
