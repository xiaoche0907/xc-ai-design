'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (file: File, preview: string) => void;
  preview?: string | null;
  onClear?: () => void;
  className?: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export function ImageUploader({
  onUpload,
  preview,
  onClear,
  className,
  accept = { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
  maxSize = 10 * 1024 * 1024, // 10MB
}: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError('文件过大，最大支持 10MB');
        } else {
          setError('不支持的文件格式');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const previewUrl = URL.createObjectURL(file);
        onUpload(file, previewUrl);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  if (preview) {
    return (
      <div className={cn('relative rounded-xl overflow-hidden', className)}>
        <img
          src={preview}
          alt="Preview"
          className="w-full h-64 object-cover"
        />
        {onClear && (
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
              isDragActive
                ? 'bg-blue-100 dark:bg-blue-900/50'
                : 'bg-slate-100 dark:bg-slate-800'
            )}
          >
            {isDragActive ? (
              <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            ) : (
              <Upload className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div>
            <p className="text-lg font-medium mb-1">
              {isDragActive ? '释放以上传' : '拖拽图片到这里'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              或点击选择文件 (JPG, PNG, WEBP)
            </p>
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
