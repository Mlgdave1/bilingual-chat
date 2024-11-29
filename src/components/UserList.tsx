import React from 'react';
import { User, Users } from 'lucide-react';
import { Profile } from '../types';

interface UserListProps {
  users: Profile[];
  currentUserId: string | undefined;
}

export function UserList({ users, currentUserId }: UserListProps) {
  const sortedUsers = [...users].sort((a, b) => {
    // Current user always first
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    // Then sort by name
    return (a.full_name || '').localeCompare(b.full_name || '');
  });

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-accent-400" />
        <h2 className="text-lg font-medium text-gray-200">Chat Members</h2>
      </div>
      
      <div className="space-y-2">
        {sortedUsers.map((user) => (
          <div
            key={user.id}
            className={`flex items-center gap-3 p-2 rounded-lg ${
              user.id === currentUserId ? 'bg-accent-600/10' : 'hover:bg-dark-200'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-dark-300 flex items-center justify-center">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User size={16} className="text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">
                {user.full_name || 'Anonymous'}
                {user.id === currentUserId && (
                  <span className="ml-2 text-xs text-accent-400">(You)</span>
                )}
              </p>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No active users
          </p>
        )}
      </div>
    </div>
  );
}