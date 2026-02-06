/**
 * DigitalOcean Spaces (S3-compatible) utilities
 * Using AWS SDK v3 for S3-compatible operations
 */
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from './config';

// Initialize S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
  endpoint: config.spaces.endpoint,
  region: 'us-east-1', // Required by SDK, actual region is in endpoint
  forcePathStyle: false, // Use subdomain/virtual calling format
  credentials: {
    accessKeyId: config.spaces.accessKeyId,
    secretAccessKey: config.spaces.secretAccessKey,
  },
});

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

export interface PresignedUrlResult {
  url: string;
  expiresIn: number;
}

/**
 * Upload a file to Spaces
 */
export const uploadToSpaces = async (
  file: File,
  key: string,
  metadata?: Record<string, string>
): Promise<UploadResult> => {
  // Convert File to ArrayBuffer then to Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: config.spaces.bucket,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    Metadata: metadata,
    ACL: 'public-read', // Make files publicly accessible
  });

  await s3Client.send(command);

  // Use CDN endpoint for better performance
  const url = `${config.spaces.cdnEndpoint}/${key}`;

  return {
    url,
    key,
    bucket: config.spaces.bucket,
  };
};

/**
 * Upload an image file
 */
export const uploadImage = async (
  file: File,
  folder: string,
  metadata?: Record<string, string>
): Promise<UploadResult> => {
  // Generate unique filename
  const timestamp = Date.now();
  const fileName = `${folder}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  
  return uploadToSpaces(file, fileName, {
    ...metadata,
    originalName: file.name,
    uploadedAt: new Date().toISOString(),
  });
};

/**
 * Upload a book cover image
 */
export const uploadBookCover = async (
  file: File,
  bookId: string,
  userId: string
): Promise<UploadResult> => {
  const key = `books/${userId}/${bookId}/cover.${file.name.split('.').pop()}`;
  return uploadToSpaces(file, key, {
    bookId,
    userId,
    type: 'cover-image',
  });
};

/**
 * Upload a book PDF
 */
export const uploadBookPdf = async (
  file: File,
  bookId: string,
  userId: string
): Promise<UploadResult> => {
  const key = `books/${userId}/${bookId}/book.pdf`;
  return uploadToSpaces(file, key, {
    bookId,
    userId,
    type: 'book-pdf',
  });
};

/**
 * Get a presigned URL for private file access
 */
export const getPresignedUrl = async (
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<PresignedUrlResult> => {
  const command = new GetObjectCommand({
    Bucket: config.spaces.bucket,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });

  return {
    url,
    expiresIn,
  };
};

/**
 * Delete a file from Spaces
 */
export const deleteFromSpaces = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: config.spaces.bucket,
    Key: key,
  });

  await s3Client.send(command);
};

/**
 * Get the CDN URL for a file key
 */
export const getCdnUrl = (key: string): string => {
  return `${config.spaces.cdnEndpoint}/${key}`;
};

/**
 * Get the origin URL for a file key
 */
export const getOriginUrl = (key: string): string => {
  return `${config.spaces.endpoint}/${key}`;
};

/**
 * Extract the file key from a full URL
 */
export const getKeyFromUrl = (url: string): string => {
  const urlObj = new URL(url);
  return urlObj.pathname.slice(1); // Remove leading slash
};

export { s3Client };
