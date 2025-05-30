
import React from 'react';
import { MousePointer2 } from 'lucide-react';

interface UserPresence {
  userId: string;
  username: string;
  cursor?: { x: number; y: number };
  selectedWidgetId?: string;
  lastSeen: string;
}

interface CursorDisplayProps {
  otherUsers: UserPresence[];
}

const CursorDisplay: React.FC<CursorDisplayProps> = ({ otherUsers }) => {
  const colors = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
  ];

  const getUserColor = (userId: string) => {
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <>
      {otherUsers.map((user) => {
        if (!user.cursor) return null;

        const color = getUserColor(user.userId);
        
        return (
          <div
            key={user.userId}
            className="fixed pointer-events-none z-50 transition-all duration-100"
            style={{
              left: `${user.cursor.x}px`,
              top: `${user.cursor.y}px`,
              transform: 'translate(-2px, -2px)',
            }}
          >
            <MousePointer2 
              className="w-5 h-5" 
              style={{ color }}
              fill="currentColor"
            />
            <div 
              className="absolute top-5 left-2 px-2 py-1 rounded text-xs text-white text-nowrap"
              style={{ backgroundColor: color }}
            >
              {user.username}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CursorDisplay;
