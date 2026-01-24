import { useState } from 'react';
import { authService } from '@/app/services/backend/auth.api';
import { useAuthStore } from '@/domain/Auth/store/auth.store';

export function useProfileImageUpload() {
  const { user, setUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const uploadProfileImage = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      const { uploadUrl, fileUrl } = await authService.getProfileImagePresign(file.type);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`S3 Upload Failed: ${uploadResponse.statusText}`);
      }

      const updatedUser = await authService.updateMe({ profileImage: fileUrl });

      setUser({
        ...user,
        ...updatedUser,
      });

      return fileUrl;
    } finally {
      setIsUploading(false);
    }
  };

  const removeProfileImage = async () => {
    if (!user) return;

    setIsUploading(true);
    try {
      const updatedUser = await authService.deleteProfileImage();

      setUser({
        ...user,
        ...updatedUser,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadProfileImage, removeProfileImage, isUploading };
}
