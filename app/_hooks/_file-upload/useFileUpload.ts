// hooks/useFileUpload.ts
import { useState } from 'react';
import axios from 'axios';
import { rootPath } from '@/app/_constants/config';
import toast from 'react-hot-toast';

interface UseFileUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: any) => void;
  fileName?: string;
  showToast?: boolean;
}

interface UseFileUploadReturn {
  uploadFile: (file: File | Blob, customFileName?: string) => Promise<string | null>;
  fileUrl: string | null;
  isUploading: boolean;
  error: any;
}

export const useFileUpload = ({
  onSuccess,
  onError,
  fileName = 'file',
  showToast = true,
}: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<any>(null);

  const uploadFile = async (file: File | Blob, customFileName?: string): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file, customFileName || fileName);

      const response = await axios.post(`${rootPath}/file-upload`, formData);

      if (response?.status === 200) {
        const uploadedFileUrl = response?.data?.data;
        setFileUrl(uploadedFileUrl);
        
        if (showToast) {
          toast.success('File uploaded successfully.');
        }
        
        onSuccess?.(uploadedFileUrl);
        return uploadedFileUrl;
      }
      return null;
    } catch (err) {
      setError(err);
      if (showToast) {
        toast.error('Error uploading file.');
      }
      onError?.(err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    fileUrl,
    isUploading,
    error
  };
};