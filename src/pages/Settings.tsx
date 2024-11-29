import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Save, Loader2 } from 'lucide-react';
import { AvatarUpload } from '../components/AvatarUpload';
import { updateProfile, getProfile } from '../services/profileService';
import { logger } from '../utils/logger';
import type { Profile } from '../types';

export default function Settings() {
  const user = useAuthStore(state => state.user);
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      const { profile, error } = await getProfile(user.id);
      
      if (error) throw new Error(error);
      
      if (profile) {
        setFullName(profile.full_name || '');
        setDisplayName(profile.display_name || '');
        setLocation(profile.location || '');
        setLanguages(profile.languages || []);
        setAvatarUrl(profile.avatar_url);
      }
    } catch (error) {
      logger.error('Error loading profile:', { error });
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const profileData: Partial<Profile> = {
        full_name: fullName,
        display_name: displayName,
        location,
        languages,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      };

      const { error } = await updateProfile(user.id, profileData);

      if (error) throw new Error(error);

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      
      // Reload profile to ensure we have the latest data
      await loadProfile();
    } catch (error: any) {
      logger.error('Error updating profile:', { error });
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLanguageToggle = (lang: string) => {
    setLanguages(prev => 
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-dark-100">
        <Loader2 className="animate-spin text-accent-400" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-dark-100 min-h-[calc(100vh-64px)]">
      <div className="bg-dark-200 rounded-lg border border-dark-300 p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Profile Settings</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="border-b border-dark-300 pb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-4">Profile Picture</h3>
              {user && (
                <AvatarUpload
                  currentAvatarUrl={avatarUrl}
                  onAvatarChange={setAvatarUrl}
                  userId={user.id}
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-gray-400"
                />
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-gray-100 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 placeholder-gray-500"
                  placeholder="How should others see you?"
                />
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-gray-100 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 placeholder-gray-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-gray-100 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 placeholder-gray-500"
                  placeholder="Where are you from? (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Languages You Speak
                </label>
                <div className="flex flex-wrap gap-2">
                  {['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Chinese', 'Japanese', 'Korean'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => handleLanguageToggle(lang)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        languages.includes(lang)
                          ? 'bg-accent-600 text-white'
                          : 'bg-dark-300 text-gray-300 hover:bg-dark-400'
                      } transition-colors`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/20 text-green-400 border-l-4 border-green-500' 
                : 'bg-red-900/20 text-red-400 border-l-4 border-red-500'
            }`}>
              {message.text}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}