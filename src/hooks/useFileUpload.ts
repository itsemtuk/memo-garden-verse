
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createUserFriendlyError } from '@/lib/errorHandling';
import { validateImageFile } from '@/lib/validation';
import { toast } from 'sonner';

export const useFileUpload = (boardId: string) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      
      // Validate file before upload
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw createUserFriendlyError(validation.error || 'Invalid file');
      }
      
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt) {
        throw createUserFriendlyError('File must have a valid extension');
      }

      // Generate secure filename with board ID for proper RLS
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${boardId}/${fileName}`;

      // Verify user has access to this board before uploading
      const { data: boardCheck } = await supabase
        .from('boards')
        .select('id')
        .eq('id', boardId)
        .maybeSingle();

      if (!boardCheck) {
        throw createUserFriendlyError('You do not have permission to upload to this board');
      }

      const { data, error } = await supabase.storage
        .from('board-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        
        if (error.message.includes('The resource already exists')) {
          throw createUserFriendlyError('A file with this name already exists. Please try again.');
        } else if (error.message.includes('insufficient_scope')) {
          throw createUserFriendlyError('You do not have permission to upload files to this board.');
        } else if (error.message.includes('Payload too large')) {
          throw createUserFriendlyError('File is too large. Please upload a smaller image.');
        } else if (error.message.includes('Invalid mime type')) {
          throw createUserFriendlyError('Invalid file type. Please upload a valid image.');
        } else {
          throw createUserFriendlyError('Failed to upload image. Please try again.');
        }
      }

      // Get the public URL (even for private buckets, this generates the URL)
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
