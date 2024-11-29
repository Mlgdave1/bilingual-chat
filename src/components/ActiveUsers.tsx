import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { useAuthStore } from '../store/authStore';

interface ActiveUsersProps {
  roomId: string;
}

export function ActiveUsers({ roomId }: ActiveUsersProps) {
  const [activeUsers, setActiveUsers] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useAuthStore(state => state.user);

  useEffect(() => {
    const loadActiveUsers = async () => {
      try {
        // First, clean up stale presence
        await supabase.rpc('cleanup_stale_presence');

        // Then fetch active users
        const { data, error } = await supabase
          .from('presence')
          .select(`
            profile:profile_id (
              id,
              display_name,
              full_name,
              avatar_url,
              location,
              languages
            )
          `)
          .eq('room_id', roomId)
          .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

        if (error) throw error;

        const profiles = data
          ?.map(item => item.profile)
          .filter((profile): profile is Profile => profile !== null);

        setActiveUsers(profiles || []);
        setError(null);
      } catch (error) {
        console.error('Error loading active users:', error);
        setError('Failed to load active users');
      }
    };

    loadActiveUsers();
    const interval = setInterval(loadActiveUsers, 10000);

    // Subscribe to presence changes
    const channel = supabase
      .channel(`presence_${roomId}`)
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public',
          table: 'presence',
          filter: `room_id=eq.${roomId}`
        },
        () => {
          loadActiveUsers();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 border-b border-dark-300">
        <h3 className="text-sm font-medium text-gray-200">Active Users ({activeUsers.length})</h3>
      </div>

      {error ? (
        <div className="p-4 text-sm text-red-400">{error}</div>
      ) : (
        <div className="p-4">
          <div className="space-y-3">
            {activeUsers.map(user => (
              <div 
                key={user.id} 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-200 transition-colors"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-dark-300 flex items-center justify-center">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.display_name || user.full_name || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark-50"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {user.display_name || user.full_name || 'Anonymous'}
                    {user.id === currentUser?.id && (
                      <span className="ml-2 text-xs text-accent-400">(You)</span>
                    )}
                  </p>
                  {user.location && (
                    <p className="text-xs text-gray-400 truncate">
                      {user.location}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {activeUsers.length === 0 && (
              <div className="text-center py-8">
                <User className="mx-auto text-gray-600 mb-2" size={24} />
                <p className="text-sm text-gray-400">No active users</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}