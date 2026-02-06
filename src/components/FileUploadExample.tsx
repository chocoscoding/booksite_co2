/**
 * Example React component demonstrating file upload to DigitalOcean Spaces
 */
import { useState } from 'react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const FileUploadExample = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { uploadImageFile, status, progress, result, error, reset } = useFileUpload({
    onSuccess: (result) => {
      console.log('Upload successful:', result);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      reset();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadImageFile(selectedFile, 'uploads', {
        description: 'User uploaded image',
      });
    } catch (err) {
      // Error is already handled by the hook
    }
  };

  return (
    <div className="space-y-4 p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Upload to DigitalOcean Spaces</h2>
      
      <div className="space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        
        {selectedFile && (
          <p className="text-sm text-gray-600">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || status === 'uploading'}
        className="w-full"
      >
        {status === 'uploading' ? 'Uploading...' : 'Upload File'}
      </Button>

      {status === 'uploading' && progress && (
        <div className="space-y-2">
          <Progress value={progress.percentage} />
          <p className="text-sm text-center text-gray-600">
            {progress.percentage.toFixed(0)}% uploaded
          </p>
        </div>
      )}

      {status === 'success' && result && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            <strong>Upload successful!</strong>
            <br />
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {result.url}
            </a>
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            <strong>Upload failed:</strong> {error.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
