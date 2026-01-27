'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Toolbar from './Toolbar';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
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

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#3B82F6] focus-within:border-transparent">
      <Toolbar editor={editor} />
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
      `}</style>
    </div>
  );
}
