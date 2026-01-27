'use client';

import { motion } from 'framer-motion';
import { Check, Trash2, Calendar } from 'lucide-react';
import { Todo } from '@/types';
import Badge from '@/components/ui/Badge';
import GlassCard from '@/components/ui/GlassCard';
import HtmlContent from '@/components/editor/HtmlContent';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard className="p-4 hover:bg-white/[0.05] transition-colors">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(todo.id)}
            className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors ${
              todo.completed
                ? 'bg-[#22C55E] border-[#22C55E]'
                : 'border-[#475569] hover:border-[#3B82F6]'
            }`}
          >
            {todo.completed && <Check className="w-3 h-3 text-white" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`text-[#F1F5F9] font-medium truncate ${
                  todo.completed ? 'line-through opacity-50' : ''
                }`}
              >
                {todo.title}
              </h3>
              <Badge priority={todo.priority} />
            </div>

            {todo.description && (
              <div className="text-sm mb-2 line-clamp-3">
                <HtmlContent content={todo.description} />
              </div>
            )}

            {todo.dueDate && (
              <div className="flex items-center gap-1 text-xs text-[#475569]">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(todo.dueDate)}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onDelete(todo.id)}
            className="flex-shrink-0 p-2 text-[#475569] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
