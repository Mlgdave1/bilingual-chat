import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadAvatar, setStockAvatar } from '../services/avatarService';
import { logger } from '../utils/logger';

const STOCK_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop'
];

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onAvatarChange: (url: string) => void;
  userId: string;
}

export function AvatarUpload({ currentAvatarUrl, onAvatarChange, userId }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [showStockAvatars, setShowStockAvatars] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Please select an image to upload.');
      }

      const file = event.target.files[0];
      const { url, error } = await uploadAvatar(userId, file);

      if (error) throw new Error(error);
      if (!url) throw new Error('Failed to get avatar URL');

      onAvatarChange(url);
      logger.info('Avatar updated successfully', { userId });
    } catch (error: any) {
      logger.error('Error uploading avatar:', { error, userId });
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleStockAvatarSelect = async (url: string) => {
    try {
      setUploading(true);
      setError(null);

      const { error } = await setStockAvatar(userId, url);
      if (error) throw new Error(error);

      onAvatarChange(url);
      setShowStockAvatars(false);
      logger.info('Stock avatar set successfully', { userId });
    } catch (error: any) {
      logger.error('Error setting stock avatar:', { error, userId });
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={currentAvatarUrl || 'https://via.placeholder.com/150'}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-dark-300"
          />
          {uploading && (
            <div className="absolute inset-0 bg-dark-900/50 rounded-full flex items-center justify-center">
              <Loader2 className="animate-spin text-accent-400" size={24} />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <span className="flex items-center gap-2 px-4 py-2 bg-dark-300 text-gray-200 rounded-lg hover:bg-dark-400 transition-colors">
                <Upload size={18} />
                Upload Photo
              </span>
            </label>

            <button
              onClick={() => setShowStockAvatars(!showStockAvatars)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-300 text-gray-200 rounded-lg hover:bg-dark-400 transition-colors"
            >
              <ImageIcon size={18} />
              Choose Stock
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
        </div>
      </div>

      {showStockAvatars && (
        <div className="bg-dark-200 rounded-lg p-4 border border-dark-300">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-200">Stock Avatars</h4>
            <button
              onClick={() => setShowStockAvatars(false)}
              className="p-1 hover:bg-dark-300 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {STOCK_AVATARS.map((url) => (
              <button
                key={url}
                onClick={() => handleStockAvatarSelect(url)}
                disabled={uploading}
                className="relative group"
              >
                <img
                  src={url}
                  alt="Stock avatar"
                  className="w-full aspect-square rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-dark-900/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Check className="text-white" size={20} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}