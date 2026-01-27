import { useState, useCallback, useMemo } from 'react';
import { Task, TaskFormData, Status, Priority } from '@/types/task';

const generateId = () => Math.random().toString(36).substring(2, 15);

const initialTasks: Task[] = [
  {
    id: generateId(),
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new product landing page with modern UI/UX patterns.',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: generateId(),
    title: 'Implement user authentication',
    description: 'Set up JWT-based authentication with secure password hashing and protected routes.',
    priority: 'high',
    status: 'todo',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: generateId(),
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with request/response examples.',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: generateId(),
    title: 'Fix mobile responsive issues',
    description: 'Address layout issues on mobile devices and ensure proper touch interactions.',
    priority: 'medium',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: generateId(),
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    priority: 'low',
    status: 'completed',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: generateId(),
    title: 'Database optimization',
    description: 'Add indexes and optimize queries for better performance.',
    priority: 'low',
    status: 'todo',
    dueDate: null,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

export interface TaskFilters {
  search: string;
  status: Status | 'all';
  priority: Priority | 'all';
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: 'all',
    priority: 'all',
  });

  const addTask = useCallback((data: TaskFormData) => {
    const newTask: Task = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, data: Partial<TaskFormData>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...data } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const updateTaskStatus = useCallback((id: string, status: Status) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status } : task
      )
    );
  }, []);

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

  const tasksByStatus = useMemo(() => {
    return {
      todo: filteredTasks.filter(t => t.status === 'todo'),
      'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
      completed: filteredTasks.filter(t => t.status === 'completed'),
    };
  }, [filteredTasks]);

  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  return {
    tasks: filteredTasks,
    tasksByStatus,
    stats,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
};
