import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';
import type { ChatRoom } from '../types';

export function useDefaultRoom() {
  const [defaultRoom, setDefaultRoom] = useState<ChatRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDefaultRoom = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get or create public room
      const { data: existingRoom, error: fetchError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('is_public', true)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // Create default public room if it doesn't exist
          const { data: newRoom, error: createError } = await supabase
            .from('chat_rooms')
            .insert({
              name: 'Global Chat',
              is_public: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) throw createError;
          setDefaultRoom(newRoom);
          return;
        }
        throw fetchError;
      }

      setDefaultRoom(existingRoom);
    } catch (error: any) {
      logger.error('Error loading default room:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultRoom();
  }, []);

  return {
    defaultRoom,
    error,
    isLoading,
    reloadRoom: loadDefaultRoom
  };
}