import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function usePresence(userId: string | undefined, roomId: string | undefined) {
  const updatePresence = useCallback(async () => {
    if (!userId || !roomId) return;

    try {
      await supabase.rpc('update_presence', {
        p_profile_id: userId,
        p_room_id: roomId
      });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }, [userId, roomId]);

  useEffect(() => {
    if (!userId || !roomId) return;

    // Update presence immediately
    updatePresence();

    // Update presence every 30 seconds
    const interval = setInterval(updatePresence, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [userId, roomId, updatePresence]);
}