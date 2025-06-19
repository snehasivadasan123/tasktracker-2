import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { EyeIcon, Pencil, Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskProps {
  task: any;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const Task: React.FC<TaskProps> = ({ task, onView, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="bg-gray-100 border border-gray-300 p-4 hover:bg-white transition-colors">
        <div className="text-sm font-medium text-gray-800 mb-6">
          {task.title}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-gray-200 hover:bg-gray-300 w-6 h-6 transition-colors p-0"
              onPointerDown={e => e.stopPropagation()}
              onClick={onView}
            >
              <EyeIcon className="w-3 h-3 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-gray-200 hover:bg-gray-300 w-6 h-6 transition-colors p-0"
              onPointerDown={e => e.stopPropagation()}
              onClick={onEdit}
            >
              <Pencil className="w-3 h-3 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-gray-200 hover:bg-gray-300 w-6 h-6 transition-colors p-0"
              onPointerDown={e => e.stopPropagation()}
              onClick={onDelete}
            >
              <Trash2 className="w-3 h-3 text-gray-600" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-gray-200 hover:bg-gray-300 w-6 h-6 transition-colors p-0"
            >
              <GripVertical className="w-3 h-3 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-gray-200 hover:bg-gray-300 w-6 h-6 transition-colors cursor-grab active:cursor-grabbing p-0"
              {...listeners}
            >
              <GripVertical className="w-3 h-3 text-gray-600" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-right font-medium">
          {formatDate(task.created_at)}
        </div>
      </div>
    </div>
  );
};

export default Task;