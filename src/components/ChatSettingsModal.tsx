import React, { useState } from 'react';
import { X, Copy, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChatSettingsModalProps {
  chatId: string;
  chatName: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (name: string) => void;
}

export function ChatSettingsModal({ chatId, chatName, isOpen, onClose, onUpdate }: ChatSettingsModalProps) {
  const [name, setName] = useState(chatName);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('chat_rooms')
        .update({ name })
        .eq('id', chatId);

      if (error) throw error;
      onUpdate(name);
      onClose();
    } catch (err) {
      console.error('Error updating chat:', err);
      setError('Failed to update chat name');
    } finally {
      setIsLoading(false);
    }
  };

  const generateShareLink = async () => {
    try {
      setError(null);
      const shareUrl = `${window.location.origin}/chat/${chatId}`;
      setShareUrl(shareUrl);
    } catch (err) {
      console.error('Error generating share link:', err);
      setError('Failed to generate share link');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-dark-200 border border-dark-300 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Chat Settings</h2>
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
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border-l-4 border-red-500 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={generateShareLink}
              className="w-full px-4 py-2 bg-dark-300 text-gray-200 rounded-lg hover:bg-dark-400 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              Generate Share Link
            </button>

            {shareUrl && (
              <div className="p-3 bg-dark-300 rounded-lg">
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
            )}
          </div>
        </form>
      </div>
    </div>
  );
}