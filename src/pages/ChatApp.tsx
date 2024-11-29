import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageInput } from '../components/MessageInput';
import { ChatMessage } from '../components/ChatMessage';
import { PublicChatWarning } from '../components/PublicChatWarning';
import { ActiveUsers } from '../components/ActiveUsers';
import { Message, ChatRoom } from '../types';
import { detectAndTranslate } from '../utils/translator';
import { Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { usePresence } from '../hooks/usePresence';
import { useMessages } from '../hooks/useMessages';
import { useProfile } from '../hooks/useProfile';
import { useDefaultRoom } from '../hooks/useDefaultRoom';
import { logger } from '../utils/logger';

export default function ChatApp() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  const { profile } = useProfile(user?.id);
  const { defaultRoom } = useDefaultRoom();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, error: messagesError, addMessage } = useMessages(roomId || defaultRoom?.id);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function initializeRoom() {
      try {
        if (roomId) {
          logger.info('Initializing specific room', { roomId });
          const { data: room, error: roomError } = await supabase
            .from('chat_rooms')
            .select('*')
            .eq('id', roomId)
            .single();

          if (roomError) throw roomError;
          setCurrentRoom(room);

          if (!room.is_public && !user) {
            logger.info('Redirecting unauthorized user to login', { roomId });
            navigate('/auth', { state: { redirect: `/chat/${roomId}` } });
          }
        } else if (defaultRoom) {
          logger.info('Using default room');
          setCurrentRoom(defaultRoom);
        }
      } catch (error) {
        logger.error('Error initializing room:', { error, roomId });
        setError('Failed to initialize chat room');
      }
    }

    initializeRoom();
  }, [roomId, user, navigate, defaultRoom]);

  usePresence(user?.id, currentRoom?.id);

  const handleSendMessage = async (text: string) => {
    if (!currentRoom) {
      logger.error('No current room when attempting to send message');
      setError('Chat room not initialized. Please try again.');
      return;
    }

    if (!user && !currentRoom.is_public) {
      navigate('/auth');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      logger.info('Translating message', { roomId: currentRoom.id });
      const { translation } = await detectAndTranslate(text);
      
      if (translation.includes('[Translation error]')) {
        logger.error('Translation failed', { text });
        setError('Translation failed. Please try again.');
        return;
      }

      const message = {
        room_id: currentRoom.id,
        sender_id: user?.id || null,
        sender_name: profile?.display_name || profile?.full_name || 'Anonymous',
        text,
        translation,
        created_at: new Date().toISOString()
      };

      logger.info('Sending message', { roomId: currentRoom.id });
      await addMessage(message);
      
      scrollToBottom();
    } catch (error) {
      logger.error('Error sending message:', { error, roomId: currentRoom.id });
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentRoom && !error) {
    return (
      <div className="h-[calc(100vh-64px)] bg-dark-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-400" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-dark-100 flex">
      <div className="flex-1 flex flex-col max-w-5xl mx-auto">
        <div className="bg-dark-50 border-b border-dark-300 px-4 py-3 flex items-center gap-3">
          {roomId && (
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-dark-200 rounded-full transition-colors text-gray-300"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="font-medium text-gray-100">{currentRoom?.name || 'Loading...'}</h2>
            <p className="text-sm text-gray-400">
              {currentRoom?.is_public ? 'Public Room' : 'Private Chat'}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id || `temp-${message.created_at}`} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {(error || messagesError) && (
          <div className="bg-red-900/20 text-red-400 p-3 text-center text-sm border-l-4 border-red-500">
            {error || messagesError}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 p-2 text-gray-400 text-sm">
            <Loader2 className="animate-spin" size={16} />
            <span>Translating...</span>
          </div>
        )}

        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>

      <div className="bg-dark-50 border-l border-dark-300 w-72 flex flex-col">
        {currentRoom?.is_public && <PublicChatWarning />}
        {currentRoom && <ActiveUsers roomId={currentRoom.id} />}
      </div>
    </div>
  );
}