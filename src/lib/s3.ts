import api from './api';
import { Attachment, PresignedUrlRequest, PresignedUrlResponse, UploadCompleteRequest } from '@/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'text/plain'];

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '파일 크기가 10MB를 초과했습니다' };
  }

  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: '허용되지 않는 파일 형식입니다' };
  }

  return { valid: true };
}

export function isImageFile(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

export async function getPresignedUrl(
  todoId: number,
  file: File
): Promise<PresignedUrlResponse> {
  const request: PresignedUrlRequest = {
    fileName: file.name,
    contentType: file.type,
    fileSize: file.size,
    todoId,
  };

  const response = await api.post<PresignedUrlResponse>('/api/v1/files/presigned-url', request);
  return response.data;
}

export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
}

export async function completeUpload(
  todoId: number,
  file: File,
  presignedResponse: PresignedUrlResponse
): Promise<Attachment> {
  const fileName = presignedResponse.fileKey.split('/').pop() || file.name;

  const request: UploadCompleteRequest = {
    todoId,
    fileName,
    originalName: file.name,
    filePath: presignedResponse.fileKey,
    fileSize: file.size,
    contentType: file.type,
  };

  const response = await api.post<Attachment>('/api/v1/files/complete', request);
  return response.data;
}

export async function uploadFileToS3(
  file: File,
  todoId: number,
  onProgress?: (progress: number) => void
): Promise<Attachment> {
  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  onProgress?.(10);

  // Get presigned URL
  const presignedResponse = await getPresignedUrl(todoId, file);
  onProgress?.(30);

  // Upload to S3
  await uploadToS3(presignedResponse.presignedUrl, file);
  onProgress?.(80);

  // Complete upload (save to DB)
  const attachment = await completeUpload(todoId, file, presignedResponse);
  onProgress?.(100);

  return attachment;
}

export async function deleteFile(id: number): Promise<void> {
  await api.delete(`/api/v1/files/${id}`);
}

export async function getAttachmentsByTodo(todoId: number): Promise<Attachment[]> {
  const response = await api.get<Attachment[]>(`/api/v1/files/todo/${todoId}`);
  return response.data;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
