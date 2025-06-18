import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { EyeIcon, Pencil, Trash2, MoveIcon } from 'lucide-react';
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
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="bg-gray-200 hover:bg-white p-2 shadow mt-10 rounded-none">
        <div className="text-sm font-medium mb-2">{task.title}</div>
        <div className="flex justify-between">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onPointerDown={e => e.stopPropagation()} onClick={onView}>
              <EyeIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onPointerDown={e => e.stopPropagation()} onClick={onEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onPointerDown={e => e.stopPropagation()} onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon">
            <MoveIcon className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">{new Date(task.created_at).toDateString()}</p>
      </Card>
    </div>
  );
};

export default Task; 