
import { useState, useEffect } from "react";
import { Board as BoardType } from "@/types";
import { mockBoards } from "@/lib/mockData";
import Board from "@/components/Board";
import NavBar from "@/components/NavBar";
import BoardsList from "@/components/BoardsList";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const [boards, setBoards] = useState<BoardType[]>(mockBoards);
  const [currentBoardId, setCurrentBoardId] = useState<string>(mockBoards[0].id);
  const [showBoards, setShowBoards] = useState(false);

  const currentBoard = boards.find(board => board.id === currentBoardId) || boards[0];

  const handleBoardChange = (boardId: string) => {
    setCurrentBoardId(boardId);
    setShowBoards(false);
  };

  const handleCreateBoard = (name: string) => {
    const newBoard: BoardType = {
      id: uuidv4(),
      name,
      description: "A new board",
      isPublic: false,
      widgets: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: "user1", // In a real app, this would be the current user's ID
    };
    
    setBoards((prevBoards) => [...prevBoards, newBoard]);
    setCurrentBoardId(newBoard.id);
    setShowBoards(false);
  };

  const handleUpdateWidgets = (updatedWidgets: any[]) => {
    setBoards(prevBoards => 
      prevBoards.map(board => 
        board.id === currentBoardId 
          ? { ...board, widgets: updatedWidgets, updatedAt: new Date() } 
          : board
      )
    );
  };

  // React to URL changes or handle deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the # character
      if (hash && boards.some(board => board.id === hash)) {
        setCurrentBoardId(hash);
        setShowBoards(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on initial load
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [boards]);

  return (
    <div className="flex flex-col h-screen">
      <NavBar 
        currentBoard={currentBoard}
        availableBoards={boards}
        onBoardChange={handleBoardChange}
        onCreateBoard={handleCreateBoard}
      />

      <main className="flex-1 overflow-hidden">
        {showBoards ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Boards</h2>
              <button
                onClick={() => setShowBoards(false)}
                className="text-sm text-garden-primary hover:underline"
              >
                Back to Current Board
              </button>
            </div>
            <BoardsList
              boards={boards}
              onBoardSelect={handleBoardChange}
            />
          </div>
        ) : (
          <Board widgets={currentBoard.widgets} onUpdate={handleUpdateWidgets} />
        )}
      </main>
    </div>
  );
};

export default Index;
