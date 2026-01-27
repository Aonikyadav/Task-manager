import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortField, SortOrder } from '@/hooks/useTasksDB';

interface TaskSortingProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

const sortOptions: { field: SortField; label: string }[] = [
  { field: 'created_at', label: 'Date Created' },
  { field: 'due_date', label: 'Due Date' },
  { field: 'priority', label: 'Priority' },
  { field: 'title', label: 'Title' },
];

export const TaskSorting = ({ sortField, sortOrder, onSortChange }: TaskSortingProps) => {
  const currentLabel = sortOptions.find(o => o.field === sortField)?.label || 'Sort';

  const toggleOrder = () => {
    onSortChange(sortField, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            {currentLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map(option => (
            <DropdownMenuItem
              key={option.field}
              onClick={() => onSortChange(option.field, sortOrder)}
              className={sortField === option.field ? 'bg-accent' : ''}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={toggleOrder}
      >
        {sortOrder === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
