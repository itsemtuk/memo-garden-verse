
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";
import { Board } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import UserProfile from "@/components/UserProfile";

interface NavBarProps {
  currentBoard: Board;
  availableBoards: Board[];
  onBoardChange: (boardId: string) => void;
  onCreateBoard: (name: string) => void;
}

const NavBar = ({ currentBoard, availableBoards, onBoardChange, onCreateBoard }: NavBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newBoardName, setNewBoardName] = useState("");
  const { user } = useAuth();

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      onCreateBoard(newBoardName);
      setNewBoardName("");
    }
  };

  return (
    <div className="bg-white border-b py-3 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-garden-text">
          <span className="text-garden-primary">Memo</span>Garden
        </h1>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100">
                My Boards
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[320px]">
                  {availableBoards.map((board) => (
                    <li key={board.id}>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-left",
                            board.id === currentBoard.id && "bg-garden-secondary/10"
                          )}
                          onClick={() => onBoardChange(board.id)}
                        >
                          {board.name}
                          <span className="ml-2 text-xs opacity-70">
                            {board.is_public ? "(Public)" : "(Private)"}
                          </span>
                        </Button>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li className="mt-2 pt-2 border-t">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          + Create New Board
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">Create a new board</h3>
                          <Input
                            placeholder="Board name"
                            value={newBoardName}
                            onChange={(e) => setNewBoardName(e.target.value)}
                          />
                          <div className="flex justify-end">
                            <Button onClick={handleCreateBoard} disabled={!newBoardName.trim()}>
                              Create
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100">
                Garden
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[320px]">
                  <div className="text-sm">
                    Browse public boards and collections
                  </div>
                  <NavigationMenuLink asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      Explore Public Boards
                    </Button>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      Popular Collections
                    </Button>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative max-w-[300px]">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search boards and content..."
            className="pl-8 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {user ? (
          <UserProfile />
        ) : (
          <Button className="bg-garden-primary hover:bg-garden-secondary text-white">
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
