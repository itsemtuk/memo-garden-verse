
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { ArrowUpDown, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CurrencyConverterWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const CurrencyConverterWidget = ({ widget, isSelected, onClick, onUpdate }: CurrencyConverterWidgetProps) => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState('85.23');

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];

  const convertCurrency = () => {
    // Mock conversion - in real app would use exchange rate API
    const mockRates: { [key: string]: number } = {
      'USD-EUR': 0.85, 'USD-GBP': 0.73, 'USD-JPY': 110,
      'EUR-USD': 1.18, 'EUR-GBP': 0.86, 'EUR-JPY': 129,
      'GBP-USD': 1.37, 'GBP-EUR': 1.16, 'GBP-JPY': 150,
    };
    
    const rate = mockRates[`${fromCurrency}-${toCurrency}`] || 1;
    const converted = (parseFloat(amount) * rate).toFixed(2);
    setResult(converted);
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
        width: widget.size?.width || "280px",
        height: widget.size?.height || "320px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Currency Converter</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">From</label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center">
            <ArrowUpDown className="w-5 h-5 text-gray-400" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">To</label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gray-50 p-3 rounded text-center">
            <div className="text-sm text-gray-600">Result</div>
            <div className="text-lg font-bold">{result} {toCurrency}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterWidget;
