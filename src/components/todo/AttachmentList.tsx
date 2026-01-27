'use client';

import { FileText, Image, Trash2, Download, ExternalLink } from 'lucide-react';
import { Attachment } from '@/types';
import { formatFileSize } from '@/lib/s3';

interface AttachmentListProps {
  attachments: Attachment[];
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export default function AttachmentList({ attachments, onDelete, isDeleting }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  const isImage = (contentType: string) => contentType.startsWith('image/');

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[#94A3B8]">첨부파일 ({attachments.length})</p>
      <div className="grid gap-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg group"
          >
            {/* Icon/Preview */}
            {isImage(attachment.contentType) ? (
              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-white/10">
                <img
                  src={attachment.fileUrl}
                  alt={attachment.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-[#94A3B8]" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#F1F5F9] truncate">{attachment.originalName}</p>
              <p className="text-xs text-[#475569]">{formatFileSize(attachment.fileSize)}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/10 rounded transition-colors"
                title="새 탭에서 열기"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={attachment.fileUrl}
                download={attachment.originalName}
                className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/10 rounded transition-colors"
                title="다운로드"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={() => onDelete(attachment.id)}
                disabled={isDeleting}
                className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
