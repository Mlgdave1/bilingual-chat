import { useEffect, useRef, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

interface UseRealtimeChannelProps {
  roomId: string;
  onMessage: (payload: any) => void;
  onPresenceChange?: () => void;
}

export function useRealtimeChannel({ roomId, onMessage, onPresenceChange }: UseRealtimeChannelProps) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 5;
  const INITIAL_RETRY_DELAY = 1000;

  const getRetryDelay = () => {
    // Exponential backoff with max delay of 30 seconds
    return Math.min(INITIAL_RETRY_DELAY * Math.pow(2, retryCountRef.current), 30000);
  };

  const cleanupChannel = useCallback(() => {
    if (channelRef.current) {
      logger.info('Cleaning up channel', { roomId });
      channelRef.current.unsubscribe();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [roomId]);

  const initChannel = useCallback(() => {
    try {
      cleanupChannel();

      logger.info('Initializing channel', { roomId, retryCount: retryCountRef.current });

      const channel = supabase.channel(`room:${roomId}`, {
        config: {
          broadcast: { self: true },
          presence: { key: 'chat' },
          retryAfter: getRetryDelay(),
          timeout: 10000,
        },
      });

      channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${roomId}`,
          },
          onMessage
        )
        .on('presence', { event: 'sync' }, () => {
          onPresenceChange?.();
        })
        .subscribe(async (status) => {
          logger.info('Channel status changed', { status, roomId });

          if (status === 'SUBSCRIBED') {
            retryCountRef.current = 0; // Reset retry count on successful connection
            await channel.track({ online: true });
            logger.info('Successfully subscribed to channel', { roomId });
            
            if (retryTimeoutRef.current) {
              clearTimeout(retryTimeoutRef.current);
              retryTimeoutRef.current = undefined;
            }
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            logger.error('Channel error', { status, roomId });
            
            if (retryCountRef.current < MAX_RETRIES) {
              retryCountRef.current++;
              const delay = getRetryDelay();
              
              logger.info('Scheduling channel reconnection', { 
                roomId, 
                retryCount: retryCountRef.current,
                delay 
              });
              
              retryTimeoutRef.current = setTimeout(() => {
                initChannel();
              }, delay);
            } else {
              logger.error('Max retry attempts reached', { roomId });
            }
          }
        });

      channelRef.current = channel;
    } catch (error) {
      logger.error('Error initializing channel', { error, roomId });
    }
  }, [roomId, onMessage, onPresenceChange]);

  useEffect(() => {
    if (!roomId) return;

    initChannel();

    // Reset retry count when roomId changes
    retryCountRef.current = 0;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        logger.info('Tab became visible, reinitializing channel', { roomId });
        initChannel();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      cleanupChannel();
    };
  }, [roomId, initChannel, cleanupChannel]);

  return channelRef.current;
}