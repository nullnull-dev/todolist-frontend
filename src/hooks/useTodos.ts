'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { PageResponse, Todo, TodoFilters, TodoRequest } from '@/types';

export const useTodos = (filters: TodoFilters = {}) => {
  const queryClient = useQueryClient();

  const buildParams = () => {
    const params = new URLSearchParams();
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    if (filters.completed !== undefined) params.append('completed', filters.completed.toString());
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.sort) params.append('sort', filters.sort);
    return params.toString();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['todos', filters],
    queryFn: async () => {
      const params = buildParams();
      const url = params ? `/api/v1/todos?${params}` : '/api/v1/todos';
      const response = await api.get<PageResponse<Todo>>(url);
      return response.data;
    },
    staleTime: 30 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: TodoRequest) => {
      const response = await api.post<Todo>('/api/v1/todos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TodoRequest }) => {
      const response = await api.put<Todo>(`/api/v1/todos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.patch<Todo>(`/api/v1/todos/${id}/complete`);
      return response.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previous = queryClient.getQueryData<PageResponse<Todo>>(['todos', filters]);

      if (previous) {
        queryClient.setQueryData<PageResponse<Todo>>(['todos', filters], {
          ...previous,
          content: previous.content.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        });
      }
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todos', filters], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/todos/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previous = queryClient.getQueryData<PageResponse<Todo>>(['todos', filters]);

      if (previous) {
        queryClient.setQueryData<PageResponse<Todo>>(['todos', filters], {
          ...previous,
          content: previous.content.filter((todo) => todo.id !== id),
        });
      }
      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todos', filters], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    todos: data?.content ?? [],
    pageInfo: data?.page,
    isLoading,
    error,
    createTodo: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateTodo: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    toggleTodo: toggleMutation.mutate,
    deleteTodo: deleteMutation.mutate,
  };
};
