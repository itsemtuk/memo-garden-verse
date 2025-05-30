
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPresence {
  userId: string;
  username: string;
  cursor?: { x: number; y: number };
  selectedWidgetId?: string;
  lastSeen: string;
}

export const usePresence = (boardId: string) => {
  const { user } = useAuth();
  const [otherUsers, setOtherUsers] = useState<UserPresence[]>([]);
  const [channel, setChannel] = useState<any>(null);

  const updateCursor = useCallback((x: number, y: number) => {
    if (channel && user) {
      channel.track({
        userId: user.id,
        username: user.email?.split('@')[0] || 'Anonymous',
        cursor: { x, y },
        lastSeen: new Date().toISOString(),
      });
    }
  }, [channel, user]);

  const updateSelection = useCallback((widgetId: string | null) => {
    if (channel && user) {
      channel.track({
        userId: user.id,
        username: user.email?.split('@')[0] || 'Anonymous',
        selectedWidgetId: widgetId,
        lastSeen: new Date().toISOString(),
      });
    }
  }, [channel, user]);

  useEffect(() => {
    if (!user || !boardId) return;

    console.log('Setting up presence for board:', boardId);

    const presenceChannel = supabase.channel(`board-presence-${boardId}`, {
      config: { presence: { key: user.id } }
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = presenceChannel.presenceState();
        const users: UserPresence[] = [];
        
        Object.entries(newState).forEach(([userId, presences]) => {
          if (userId !== user.id && presences && presences.length > 0) {
            // Get the latest presence data and validate its structure
            const presenceData = presences[0];
            
            // Check if the presence data has the required UserPresence structure
            if (presenceData && 
                typeof presenceData === 'object' && 
                'userId' in presenceData && 
                'username' in presenceData && 
                'lastSeen' in presenceData) {
              users.push(presenceData as UserPresence);
            }
          }
        });
        
        setOtherUsers(users);
        console.log('Presence synced, other users:', users.length);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        console.log('Presence subscription status:', status);
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            userId: user.id,
            username: user.email?.split('@')[0] || 'Anonymous',
            lastSeen: new Date().toISOString(),
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      console.log('Cleaning up presence channel');
      supabase.removeChannel(presenceChannel);
    };
  }, [user, boardId]);

  return {
    otherUsers,
    updateCursor,
    updateSelection,
  };
};
