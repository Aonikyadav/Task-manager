import { motion } from 'framer-motion';
import { Task, Status } from '@/types/task';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}

const statusColors = {
  'todo': 'bg-status-todo',
  'in-progress': 'bg-status-in-progress',
  'completed': 'bg-status-completed',
};

export const TaskColumn = ({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskColumnProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${statusColors[status]}`} />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex flex-1 flex-col gap-3 rounded-xl bg-secondary/50 p-3 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">No tasks</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};
