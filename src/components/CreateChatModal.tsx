import React, { useState } from 'react';
import { X, MessageSquare, Share2, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (chatId: string) => void;
}

export function CreateChatModal({ isOpen, onClose, onChatCreated }: CreateChatModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create chat room
      const { data: chat, error: createError } = await supabase
        .from('chat_rooms')
        .insert({
          name: name.trim(),
          owner_id: (await supabase.auth.getUser()).data.user?.id,
          is_public: false,
          share_url: `${window.location.origin}/chat/${crypto.randomUUID()}`
        })
        .select()
        .single();

      if (createError) throw createError;
      
      setShareUrl(chat.share_url);
      onChatCreated(chat.id);
    } catch (err) {
      console.error('Error creating chat:', err);
      setError('Failed to create chat room');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-dark-200 border border-dark-300 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Create New Chat</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-dark-300 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="chatName" className="block text-sm font-medium text-gray-300 mb-1">
              Chat Name
            </label>
            <input
              type="text"
              id="chatName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-dark-300 border border-dark-400 text-gray-100 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 placeholder-gray-500"
              placeholder="Enter chat name"
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border-l-4 border-red-500 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {shareUrl ? (
            <div className="space-y-4">
              <div className="p-4 bg-dark-300 rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 text-sm bg-transparent text-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      alert('Link copied to clipboard!');
                    }}
                    className="p-2 text-gray-400 hover:bg-dark-400 rounded-full transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-dark-300 text-gray-200 rounded-lg hover:bg-dark-400 transition-colors"
                >
                  Close
                </button>
                <a
                  href={`/chat/${shareUrl.split('/').pop()}`}
                  className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-center"
                >
                  Open Chat
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Join my chat on BilingualChat: ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Share on WhatsApp
                </a>
                <a
                  href={`mailto:?subject=Join my BilingualChat&body=${encodeURIComponent(`Join my chat on BilingualChat: ${shareUrl}`)}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Share via Email
                </a>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <MessageSquare size={18} />
                  Create Chat
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}