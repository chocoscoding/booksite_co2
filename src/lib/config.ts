/**
 * Application configuration from environment variables
 */
export const config = {
  // API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',

  // DigitalOcean Spaces (S3-compatible)
  spaces: {
    accessKeyId: import.meta.env.VITE_SPACES_KEY || '',
    secretAccessKey: import.meta.env.VITE_SPACES_SECRET || '',
    region: import.meta.env.VITE_SPACES_REGION || 'sfo3',
    bucket: import.meta.env.VITE_SPACES_BUCKET || 'c02',
    endpoint: import.meta.env.VITE_SPACES_ENDPOINT || 'https://c02.sfo3.digitaloceanspaces.com',
    cdnEndpoint: import.meta.env.VITE_SPACES_CDN_ENDPOINT || 'https://c02.sfo3.cdn.digitaloceanspaces.com',
  },
} as const;
