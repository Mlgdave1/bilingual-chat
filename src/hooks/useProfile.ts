import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';
import type { Profile } from '../types';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First try to get existing profile
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        logger.error('Error fetching profile', { error: fetchError, userId });
        // If no profile exists, create one
        if (fetchError.code === 'PGRST116') {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            throw new Error(`Failed to get user data: ${userError.message}`);
          }

          if (!userData.user) {
            throw new Error('No user data available');
          }

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              display_name: userData.user?.user_metadata.username || userData.user?.email?.split('@')[0] || 'User',
              full_name: userData.user?.user_metadata.username || userData.user?.email?.split('@')[0] || 'User',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) {
            logger.error('Error creating profile', { error: createError, userId });
            throw createError;
          }
          setProfile(newProfile);
          return;
        }
        throw fetchError;
      }

      setProfile(data);
    } catch (error: any) {
      logger.error('Error fetching user profile:', { error, userId });
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId) return;

    try {
      setError(null);
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;
      setProfile(data);
      return { success: true, error: null };
    } catch (error: any) {
      logger.error('Error updating profile:', { error, userId });
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    profile,
    error,
    isLoading,
    updateProfile,
    reloadProfile: loadProfile
  };
}