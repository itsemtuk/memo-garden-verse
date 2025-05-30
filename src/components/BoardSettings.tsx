
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Globe, Lock, Share2 } from "lucide-react";
import { Board } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BoardSettingsProps {
  board: Board;
  onUpdate: (updatedBoard: Board) => void;
  onClose: () => void;
}

const BoardSettings = ({ board, onUpdate, onClose }: BoardSettingsProps) => {
  const [name, setName] = useState(board.name);
  const [description, setDescription] = useState(board.description);
  const [isPublic, setIsPublic] = useState(board.is_public);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      const { data, error } = await supabase
        .from('boards')
        .update({
          name: name.trim(),
          description: description.trim(),
          is_public: isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq('id', board.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating board:', error);
        toast.error('Failed to update board settings');
        return;
      }

      const updatedBoard: Board = {
        ...board,
        name: data.name,
        description: data.description,
        is_public: data.is_public,
        updated_at: data.updated_at,
      };

      onUpdate(updatedBoard);
      toast.success('Board settings updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating board:', error);
      toast.error('Failed to update board settings');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const boardUrl = `${window.location.origin}/board/${board.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: board.name,
          text: board.description,
          url: boardUrl,
        });
      } catch (error) {
        // User cancelled sharing or share failed
        copyToClipboard(boardUrl);
      }
    } else {
      copyToClipboard(boardUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Board link copied to clipboard!');
  };

  const isFormValid = name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Board Settings</span>
            <Badge variant={isPublic ? "default" : "secondary"} className="ml-auto">
              {isPublic ? (
                <>
                  <Globe className="w-3 h-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 mr-1" />
                  Private
                </>
              )}
            </Badge>
          </CardTitle>
          <CardDescription>
            Manage your board's visibility and information
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Board Name */}
          <div className="space-y-2">
            <Label htmlFor="board-name">Board Name</Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter board name..."
              maxLength={100}
            />
          </div>

          {/* Board Description */}
          <div className="space-y-2">
            <Label htmlFor="board-description">Description</Label>
            <Textarea
              id="board-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your board..."
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Public/Private Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="public-toggle" className="text-sm font-medium">
                  Make board public
                </Label>
                <p className="text-xs text-muted-foreground">
                  Public boards can be discovered and viewed by anyone
                </p>
              </div>
              <Switch
                id="public-toggle"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            {isPublic && (
              <div className="bg-garden-note/20 p-3 rounded-lg border border-garden-primary/20">
                <div className="flex items-center space-x-2 text-sm text-garden-text">
                  <Eye className="w-4 h-4" />
                  <span>This board will be visible in the public explore page</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="mt-2 w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Board Link
                </Button>
              </div>
            )}

            {!isPublic && (
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <EyeOff className="w-4 h-4" />
                  <span>Only you can view this board</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!isFormValid || saving}
              className="flex-1 bg-garden-primary hover:bg-garden-primary-dark text-white"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoardSettings;
