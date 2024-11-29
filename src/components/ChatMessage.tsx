import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { Message } from '../types';
import { useAuthStore } from '../store/authStore';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const currentUser = useAuthStore(state => state.user);
  const { profile } = useProfile(message.sender_id || undefined);
  const isOwnMessage = message.sender_id === currentUser?.id;

  const displayName = profile?.display_name || 
                     profile?.full_name || 
                     message.sender_name || 
                     'Anonymous';

  return (
    <div className={`flex flex-col gap-1 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
      <span className="text-xs text-gray-500 px-2">
        {displayName}
      </span>
      <div className="flex gap-2">
        <div className={`max-w-[80%]`}>
          <div 
            className={`rounded-2xl p-4 ${
              isOwnMessage 
                ? 'bg-accent-600 text-white rounded-tr-none' 
                : 'bg-dark-200 text-gray-100 rounded-tl-none border border-dark-300'
            }`}
          >
            <p className="text-[15px] font-medium leading-tight">{message.text}</p>
            <p className={`text-sm leading-tight ${
              isOwnMessage ? 'text-accent-100' : 'text-gray-400'
            } italic mt-1`}>
              {message.translation}
            </p>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block px-2">
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}