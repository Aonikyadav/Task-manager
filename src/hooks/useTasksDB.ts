import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Task, TaskFormData, Status, Priority } from '@/types/task';
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5002";

export type SortField = 'created_at' | 'due_date' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface TaskFilters {
  search: string;
  status: Status | 'all';
  priority: Priority | 'all';
}

const priorityOrder = { high: 0, medium: 1, low: 2 };

export const useTasksDB = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: 'all',
    priority: 'all',
  });
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tasks?userId=${encodeURIComponent(user.id)}`);
      const data = await res.json();
      interface TaskResponse {
        _id?: string;
        id?: string;
        title: string;
        description: string;
        priority: Priority;
        status: Status;
        dueDate?: string | null;
        createdAt?: string;
        userId: string;
      }
      const raw = (data || []) as TaskResponse[];
      const mapped: Task[] = raw.map((t) => ({
        id: t._id || t.id || "",
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
        userId: t.userId,
      }));
      setTasks(mapped);
    } catch (e) {
      setTasks([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (data: TaskFormData) => {
    if (!user) return null;

    try {
      const res = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          dueDate: data.dueDate?.toISOString() ?? null,
        })
      });
      if (res.ok) {
        const newTask = await res.json();
        const mapped: Task = {
          id: newTask._id || newTask.id,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority as Priority,
          status: newTask.status as Status,
          dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
          createdAt: newTask.createdAt ? new Date(newTask.createdAt) : new Date(),
          userId: newTask.userId,
        };
        setTasks(prev => [mapped, ...prev]);
        return mapped;
      }
    } catch (e) {
      return null;
    }
    return null;
  }, [user]);

  const updateTask = useCallback(async (id: string, data: Partial<TaskFormData>) => {
    const updates: Record<string, unknown> = {};
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.priority !== undefined) updates.priority = data.priority;
    if (data.status !== undefined) updates.status = data.status;
    if (data.dueDate !== undefined) updates.dueDate = data.dueDate?.toISOString() ?? null;

    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setTasks(prev =>
          prev.map(task =>
            task.id === id ? { ...task, ...data } : task
          )
        );
      }
    } catch (e) {
      return;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTasks(prev => prev.filter(task => task.id !== id));
      }
    } catch (e) {
      return;
    }
  }, []);

  const updateTaskStatus = useCallback(async (id: string, status: Status) => {
    await updateTask(id, { status });
  }, [updateTask]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        filters.search === '' ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === 'all' || task.status === filters.status;

      const matchesPriority =
        filters.priority === 'all' || task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, filters]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'due_date':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = a.dueDate.getTime() - b.dueDate.getTime();
          break;
        case 'created_at':
        default:
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredTasks, sortField, sortOrder]);

  const tasksByStatus = useMemo(() => {
    return {
      todo: sortedTasks.filter(t => t.status === 'todo'),
      'in-progress': sortedTasks.filter(t => t.status === 'in-progress'),
      completed: sortedTasks.filter(t => t.status === 'completed'),
    };
  }, [sortedTasks]);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTasks, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedTasks.length / itemsPerPage);
  }, [sortedTasks.length, itemsPerPage]);

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  const overdueTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter(
      t => t.dueDate && t.dueDate < now && t.status !== 'completed'
    );
  }, [tasks]);

  return {
    tasks: sortedTasks,
    paginatedTasks,
    tasksByStatus,
    stats,
    overdueTasks,
    loading,
    filters,
    setFilters,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    refetch: fetchTasks,
  };
};
