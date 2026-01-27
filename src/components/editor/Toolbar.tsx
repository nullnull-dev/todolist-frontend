'use client';

import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link,
  Unlink,
} from 'lucide-react';
import { useCallback, useState } from 'react';

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }

    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  if (!editor) return null;

  const buttonClass = (isActive: boolean) =>
    `p-1.5 rounded transition-colors ${
      isActive
        ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
        : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5'
    }`;

  return (
    <div className="flex items-center gap-1 p-2 border-b border-white/10 flex-wrap">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
        title="굵게 (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
        title="기울임 (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 1 }))}
        title="제목 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 2 }))}
        title="제목 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
        title="글머리 기호 목록"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
        title="번호 매기기 목록"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      {showLinkInput ? (
        <div className="flex items-center gap-1">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="URL 입력"
            className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-[#F1F5F9] placeholder-[#475569] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setLink();
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false);
                setLinkUrl('');
              }
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={setLink}
            className="px-2 py-1 text-xs bg-[#3B82F6] text-white rounded hover:bg-[#2563EB]"
          >
            확인
          </button>
          <button
            type="button"
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
            }}
            className="px-2 py-1 text-xs text-[#94A3B8] hover:text-[#F1F5F9]"
          >
            취소
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setShowLinkInput(true)}
            className={buttonClass(editor.isActive('link'))}
            title="링크 추가"
          >
            <Link className="w-4 h-4" />
          </button>

          {editor.isActive('link') && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className={buttonClass(false)}
              title="링크 제거"
            >
              <Unlink className="w-4 h-4" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
