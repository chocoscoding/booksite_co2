/**
 * React hook for uploading files to DigitalOcean Spaces
 */
import { useState, useCallback } from 'react';
import { uploadToSpaces, uploadImage, uploadBookCover, uploadBookPdf } from '@/lib/spaces';
import type { UploadState, UploadResult } from '@/types/spaces';

export interface UseFileUploadOptions {
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
  onProgress?: (percentage: number) => void;
}

export const useFileUpload = (options?: UseFileUploadOptions) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
  });

  const uploadFile = useCallback(
    async (file: File, key: string, metadata?: Record<string, string>) => {
      setUploadState({ status: 'uploading', progress: { loaded: 0, total: file.size, percentage: 0 } });

      try {
        const result = await uploadToSpaces(file, key, metadata);
        
        setUploadState({
          status: 'success',
          result,
          progress: { loaded: file.size, total: file.size, percentage: 100 },
        });

        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Upload failed');
        setUploadState({ status: 'error', error: err });
        options?.onError?.(err);
        throw err;
      }
    },
    [options]
  );

  const uploadImageFile = useCallback(
    async (file: File, folder: string, metadata?: Record<string, string>) => {
      setUploadState({ status: 'uploading', progress: { loaded: 0, total: file.size, percentage: 0 } });

      try {
        const result = await uploadImage(file, folder, metadata);
        
        setUploadState({
          status: 'success',
          result,
          progress: { loaded: file.size, total: file.size, percentage: 100 },
        });

        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Upload failed');
        setUploadState({ status: 'error', error: err });
        options?.onError?.(err);
        throw err;
      }
    },
    [options]
  );

  const uploadCover = useCallback(
    async (file: File, bookId: string, userId: string) => {
      setUploadState({ status: 'uploading', progress: { loaded: 0, total: file.size, percentage: 0 } });

      try {
        const result = await uploadBookCover(file, bookId, userId);
        
        setUploadState({
          status: 'success',
          result,
          progress: { loaded: file.size, total: file.size, percentage: 100 },
        });

        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Upload failed');
        setUploadState({ status: 'error', error: err });
        options?.onError?.(err);
        throw err;
      }
    },
    [options]
  );

  const uploadPdf = useCallback(
    async (file: File, bookId: string, userId: string) => {
      setUploadState({ status: 'uploading', progress: { loaded: 0, total: file.size, percentage: 0 } });

      try {
        const result = await uploadBookPdf(file, bookId, userId);
        
        setUploadState({
          status: 'success',
          result,
          progress: { loaded: file.size, total: file.size, percentage: 100 },
        });

        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Upload failed');
        setUploadState({ status: 'error', error: err });
        options?.onError?.(err);
        throw err;
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setUploadState({ status: 'idle' });
  }, []);

  return {
    uploadFile,
    uploadImageFile,
    uploadCover,
    uploadPdf,
    reset,
    ...uploadState,
  };
};
