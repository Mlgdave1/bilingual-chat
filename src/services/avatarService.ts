import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export async function uploadAvatar(userId: string, file: File) {
  try {
    logger.info('Starting avatar upload', { userId });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      throw new Error('Please upload a valid image file (JPG, PNG, or GIF)');
    }

    const filePath = `${userId}/avatar.${fileExt}`;

    // Delete old avatar if exists
    const { data: oldFiles } = await supabase
      .storage
      .from('avatars')
      .list(userId);

    if (oldFiles?.length) {
      await supabase
        .storage
        .from('avatars')
        .remove(oldFiles.map(f => `${userId}/${f.name}`));
    }

    // Upload new avatar
    const { error: uploadError, data } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { 
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) throw updateError;

    logger.info('Avatar uploaded successfully', { userId, publicUrl });

    return { url: publicUrl, error: null };
  } catch (error: any) {
    logger.error('Avatar upload failed:', { error });
    return { url: null, error: error.message };
  }
}

export async function setStockAvatar(userId: string, url: string) {
  try {
    logger.info('Setting stock avatar', { userId });

    const { error } = await supabase
      .from('profiles')
      .update({ 
        avatar_url: url,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    logger.info('Stock avatar set successfully', { userId });
    return { success: true, error: null };
  } catch (error: any) {
    logger.error('Failed to set stock avatar:', { error });
    return { success: false, error: error.message };
  }
}