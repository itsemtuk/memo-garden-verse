
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Board } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  Plus, 
  Settings, 
  LogOut, 
  User, 
  Eye, 
  Lock,
  Search,
  Globe
} from "lucide-react";
import UserProfile from "./UserProfile";
import BoardSettings from "./BoardSettings";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavBarProps {
  currentBoard: Board;
  availableBoards: Board[];
  onBoardChange: (boardId: string) => void;
  onCreateBoard: (name: string) => void;
}

const NavBar = ({ currentBoard, availableBoards, onBoardChange, onCreateBoard }: NavBarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showBoardSettings, setShowBoardSettings] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardName.trim()) {
      onCreateBoard(newBoardName.trim());
      setNewBoardName("");
      setShowCreateForm(false);
    }
  };

  const handleBoardUpdate = (updatedBoard: Board) => {
    // The board will be updated through the parent component's state management
    // This callback ensures the UI reflects the changes
    console.log('Board updated:', updatedBoard.name);
  };

  return (
    <nav className={`bg-white border-b border-garden-primary/20 ${isMobile ? 'px-3 py-2' : 'px-6 py-3'}`}>
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Board selector */}
        <div className="flex items-center space-x-4">
          <h1 
            className={`font-bold text-garden-primary cursor-pointer hover:text-garden-primary-dark transition-colors ${isMobile ? 'text-lg' : 'text-xl'}`}
            onClick={() => navigate("/")}
          >
            🌱 {isMobile ? "MG" : "MemoGarden"}
          </h1>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`flex items-center space-x-2 max-w-xs ${isMobile ? 'text-sm px-2' : ''}`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="truncate font-medium">
                      {isMobile && currentBoard.name.length > 10 
                        ? `${currentBoard.name.slice(0, 10)}...` 
                        : currentBoard.name
                      }
                    </span>
                    {currentBoard.is_public ? (
                      <Eye className="w-3 h-3 text-garden-primary flex-shrink-0" />
                    ) : (
                      <Lock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                  Your Boards
                </div>
                {availableBoards.map((board) => (
                  <DropdownMenuItem
                    key={board.id}
                    onClick={() => onBoardChange(board.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span className="truncate">{board.name}</span>
                      {board.is_public ? (
                        <Eye className="w-3 h-3 text-garden-primary flex-shrink-0" />
                      ) : (
                        <Lock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                    {currentBoard.id === board.id && (
                      <Badge variant="secondary" className="ml-2 text-xs">Current</Badge>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                {showCreateForm ? (
                  <div className="p-2">
                    <form onSubmit={handleCreateBoard} className="space-y-2">
                      <input
                        type="text"
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                        placeholder="Board name..."
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        autoFocus
                      />
                      <div className="flex space-x-1">
                        <Button type="submit" size="sm" className="flex-1 text-xs">
                          Create
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setShowCreateForm(false);
                            setNewBoardName("");
                          }}
                          className="flex-1 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <DropdownMenuItem onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Board
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBoardSettings(true)}
              className={`flex items-center space-x-1 ${isMobile ? 'px-2' : ''}`}
            >
              <Settings className="w-4 h-4" />
              {!isMobile && <span>Settings</span>}
            </Button>
          </div>
        </div>

        {/* Right side - Navigation and user menu */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/explore")}
            className={`flex items-center space-x-1 text-garden-text hover:text-garden-primary ${isMobile ? 'px-2' : ''}`}
          >
            <Search className="w-4 h-4" />
            {!isMobile && <span>Explore</span>}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                {!isMobile && user?.email && (
                  <span className="max-w-32 truncate">{user.email}</span>
                )}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowUserProfile(true)}>
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile onClose={() => setShowUserProfile(false)} />
      )}

      {/* Board Settings Modal */}
      {showBoardSettings && (
        <BoardSettings
          board={currentBoard}
          onUpdate={handleBoardUpdate}
          onClose={() => setShowBoardSettings(false)}
        />
      )}
    </nav>
  );
};

export default NavBar;
