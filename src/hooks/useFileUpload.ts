
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createUserFriendlyError } from '@/lib/errorHandling';
import { toast } from 'sonner';

// File validation constants
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

export const useFileUpload = (boardId: string) => {
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File): void => {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw createUserFriendlyError('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw createUserFriendlyError('File is too large. Please upload an image smaller than 5MB.');
    }

    // Double-check extension (additional security)
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      throw createUserFriendlyError('Invalid file extension. Please upload a valid image file.');
    }

    // Check filename for security (prevent path traversal)
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      throw createUserFriendlyError('Invalid filename. Please rename your file and try again.');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      
      // Validate file before upload
      validateFile(file);
      
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt || !ALLOWED_EXTENSIONS.some(ext => ext.substring(1) === fileExt)) {
        throw createUserFriendlyError('Invalid file extension detected.');
      }

      // Generate secure filename
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${boardId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('board-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false // Prevent overwriting existing files
        });

      if (error) {
        console.error('Storage upload error:', error);
        
        if (error.message.includes('The resource already exists')) {
          throw createUserFriendlyError('A file with this name already exists. Please try again.');
        } else if (error.message.includes('insufficient_scope')) {
          throw createUserFriendlyError('You do not have permission to upload files to this board.');
        } else if (error.message.includes('Payload too large')) {
          throw createUserFriendlyError('File is too large. Please upload a smaller image.');
        } else {
          throw createUserFriendlyError('Failed to upload image. Please try again.');
        }
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('board-images')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw createUserFriendlyError('Failed to generate image URL. Please try again.');
      }

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      
      if (error instanceof Error && 'userFriendly' in error) {
        toast.error(error.message);
        throw error;
      } else {
        const friendlyError = createUserFriendlyError('Failed to upload image. Please check your connection and try again.');
        toast.error(friendlyError.message);
        throw friendlyError;
      }
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};
