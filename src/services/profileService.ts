import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';
import type { Profile } from '../types';

export async function createInitialProfile(userId: string, displayName: string, fullName: string) {
  try {
    logger.info('Creating initial profile', { userId });

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      logger.info('Profile already exists', { userId });
      return { profile: existingProfile, error: null };
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        display_name: displayName,
        full_name: fullName,
        languages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      logger.error('Initial profile creation failed:', { error, userId });
      return { profile: null, error: error.message };
    }

    logger.info('Initial profile created successfully', { userId });
    return { profile: data, error: null };
  } catch (error: any) {
    logger.error('Error in createInitialProfile:', { error });
    return { profile: null, error: error.message };
  }
}

export async function updateProfile(userId: string, profileData: Partial<Profile>) {
  try {
    logger.info('Updating profile', { userId });

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Profile update failed:', { error, userId });
      return { profile: null, error: error.message };
    }

    logger.info('Profile updated successfully', { userId });
    return { profile: data, error: null };
  } catch (error: any) {
    logger.error('Error in updateProfile:', { error });
    return { profile: null, error: error.message };
  }
}

export async function getProfile(userId: string) {
  try {
    logger.info('Fetching profile', { userId });

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: userData } = await supabase.auth.getUser();
        return createInitialProfile(
          userId,
          userData.user?.user_metadata.username || userData.user?.email?.split('@')[0] || 'User',
          userData.user?.user_metadata.username || userData.user?.email?.split('@')[0] || 'User'
        );
      }
      throw error;
    }

    logger.info('Profile fetched successfully', { userId });
    return { profile: data, error: null };
  } catch (error: any) {
    logger.error('Error in getProfile:', { error });
    return { profile: null, error: error.message };
  }
}