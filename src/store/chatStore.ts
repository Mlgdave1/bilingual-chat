import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Chat, Message } from '../types';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, text: string, translation: string) => Promise<void>;
  setCurrentChat: (chat: Chat | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,

  setCurrentChat: (chat) => set({ currentChat: chat }),

  fetchChats: async () => {
    try {
      set({ loading: true });
      const { data: chats, error } = await supabase
        .rpc('get_user_chats', { 
          p_user_id: (await supabase.auth.getUser()).data.user?.id 
        });

      if (error) throw error;
      set({ chats, error: null });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchMessages: async (chatId: string) => {
    try {
      set({ loading: true });
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ messages, error: null });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (chatId: string, text: string, translation: string) => {
    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: (await supabase.auth.getUser()).data.user?.id,
          text,
          translation,
        })
        .select()
        .single();

      if (error) throw error;

      // Update chat's updated_at timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

      set(state => ({
        messages: [...state.messages, message],
        error: null,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));