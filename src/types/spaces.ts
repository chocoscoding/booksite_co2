/**
 * Types for DigitalOcean Spaces / S3 operations
 */

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

export interface PresignedUrlResult {
  url: string;
  expiresIn: number;
}

export interface FileMetadata {
  bookId?: string;
  userId?: string;
  type?: string;
  originalName?: string;
  uploadedAt?: string;
  [key: string]: string | undefined;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface UploadState {
  status: UploadStatus;
  progress?: UploadProgress;
  result?: UploadResult;
  error?: Error;
}
