
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, User, Calendar, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Board as BoardType } from "@/types";
import { toast } from "sonner";
import VirtualizedBoard from "@/components/VirtualizedBoard";
import { useNotes } from "@/hooks/useNotes";

const PublicBoard = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownerProfile, setOwnerProfile] = useState<{ username?: string } | null>(null);

  const { notesAsWidgets, loading: notesLoading } = useNotes(boardId || '');

  // Transform database board to our Board type
  const transformDbBoard = (dbBoard: any): BoardType => {
    return {
      id: dbBoard.id,
      name: dbBoard.name,
      description: dbBoard.description || "A public garden board",
      is_public: dbBoard.is_public || false,
      owner_id: dbBoard.owner_id,
      collaborators: dbBoard.collaborators || [],
      widgets: Array.isArray(dbBoard.widgets) ? dbBoard.widgets : [],
      created_at: dbBoard.created_at,
      updated_at: dbBoard.updated_at,
    };
  };

  // Fetch public board data
  const fetchBoard = async () => {
    if (!boardId) return;

    try {
      setLoading(true);
      
      // Fetch board data
      const { data: boardData, error: boardError } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .eq('is_public', true)
        .single();

      if (boardError) {
        console.error('Error fetching public board:', boardError);
        toast.error('Board not found or not public');
        navigate('/explore');
        return;
      }

      const transformedBoard = transformDbBoard(boardData);
      setBoard(transformedBoard);

      // Fetch owner profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', transformedBoard.owner_id)
        .single();

      setOwnerProfile(profileData);
    } catch (error) {
      console.error('Error fetching public board:', error);
      toast.error('Failed to load board');
      navigate('/explore');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: board?.name || 'MemoGarden Board',
          text: board?.description || 'Check out this beautiful garden board!',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing or share failed
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Board link copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || notesLoading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-garden-text">Loading garden board...</div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-garden-text mb-4">Board not found</div>
            <Button onClick={() => navigate('/explore')}>
              Back to Explore
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-garden-primary/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/explore')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-bold text-garden-text">{board.name}</h1>
                <p className="text-sm text-garden-textSecondary">{board.description}</p>
              </div>
              <Badge variant="secondary" className="bg-garden-primary/10 text-garden-primary border-garden-primary/20">
                <Eye className="w-3 h-3 mr-1" />
                Public
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right text-sm text-garden-textSecondary">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>by {ownerProfile?.username || 'Anonymous'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(board.updated_at)}</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="flex-1 overflow-hidden">
        <VirtualizedBoard
          widgets={notesAsWidgets}
          selectedWidgetId={null}
          sensors={[]}
          onDragStart={() => {}}
          onDragMove={() => {}}
          onDragEnd={() => {}}
          onWidgetSelect={() => {}}
          onUpdateWidget={() => {}}
          onUpdateWidgetSettings={() => {}}
          draggedWidgets={new Map()}
          readonly={true}
        />
      </main>
    </div>
  );
};

export default PublicBoard;
