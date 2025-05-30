
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Board } from "@/types";
import { ChevronDown, Plus, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface NavBarProps {
  currentBoard: Board;
  availableBoards: Board[];
  onBoardChange: (boardId: string) => void;
  onCreateBoard: (name: string) => void;
}

const NavBar = ({ currentBoard, availableBoards, onBoardChange, onCreateBoard }: NavBarProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const { user, profile, signOut } = useAuth();

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      onCreateBoard(newBoardName.trim());
      setNewBoardName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-garden-primary">MemoGarden</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <span>{currentBoard.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableBoards.map((board) => (
                <DropdownMenuItem
                  key={board.id}
                  onClick={() => onBoardChange(board.id)}
                  className={currentBoard.id === board.id ? "bg-garden-accent" : ""}
                >
                  {board.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Board
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Board</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Board name"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBoard} disabled={!newBoardName.trim()}>
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {profile?.username || user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
