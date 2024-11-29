import React, { useState, useEffect } from 'react';
import { Plus, Share2, MessageSquare, Settings, Loader2, Trash2, Brain, Trophy, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { ChatRoom } from '../types';
import { ChatSettingsModal } from '../components/ChatSettingsModal';
import { CreateChatModal } from '../components/CreateChatModal';
import { LearningStats } from '../components/LearningStats';
import { DashboardTour } from '../components/DashboardTour';
import { LanguageProgress } from '../components/LanguageProgress';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [privateChats, setPrivateChats] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    loadPrivateChats();
    checkFirstVisit();
  }, [user]);

  const checkFirstVisit = async () => {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_seen_tour')
      .eq('id', user.id)
      .single();

    if (profile && !profile.has_seen_tour) {
      setShowTour(true);
      await supabase
        .from('profiles')
        .update({ has_seen_tour: true })
        .eq('id', user.id);
    }
  };

  const loadPrivateChats = async () => {
    try {
      const { data, error: chatsError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('owner_id', user?.id)
        .order('updated_at', { ascending: false });

      if (chatsError) throw chatsError;
      setPrivateChats(data || []);
    } catch (error) {
      console.error('Error loading private chats:', error);
      setError('Failed to load your chats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatCreated = (chatId: string) => {
    loadPrivateChats();
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('chat_rooms')
        .delete()
        .eq('id', chatId);

      if (deleteError) throw deleteError;
      setPrivateChats(prev => prev.filter(chat => chat.id !== chatId));
    } catch (error) {
      console.error('Error deleting chat:', error);
      setError('Failed to delete chat');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chat Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-100">Your Chats</h1>
                <p className="text-gray-400">Manage your private conversations</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                <Plus size={20} />
                New Chat
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border-l-4 border-red-500 text-red-400">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-accent-500" size={32} />
              </div>
            ) : privateChats.length > 0 ? (
              <div className="grid gap-4">
                {privateChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => navigate(`/chat/${chat.id}`)}
                    className="bg-dark-200 p-6 rounded-lg border border-dark-300 hover:border-dark-400 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="text-accent-400" size={24} />
                        <div>
                          <h3 className="font-medium text-gray-200">{chat.name}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(chat.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => deleteChat(chat.id, e)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedChat(chat);
                          }}
                          className="p-2 text-gray-500 hover:text-accent-400 hover:bg-accent-400/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Settings size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-200 mb-2">No private chats yet</h3>
                <p className="text-gray-400 mb-4">Start a new conversation or share your profile to connect</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  <Plus size={20} />
                  Create Your First Chat
                </button>
              </div>
            )}
          </div>

          {/* Learning Progress Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-2">Learning Progress</h2>
              <p className="text-gray-400">Track your language learning journey</p>
            </div>

            <LearningStats userId={user?.id} />
            <LanguageProgress userId={user?.id} />

            <div className="bg-dark-200 rounded-lg p-6 border border-dark-300">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-accent-400" size={24} />
                <h3 className="text-lg font-medium text-gray-200">Daily Goals</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Messages Sent</span>
                  <span className="text-gray-200">12/20</span>
                </div>
                <div className="w-full bg-dark-300 rounded-full h-2">
                  <div className="bg-accent-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-dark-200 rounded-lg p-6 border border-dark-300">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="text-accent-400" size={24} />
                <h3 className="text-lg font-medium text-gray-200">Achievements</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {/* Achievement badges would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedChat && (
        <ChatSettingsModal
          chatId={selectedChat.id}
          chatName={selectedChat.name}
          isOpen={true}
          onClose={() => setSelectedChat(null)}
          onUpdate={(newName) => {
            setPrivateChats(prev =>
              prev.map(chat =>
                chat.id === selectedChat.id ? { ...chat, name: newName } : chat
              )
            );
            setSelectedChat(null);
          }}
        />
      )}

      <CreateChatModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onChatCreated={handleChatCreated}
      />

      <DashboardTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
      />
    </div>
  );
}