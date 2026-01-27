'use client';

import { useCallback, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { validateFile } from '@/lib/s3';

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  error?: string;
}

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  uploads: UploadItem[];
  onRemoveUpload: (id: string) => void;
  disabled?: boolean;
  accept?: string;
}

export default function FileUpload({
  onFileSelect,
  uploads,
  onRemoveUpload,
  disabled,
  accept = 'image/*,.pdf,.doc,.docx,.txt',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        const validation = validateFile(file);
        if (validation.valid) {
          onFileSelect(file);
        } else {
          alert(validation.error);
        }
      });

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;

      const files = e.dataTransfer.files;
      Array.from(files).forEach((file) => {
        const validation = validateFile(file);
        if (validation.valid) {
          onFileSelect(file);
        } else {
          alert(validation.error);
        }
      });
    },
    [onFileSelect, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center transition-colors
          ${disabled
            ? 'border-white/5 bg-white/[0.02] cursor-not-allowed'
            : 'border-white/10 hover:border-[#3B82F6]/50 hover:bg-white/[0.02] cursor-pointer'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          accept={accept}
          multiple
          className="hidden"
          disabled={disabled}
        />
        <Upload className={`w-6 h-6 mx-auto mb-2 ${disabled ? 'text-[#475569]' : 'text-[#94A3B8]'}`} />
        <p className={`text-sm ${disabled ? 'text-[#475569]' : 'text-[#94A3B8]'}`}>
          {disabled ? '파일 업로드는 저장 후 가능합니다' : '파일을 드래그하거나 클릭하여 업로드'}
        </p>
        <p className="text-xs text-[#475569] mt-1">최대 10MB, 이미지/PDF/문서</p>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map(({ id, file, progress, error }) => (
            <div
              key={id}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                error ? 'bg-red-500/10' : 'bg-white/5'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#F1F5F9] truncate">{file.name}</p>
                {error ? (
                  <div className="flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </div>
                ) : (
                  <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3B82F6] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
              {error && (
                <button
                  onClick={() => onRemoveUpload(id)}
                  className="p-1 text-[#94A3B8] hover:text-[#F1F5F9]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
