
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Users, Calendar, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Board } from "@/types";
import { toast } from "sonner";

const Explore = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [publicBoards, setPublicBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBoards, setFilteredBoards] = useState<Board[]>([]);

  // Transform database board to our Board type
  const transformDbBoard = (dbBoard: any): Board => {
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

  // Fetch public boards
  const fetchPublicBoards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('is_public', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching public boards:', error);
        toast.error('Failed to load public boards');
        return;
      }

      const transformedBoards = data?.map(transformDbBoard) || [];
      setPublicBoards(transformedBoards);
      setFilteredBoards(transformedBoards);
    } catch (error) {
      console.error('Error fetching public boards:', error);
      toast.error('Failed to load public boards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicBoards();
  }, []);

  // Filter boards based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBoards(publicBoards);
    } else {
      const filtered = publicBoards.filter(board =>
        board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        board.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBoards(filtered);
    }
  }, [searchTerm, publicBoards]);

  const handleViewBoard = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-garden-note via-garden-corkLight to-garden-image">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(user ? '/app' : '/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-garden-text">🌱 Explore Public Gardens</h1>
              <p className="text-garden-textSecondary">Discover beautiful boards shared by the community</p>
            </div>
          </div>
          
          {user && (
            <Button 
              onClick={() => navigate('/app')}
              className="bg-garden-primary hover:bg-garden-primary-dark text-white"
            >
              My Boards
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-garden-textSecondary" />
          <Input
            type="text"
            placeholder="Search public boards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-garden-primary/20 focus:border-garden-primary"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-garden-text">Loading public boards...</div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredBoards.length === 0 && publicBoards.length > 0 && (
          <div className="text-center py-12">
            <div className="text-garden-textSecondary mb-4">No boards found matching "{searchTerm}"</div>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        )}

        {/* No Public Boards */}
        {!loading && publicBoards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-garden-textSecondary mb-4">No public boards available yet</div>
            <p className="text-sm text-garden-textSecondary">Be the first to share a board with the community!</p>
          </div>
        )}

        {/* Boards Grid */}
        {!loading && filteredBoards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBoards.map((board) => (
              <Card key={board.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white/90 backdrop-blur-sm border-garden-primary/10">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-garden-text line-clamp-1">
                        {board.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-garden-textSecondary line-clamp-2 mt-1">
                        {board.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2 bg-garden-primary/10 text-garden-primary border-garden-primary/20">
                      <Eye className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-garden-textSecondary mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{board.widgets.length} items</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(board.updated_at)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleViewBoard(board.id)}
                    className="w-full bg-garden-primary hover:bg-garden-primary-dark text-white"
                    size="sm"
                  >
                    View Garden
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-garden-primary/10">
          <p className="text-garden-textSecondary text-sm">
            {publicBoards.length} public garden{publicBoards.length !== 1 ? 's' : ''} shared by the community
          </p>
        </div>
      </div>
    </div>
  );
};

export default Explore;
