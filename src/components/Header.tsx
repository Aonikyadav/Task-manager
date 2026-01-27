import { motion } from 'framer-motion';
import { Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onNewTask: () => void;
}

export const Header = ({ onNewTask }: HeaderProps) => {
  const { signOut, user } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background shadow-lg overflow-hidden">
              <img src="/favicon_io/android-chrome-192x192.png" alt="Smart Task Manager" className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">TaskFlow</h1>
              <p className="hidden sm:block text-sm text-muted-foreground">
                {user?.email || 'Smart Task Manager'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={onNewTask} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
