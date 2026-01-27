'use client';

import { AnimatePresence } from 'framer-motion';
import { Todo } from '@/types';
import TodoItem from './TodoItem';
import { ClipboardList } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center w-full">
        <ClipboardList className="w-16 h-16 text-[#475569] mb-4" />
        <h3 className="text-lg font-medium text-[#94A3B8] mb-2">
          할 일이 없습니다
        </h3>
        <p className="text-sm text-[#475569]">
          새로운 할 일을 추가해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
