
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Receipt, Plus, X, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExpenseTrackerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const ExpenseTrackerWidget = ({ widget, isSelected, onClick, onUpdate }: ExpenseTrackerWidgetProps) => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", category: "general", date: "" });
  
  const expenses: Expense[] = widget.settings?.expenses || [];
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const categories = ["general", "food", "transport", "accommodation", "entertainment", "shopping", "other"];

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const expense: Expense = {
        id: Date.now().toString(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date || new Date().toISOString().split('T')[0]
      };
      const updatedExpenses = [...expenses, expense];
      onUpdate({ ...widget.settings, expenses: updatedExpenses });
      setNewExpense({ description: "", amount: "", category: "general", date: "" });
      setShowAddExpense(false);
    }
  };

  const removeExpense = (expenseId: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
    onUpdate({ ...widget.settings, expenses: updatedExpenses });
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
          <Receipt className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Expenses</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddExpense(!showAddExpense);
            }}
            className="ml-auto"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-3 p-2 bg-green-50 rounded text-center">
          <div className="flex items-center justify-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-bold text-green-700">${totalExpenses.toFixed(2)}</span>
          </div>
          <span className="text-sm text-gray-600">Total Expenses</span>
        </div>

        {showAddExpense && (
          <div className="mb-3 p-2 bg-gray-50 rounded space-y-2">
            <Input
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-2 border rounded"
              onClick={(e) => e.stopPropagation()}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            <Input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <Button size="sm" onClick={addExpense} className="w-full">
              Add Expense
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No expenses recorded</p>
          ) : (
            expenses.map((expense) => (
              <div key={expense.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                <div className="flex-1">
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-gray-600">
                    ${expense.amount.toFixed(2)} • {expense.category} • {expense.date}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeExpense(expense.id);
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

export default ExpenseTrackerWidget;
