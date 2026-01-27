// Auth Types
export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface SignupRequest {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Todo Types
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface TodoRequest {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
}

// Pagination
export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PageResponse<T> {
  content: T[];
  page: PageInfo;
}

// Error
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
  timestamp: string;
}

// Filters
export interface TodoFilters {
  page?: number;
  size?: number;
  completed?: boolean;
  priority?: Priority;
  sort?: string;
}

// Attachment
export interface Attachment {
  id: number;
  todoId: number;
  fileName: string;
  originalName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  createdAt: string;
}

export interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
  todoId: number;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  fileKey: string;
  fileUrl: string;
}

export interface UploadCompleteRequest {
  todoId: number;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
}
