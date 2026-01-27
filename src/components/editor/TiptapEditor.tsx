'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Toolbar from './Toolbar';
import { useEffect, useCallback } from 'react';
import { uploadFileToS3, isImageFile, validateFile } from '@/lib/s3';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  todoId?: number | null;
}

export default function TiptapEditor({ content, onChange, placeholder, todoId }: TiptapEditorProps) {
  const handleImageUpload = useCallback(
    async (file: File): Promise<string | null> => {
      if (!todoId) {
        alert('이미지 업로드는 저장 후 가능합니다');
        return null;
      }

      const validation = validateFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return null;
      }

      if (!isImageFile(file)) {
        alert('이미지 파일만 에디터에 삽입할 수 있습니다');
        return null;
      }

      try {
        const attachment = await uploadFileToS3(file, todoId);
        return attachment.fileUrl;
      } catch (error) {
        alert(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다');
        return null;
      }
    },
    [todoId]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#3B82F6] underline hover:text-[#60A5FA]',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-2',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || '내용을 입력하세요...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none focus:outline-none min-h-[120px] px-4 py-3',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          const files = Array.from(event.dataTransfer.files);
          const imageFiles = files.filter((file) => isImageFile(file));

          if (imageFiles.length > 0) {
            event.preventDefault();

            imageFiles.forEach(async (file) => {
              const url = await handleImageUpload(file);
              if (url && editor) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            });

            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              handleImageUpload(file).then((url) => {
                if (url && editor) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              });
            }
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const insertImage = useCallback(
    async (file: File) => {
      const url = await handleImageUpload(file);
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
    [editor, handleImageUpload]
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#3B82F6] focus-within:border-transparent">
      <Toolbar editor={editor} onImageUpload={insertImage} canUploadImage={!!todoId} />
      <EditorContent editor={editor} />
      <style jsx global>{`
        .ProseMirror {
          min-height: 120px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #475569;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.5rem 0;
          color: #F1F5F9;
        }
        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.5rem 0;
          color: #F1F5F9;
        }
        .ProseMirror p {
          margin: 0.25rem 0;
          color: #F1F5F9;
        }
        .ProseMirror ul {
          padding-left: 1.5rem;
          margin: 0.25rem 0;
          list-style-type: disc;
        }
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.25rem 0;
          list-style-type: decimal;
        }
        .ProseMirror li {
          color: #F1F5F9;
        }
        .ProseMirror li::marker {
          color: #94A3B8;
        }
        .ProseMirror strong {
          font-weight: 700;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid #3B82F6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
