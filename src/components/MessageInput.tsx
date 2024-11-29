import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-3 bg-dark-50 border-t border-dark-300 flex gap-2 items-end"
    >
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        rows={1}
        style={{
          minHeight: '46px',
          maxHeight: '120px'
        }}
        className="flex-1 px-4 py-3 bg-dark-200 text-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-50 transition-colors placeholder-gray-500"
      />

      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="p-3 rounded-full bg-accent-600 text-white hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-dark-50 disabled:opacity-50 disabled:hover:bg-accent-600 transition-colors"
      >
        <Send size={20} />
      </button>
    </form>
  );
}