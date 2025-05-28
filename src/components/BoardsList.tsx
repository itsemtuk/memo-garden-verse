
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Board } from "@/types";

interface BoardsListProps {
  boards: Board[];
  onBoardSelect: (boardId: string) => void;
  className?: string;
}

const BoardsList = ({ boards, onBoardSelect, className = "" }: BoardsListProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {boards.map((board) => (
        <Card key={board.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{board.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {board.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {board.widgets.length} item{board.widgets.length !== 1 ? "s" : ""}
            </div>
            <div className="text-xs mt-1">
              {board.is_public ? "Public board" : "Private board"}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-garden-primary hover:bg-garden-primary-dark text-white"
              onClick={() => onBoardSelect(board.id)}
            >
              View Board
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BoardsList;
