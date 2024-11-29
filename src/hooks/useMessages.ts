import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';
import { useRealtimeChannel } from './useRealtimeChannel';
import type { Message } from '../types';

export function useMessages(roomId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesRef = useRef<Message[]>([]);

  // Keep messages ref in sync with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleNewMessage = useCallback((payload: any) => {
    const newMessage = payload.new as Message;
    
    setMessages(prev => {
      if (prev.some(msg => msg.id === newMessage.id)) {
        logger.warn('Duplicate message detected', { 
          messageId: newMessage.id,
          roomId 
        });
        return prev;
      }
      
      logger.info('Adding new message to state', { 
        messageId: newMessage.id,
        roomId 
      });
      return [...prev, newMessage];
    });
  }, [roomId]);

  const handlePresenceChange = useCallback(() => {
    logger.info('Presence changed', { roomId });
  }, [roomId]);

  useRealtimeChannel({
    roomId: roomId || '',
    onMessage: handleNewMessage,
    onPresenceChange: handlePresenceChange
  });

  const loadMessages = async () => {
    if (!roomId) return;
    
    try {
      setIsLoading(true);
      logger.info('Loading messages for room', { roomId });
      
      const { data, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (data) {
        logger.info(`Successfully loaded ${data.length} messages`, { roomId });
        setMessages(data);
        setError(null);
      }
    } catch (error: any) {
      const errorMessage = 'Failed to load messages';
      logger.error(errorMessage, { error, roomId });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [roomId]);

  const addMessage = async (message: Partial<Message>) => {
    if (!message.room_id) {
      logger.error('No room_id provided for message');
      throw new Error('room_id is required');
    }

    try {
      logger.info('Adding new message', { roomId: message.room_id });
      
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();

      if (error) throw error;

      logger.info('Message added successfully', { 
        messageId: data.id,
        roomId: message.room_id 
      });
      
      return data;
    } catch (error: any) {
      logger.error('Error adding message', { error, message });
      throw error;
    }
  };

  return {
    messages,
    error,
    isLoading,
    addMessage,
    reloadMessages: loadMessages
  };
}