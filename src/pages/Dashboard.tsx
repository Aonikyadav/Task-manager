import { useState } from 'react';
import { motion } from 'framer-motion';
import { ListTodo, Clock, CheckCircle2, LayoutGrid, Loader2 } from 'lucide-react';
import { Task, TaskFormData, Status } from '@/types/task';
import { useTasksDB } from '@/hooks/useTasksDB';
import { useTaskReminders } from '@/hooks/useTaskReminders';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskSorting } from '@/components/TaskSorting';
import { TaskDialog } from '@/components/TaskDialog';
import { KanbanBoard } from '@/components/KanbanBoard';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const {
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
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  } = useTasksDB();

  // Enable task reminders
  useTaskReminders(Object.values(tasksByStatus).flat(), overdueTasks);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleNewTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleSaveTask = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        toast({
          title: 'Task updated',
          description: 'Your task has been updated successfully.',
        });
      } else {
        await addTask(data);
        toast({
          title: 'Task created',
          description: 'Your new task has been created.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      toast({
        title: 'Task deleted',
        description: 'The task has been removed.',
        variant: 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      await updateTaskStatus(id, status);
      toast({
        title: 'Status updated',
        description: `Task moved to ${status.replace('-', ' ')}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update task status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onNewTask={handleNewTask} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatsCard
              title="Total Tasks"
              value={stats.total}
              icon={LayoutGrid}
              variant="default"
              delay={0}
            />
            <StatsCard
              title="To Do"
              value={stats.todo}
              icon={ListTodo}
              variant="primary"
              delay={0.1}
            />
            <StatsCard
              title="In Progress"
              value={stats.inProgress}
              icon={Clock}
              variant="warning"
              delay={0.2}
            />
            <StatsCard
              title="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              variant="success"
              delay={0.3}
            />
          </div>
        </motion.section>

        {/* Filters and Sorting Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TaskFilters filters={filters} onFiltersChange={setFilters} />
            <TaskSorting
              sortField={sortField}
              sortOrder={sortOrder}
              onSortChange={(field, order) => {
                setSortField(field);
                setSortOrder(order);
              }}
            />
          </div>
        </motion.section>

        {/* Kanban Board with Drag and Drop */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <KanbanBoard
            tasksByStatus={tasksByStatus}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        </motion.section>
      </main>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Dashboard;
