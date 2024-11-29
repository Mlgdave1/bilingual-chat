import { supabase } from '../lib/supabase';
import { createInitialProfile } from '../services/profileService';
import { logger } from './logger';

export async function signUpUser(email: string, password: string, username: string) {
  try {
    // Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('Failed to create user');

    // Create initial profile
    const { error: profileError } = await createInitialProfile(
      authData.user.id,
      username,
      username
    );

    if (profileError) {
      logger.error('Profile creation failed:', { error: profileError });
      throw new Error('Failed to create user profile');
    }

    // Sign in the user immediately
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;

    return { user: authData.user, error: null };
  } catch (error: any) {
    logger.error('Sign up failed:', { error });
    return { user: null, error: error.message };
  }
}

export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Ensure profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create one
      const { error: createError } = await createInitialProfile(
        data.user.id,
        data.user.email?.split('@')[0] || 'User',
        data.user.email?.split('@')[0] || 'User'
      );

      if (createError) throw createError;
    } else if (profileError) {
      throw profileError;
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    logger.error('Sign in failed:', { error });
    return { user: null, error: error.message };
  }
}