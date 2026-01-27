'use client';

import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { Priority, TodoRequest } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GlassCard from '@/components/ui/GlassCard';
import TiptapEditor from '@/components/editor/TiptapEditor';

interface TodoFormProps {
  onSubmit: (data: TodoRequest) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function TodoForm({ onSubmit, onClose, isLoading }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Filter empty HTML content
    const cleanDescription = description && description !== '<p></p>' ? description : undefined;

    onSubmit({
      title: title.trim(),
      description: cleanDescription,
      priority,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassCard className="w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#F1F5F9]">새 할 일</h2>
          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              제목 *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="할 일을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              설명
            </label>
            <TiptapEditor
              content={description}
              onChange={setDescription}
              placeholder="상세 설명 (선택)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              우선순위
            </label>
            <div className="flex gap-2">
              {(['HIGH', 'MEDIUM', 'LOW'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    priority === p
                      ? p === 'HIGH'
                        ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                        : p === 'MEDIUM'
                        ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]'
                        : 'bg-[#3B82F6]/20 border-[#3B82F6] text-[#3B82F6]'
                      : 'border-white/10 text-[#94A3B8] hover:bg-white/5'
                  }`}
                >
                  {p === 'HIGH' ? '높음' : p === 'MEDIUM' ? '보통' : '낮음'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              마감일
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              취소
            </Button>
            <Button type="submit" loading={isLoading} className="flex-1">
              추가
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
