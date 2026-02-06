# DigitalOcean Spaces Integration - Frontend

This directory contains the DigitalOcean Spaces (S3-compatible) integration for the booksite frontend.

## Configuration

The Spaces configuration is managed through environment variables in `.env`:

```env
# DigitalOcean Spaces Configuration
VITE_SPACES_KEY=DO801DWRK9FWNQNDQY7N
VITE_SPACES_SECRET=WWEsxQssPlAR7qkoXBZh2aTvJQsXTadi1xi6E7+gI4Q
VITE_SPACES_REGION=sfo3
VITE_SPACES_BUCKET=c02
VITE_SPACES_ENDPOINT=https://c02.sfo3.digitaloceanspaces.com
VITE_SPACES_CDN_ENDPOINT=https://c02.sfo3.cdn.digitaloceanspaces.com
```

### Endpoints

- **Origin Endpoint**: `https://c02.sfo3.digitaloceanspaces.com` - Direct access to Spaces
- **CDN Endpoint**: `https://c02.sfo3.cdn.digitaloceanspaces.com` - Cached via CDN for better performance

The CDN endpoint is used by default for better performance and lower latency.

## Installation

Install the required AWS SDK packages:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## Usage

### Basic File Upload

```typescript
import { uploadToSpaces } from '@/lib/spaces';

const file = /* File from input */;
const result = await uploadToSpaces(file, 'path/to/file.jpg', {
  description: 'My file',
});

console.log(result.url); // CDN URL
```

### Using the Hook

```typescript
import { useFileUpload } from '@/hooks/use-file-upload';

function MyComponent() {
  const { uploadImageFile, status, progress, result } = useFileUpload({
    onSuccess: (result) => console.log('Uploaded:', result.url),
    onError: (error) => console.error('Failed:', error),
  });

  const handleUpload = async (file: File) => {
    await uploadImageFile(file, 'images');
  };

  return (
    <div>
      {status === 'uploading' && <p>Progress: {progress?.percentage}%</p>}
      {status === 'success' && <img src={result?.url} alt="Uploaded" />}
    </div>
  );
}
```

### Upload Book Assets

```typescript
import { uploadBookCover, uploadBookPdf } from '@/lib/spaces';

// Upload book cover
const coverResult = await uploadBookCover(coverFile, bookId, userId);

// Upload book PDF
const pdfResult = await uploadBookPdf(pdfFile, bookId, userId);
```

### Get Presigned URLs (for private files)

```typescript
import { getPresignedUrl } from '@/lib/spaces';

// Get a temporary download URL (expires in 1 hour)
const { url, expiresIn } = await getPresignedUrl('private/file.pdf', 3600);
```

### Delete Files

```typescript
import { deleteFromSpaces } from '@/lib/spaces';

await deleteFromSpaces('path/to/file.jpg');
```

## File Structure

```
booksite/
├── .env                                  # Environment variables (git-ignored)
├── .env.example                          # Example environment template
└── src/
    ├── lib/
    │   ├── config.ts                    # Configuration loader
    │   └── spaces.ts                    # Spaces utilities
    ├── hooks/
    │   └── use-file-upload.ts           # React hook for uploads
    ├── types/
    │   └── spaces.ts                    # TypeScript types
    └── components/
        └── FileUploadExample.tsx        # Example component
```

## API Reference

### Functions

#### `uploadToSpaces(file, key, metadata?)`
Upload any file to Spaces.

#### `uploadImage(file, folder, metadata?)`
Upload an image with automatic naming.

#### `uploadBookCover(file, bookId, userId)`
Upload a book cover image.

#### `uploadBookPdf(file, bookId, userId)`
Upload a book PDF.

#### `getPresignedUrl(key, expiresIn?)`
Get a temporary signed URL for private file access.

#### `deleteFromSpaces(key)`
Delete a file from Spaces.

#### `getCdnUrl(key)`
Get the CDN URL for a file key.

#### `getOriginUrl(key)`
Get the origin URL for a file key.

#### `getKeyFromUrl(url)`
Extract the file key from a full URL.

### Hook: `useFileUpload(options?)`

Returns:
- `uploadFile(file, key, metadata?)` - Upload any file
- `uploadImageFile(file, folder, metadata?)` - Upload an image
- `uploadCover(file, bookId, userId)` - Upload book cover
- `uploadPdf(file, bookId, userId)` - Upload book PDF
- `reset()` - Reset upload state
- `status` - Current status: 'idle' | 'uploading' | 'success' | 'error'
- `progress` - Upload progress { loaded, total, percentage }
- `result` - Upload result { url, key, bucket }
- `error` - Error object if upload failed

## Security Notes

1. **Environment Variables**: Never commit `.env` to version control
2. **ACL**: Files are uploaded with `public-read` ACL by default
3. **CORS**: Configure CORS in your DigitalOcean Spaces settings for browser uploads
4. **Credentials**: Keep access keys secure and rotate regularly

## CORS Configuration

To enable browser uploads, configure CORS in your DigitalOcean Spaces:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:5173", "https://yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

## AWS SDK Configuration

The S3 client is configured with:
- **endpoint**: Points to DigitalOcean Spaces
- **region**: Set to `us-east-1` (AWS SDK requirement)
- **forcePathStyle**: `false` (use subdomain format)
- **credentials**: Your Spaces access keys

## Performance Tips

1. Use the **CDN endpoint** for public files (faster, cached)
2. Use **presigned URLs** for private files (time-limited access)
3. Optimize images before uploading
4. Use appropriate file naming conventions for better organization

## Troubleshooting

### Upload fails with CORS error
- Check CORS configuration in Spaces settings
- Verify allowed origins include your frontend URL

### Files not publicly accessible
- Ensure ACL is set to 'public-read'
- Check bucket permissions

### Presigned URLs not working
- Verify credentials are correct
- Check expiration time hasn't passed

## Links

- [DigitalOcean Spaces Documentation](https://docs.digitalocean.com/products/spaces/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
