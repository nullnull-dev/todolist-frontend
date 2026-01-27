'use client';

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Attachment } from '@/types';
import {
  uploadFileToS3,
  deleteFile,
  getAttachmentsByTodo,
  validateFile,
  isImageFile,
} from '@/lib/s3';

interface UploadState {
  file: File;
  progress: number;
  error?: string;
}

export function useFileUpload(todoId: number | null) {
  const queryClient = useQueryClient();
  const [uploads, setUploads] = useState<Map<string, UploadState>>(new Map());

  const { data: attachments = [], isLoading: isLoadingAttachments } = useQuery({
    queryKey: ['attachments', todoId],
    queryFn: () => getAttachmentsByTodo(todoId!),
    enabled: !!todoId,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, todoId }: { file: File; todoId: number }) => {
      const uploadId = `${file.name}-${Date.now()}`;

      setUploads((prev) => new Map(prev).set(uploadId, { file, progress: 0 }));

      try {
        const attachment = await uploadFileToS3(file, todoId, (progress) => {
          setUploads((prev) => {
            const newUploads = new Map(prev);
            const current = newUploads.get(uploadId);
            if (current) {
              newUploads.set(uploadId, { ...current, progress });
            }
            return newUploads;
          });
        });

        setUploads((prev) => {
          const newUploads = new Map(prev);
          newUploads.delete(uploadId);
          return newUploads;
        });

        return attachment;
      } catch (error) {
        setUploads((prev) => {
          const newUploads = new Map(prev);
          const current = newUploads.get(uploadId);
          if (current) {
            newUploads.set(uploadId, {
              ...current,
              error: error instanceof Error ? error.message : '업로드 실패',
            });
          }
          return newUploads;
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', todoId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['attachments', todoId] });
      const previous = queryClient.getQueryData<Attachment[]>(['attachments', todoId]);

      if (previous) {
        queryClient.setQueryData<Attachment[]>(
          ['attachments', todoId],
          previous.filter((a) => a.id !== id)
        );
      }

      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['attachments', todoId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', todoId] });
    },
  });

  const uploadFile = useCallback(
    async (file: File): Promise<Attachment | null> => {
      if (!todoId) {
        console.error('todoId is required for file upload');
        return null;
      }

      const validation = validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      return uploadMutation.mutateAsync({ file, todoId });
    },
    [todoId, uploadMutation]
  );

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      if (!isImageFile(file)) {
        throw new Error('이미지 파일만 업로드할 수 있습니다');
      }

      const attachment = await uploadFile(file);
      return attachment?.fileUrl || null;
    },
    [uploadFile]
  );

  const removeUpload = useCallback((uploadId: string) => {
    setUploads((prev) => {
      const newUploads = new Map(prev);
      newUploads.delete(uploadId);
      return newUploads;
    });
  }, []);

  return {
    attachments,
    isLoadingAttachments,
    uploads: Array.from(uploads.entries()).map(([id, state]) => ({ id, ...state })),
    uploadFile,
    uploadImage,
    deleteFile: deleteMutation.mutate,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    removeUpload,
  };
}
