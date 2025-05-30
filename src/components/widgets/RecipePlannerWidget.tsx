
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import { ChefHat, Search, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RecipePlannerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const RecipePlannerWidget = ({ widget, isSelected, onClick, onUpdate }: RecipePlannerWidgetProps) => {
  const [recipes, setRecipes] = useState(widget.settings?.recipes || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const searchRecipes = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data.meals || []);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const addRecipe = (meal: any) => {
    const recipe = {
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      instructions: meal.strInstructions,
      added: new Date().toISOString()
    };
    
    const updatedRecipes = [...recipes, recipe];
    setRecipes(updatedRecipes);
    onUpdate({ ...widget.settings, recipes: updatedRecipes });
    setSearchResults([]);
    setSearchTerm("");
  };

  useEffect(() => {
    // Load random recipe on first render if no recipes exist
    if (recipes.length === 0) {
      fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
          if (data.meals && data.meals[0]) {
            const meal = data.meals[0];
            const recipe = {
              id: meal.idMeal,
              name: meal.strMeal,
              image: meal.strMealThumb,
              category: meal.strCategory,
              instructions: meal.strInstructions,
              added: new Date().toISOString()
            };
            setRecipes([recipe]);
            onUpdate({ ...widget.settings, recipes: [recipe] });
          }
        })
        .catch(error => console.error('Error loading random recipe:', error));
    }
  }, []);

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
          <ChefHat className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-800">Recipe Planner</h3>
        </div>

        <div className="mb-3 space-y-2">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipes..."
              onClick={(e) => e.stopPropagation()}
              onKeyPress={(e) => e.key === 'Enter' && searchRecipes()}
            />
            <Button size="sm" onClick={searchRecipes} disabled={isSearching}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Search Results:</h4>
              {searchResults.slice(0, 3).map((meal: any) => (
                <div key={meal.idMeal} className="border rounded-lg p-2 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <img 
                      src={meal.strMealThumb} 
                      alt={meal.strMeal}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-medium truncate">{meal.strMeal}</h5>
                      <p className="text-xs text-gray-500">{meal.strCategory}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addRecipe(meal);
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">My Recipes:</h4>
              {recipes.map((recipe: any) => (
                <div key={recipe.id} className="border rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={recipe.image} 
                      alt={recipe.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium truncate">{recipe.name}</h5>
                      <p className="text-xs text-gray-500">{recipe.category}</p>
                    </div>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipePlannerWidget;
