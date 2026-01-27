'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import { useTodos } from '@/hooks/useTodos';
import { useQueryClient } from '@tanstack/react-query';
import { TodoFilters } from '@/types';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import TodoList from '@/components/todo/TodoList';
import TodoForm from '@/components/todo/TodoForm';
import TodoFilter from '@/components/todo/TodoFilter';

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filters: TodoFilters = {
    size: 20,
    completed: filter === 'all' ? undefined : filter === 'completed',
    sort: 'createdAt,desc',
  };

  const { todos, isLoading, toggleTodo, deleteTodo } = useTodos(filters);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);

  const handleTodoCreated = () => {
    // TodoForm에서 이미 생성/업데이트됨, 리스트만 갱신
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#F1F5F9]">내 할 일</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            추가
          </Button>
        </div>

        <div className="mb-6">
          <TodoFilter filter={filter} onFilterChange={setFilter} />
        </div>

        {isLoading ? (
          <div className="py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        )}
      </main>

      {showForm && (
        <TodoForm
          onSubmit={handleTodoCreated}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
