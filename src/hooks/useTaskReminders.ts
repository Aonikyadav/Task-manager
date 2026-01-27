import { useEffect, useRef } from 'react';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { isPast, isToday, isTomorrow, differenceInHours } from 'date-fns';

export const useTaskReminders = (tasks: Task[], overdueTasks: Task[]) => {
  const { toast } = useToast();
  const shownReminders = useRef<Set<string>>(new Set());
  const initialCheckDone = useRef(false);

  useEffect(() => {
    // Show overdue alerts on initial load (once)
    if (!initialCheckDone.current && overdueTasks.length > 0) {
      initialCheckDone.current = true;
      
      overdueTasks.forEach(task => {
        if (!shownReminders.current.has(`overdue-${task.id}`)) {
          shownReminders.current.add(`overdue-${task.id}`);
          toast({
            title: '⚠️ Overdue Task',
            description: `"${task.title}" is past its due date!`,
            variant: 'destructive',
          });
        }
      });
    }
  }, [overdueTasks, toast]);

  useEffect(() => {
    // Check for tasks due soon
    const checkDueSoon = () => {
      tasks.forEach(task => {
        if (!task.dueDate || task.status === 'completed') return;

        const hoursUntilDue = differenceInHours(task.dueDate, new Date());
        const reminderKey = `soon-${task.id}-${Math.floor(hoursUntilDue / 6)}`;

        if (hoursUntilDue > 0 && hoursUntilDue <= 24 && !shownReminders.current.has(reminderKey)) {
          shownReminders.current.add(reminderKey);
          
          let timeMessage = '';
          if (isToday(task.dueDate)) {
            timeMessage = 'due today';
          } else if (isTomorrow(task.dueDate)) {
            timeMessage = 'due tomorrow';
          } else {
            timeMessage = `due in ${Math.round(hoursUntilDue)} hours`;
          }

          toast({
            title: '⏰ Task Reminder',
            description: `"${task.title}" is ${timeMessage}`,
          });
        }
      });
    };

    // Check immediately and then every 30 minutes
    const timeoutId = setTimeout(checkDueSoon, 2000); // Delay initial check
    const intervalId = setInterval(checkDueSoon, 30 * 60 * 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [tasks, toast]);

  // Clear reminders for completed tasks
  useEffect(() => {
    tasks.forEach(task => {
      if (task.status === 'completed') {
        shownReminders.current.delete(`overdue-${task.id}`);
      }
    });
  }, [tasks]);
};
