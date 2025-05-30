
import { useState, useEffect } from "react";
import { Board as BoardType, Widget } from "@/types";
import Board from "@/components/Board";
import NavBar from "@/components/NavBar";
import BoardsList from "@/components/BoardsList";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const { user } = useAuth();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [currentBoardId, setCurrentBoardId] = useState<string>("");
  const [showBoards, setShowBoards] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentBoard = boards.find(board => board.id === currentBoardId) || boards[0];

  // Transform database board to our Board type
  const transformDbBoard = (dbBoard: any): BoardType => {
    return {
      id: dbBoard.id,
      name: dbBoard.name,
      description: dbBoard.description || "A new board for organizing thoughts and ideas",
      is_public: dbBoard.is_public || false,
      owner_id: dbBoard.owner_id,
      collaborators: dbBoard.collaborators || [],
      widgets: Array.isArray(dbBoard.widgets) ? dbBoard.widgets : [],
      created_at: dbBoard.created_at,
      updated_at: dbBoard.updated_at,
    };
  };

  // Fetch user's boards from database
  const fetchBoards = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const transformedBoards = data.map(transformDbBoard);
        setBoards(transformedBoards);
        setCurrentBoardId(transformedBoards[0].id);
      } else {
        // Create a default board if none exist
        await handleCreateBoard("My Garden Board");
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBoards();
    }
  }, [user]);

  const handleBoardChange = (boardId: string) => {
    setCurrentBoardId(boardId);
    setShowBoards(false);
  };

  const handleCreateBoard = async (name: string) => {
    if (!user) return;

    try {
      const newBoard = {
        id: uuidv4(),
        name,
        description: "A new board for organizing thoughts and ideas",
        is_public: false,
        owner_id: user.id,
        collaborators: [],
        widgets: [],
      };

      const { data, error } = await supabase
        .from('boards')
        .insert(newBoard)
        .select()
        .single();

      if (error) throw error;

      const transformedBoard = transformDbBoard(data);
      setBoards((prevBoards) => [transformedBoard, ...prevBoards]);
      setCurrentBoardId(transformedBoard.id);
      setShowBoards(false);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleUpdateWidgets = (updatedWidgets: any[]) => {
    // This function is kept for compatibility but widgets are now managed in the database
    console.log('Widgets updated:', updatedWidgets);
  };

  // React to URL changes or handle deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && boards.some(board => board.id === hash)) {
        setCurrentBoardId(hash);
        setShowBoards(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [boards]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-garden-text">Loading your boards...</div>
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-garden-text">No boards found. Creating your first board...</div>
        </div>
      </div>
    );
  }

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
          <Board 
            boardId={currentBoardId} 
            onUpdate={handleUpdateWidgets} 
          />
        )}
      </main>
    </div>
  );
};

export default Index;
