import React, { useState, useEffect } from 'react';
import { MessageCircle, User, LogOut, Settings, Layout, Mic } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { QuickTranslateMode } from './QuickTranslateMode';

export function Header() {
  const { user, signOut } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showQuickTranslate, setShowQuickTranslate] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const buildTime = new Date().toLocaleString();

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setProfile(data);
        }
      };
      
      fetchProfile();
    }
  }, [user]);

  return (
    <>
      <div className="bg-dark-50 border-b border-dark-300 py-4 px-4 sm:px-6 flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-accent-600/20 p-2 rounded-full">
              <MessageCircle size={22} className="text-accent-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-100">BilingualChat</h1>
              <p className="text-xs text-gray-400">English ↔️ Spanish</p>
            </div>
          </Link>
          
          <div className="bg-yellow-400 px-3 py-1 rounded text-black text-sm">
            Last Updated: {buildTime}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowQuickTranslate(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-accent-600 to-accent-500 text-white px-4 py-2 rounded-lg hover:from-accent-700 hover:to-accent-600 transition-all"
          >
            <Mic size={18} />
            <span className="hidden sm:inline">Quick Translate</span>
          </button>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-2 bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors"
              >
                <Layout size={18} />
                <span>My Dashboard</span>
              </Link>
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 bg-dark-300 px-3 py-2 rounded-lg hover:bg-dark-400 transition-colors"
                >
                  <User size={18} />
                  <span className="text-sm hidden sm:inline text-gray-200">
                    {profile?.display_name || profile?.full_name || 'Profile'}
                  </span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-200 rounded-lg shadow-lg py-1 z-50 border border-dark-300">
                    <Link
                      to="/dashboard"
                      className="sm:hidden flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-dark-300 transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <Layout size={16} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-dark-300 transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <button 
                      onClick={() => {
                        signOut();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-dark-300 transition-colors w-full"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link 
              to="/auth"
              className="flex items-center gap-2 bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors"
            >
              <User size={18} />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {showMenu && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
        )}
      </div>

      <QuickTranslateMode 
        isOpen={showQuickTranslate} 
        onClose={() => setShowQuickTranslate(false)} 
      />
    </>
  );
}