
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface WidgetSearchProps {
  searchQuery: string;
  selectedCategory: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { value: "all", label: "All Widgets" },
  { value: "productivity", label: "Productivity" },
  { value: "media", label: "Media & Content" },
  { value: "information", label: "Information & News" },
  { value: "lifestyle", label: "Health & Lifestyle" },
  { value: "organization", label: "Organization & Planning" },
  { value: "tools", label: "Tools & Utilities" },
  { value: "learning", label: "Learning & Education" },
  { value: "social", label: "Social" },
];

export const WidgetSearch = ({ 
  searchQuery, 
  selectedCategory, 
  onSearchChange, 
  onCategoryChange 
}: WidgetSearchProps) => {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search widgets..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
