import React from 'react';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import Task from './Task';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ColumnProps {
  column: any;
  tasks: any[];
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onAddTask: () => void;
  onViewTask: (task: any) => void;
  onEditTask: (task: any) => void;
  onDeleteTask: (task: any) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onViewTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    minWidth: 250,
    marginRight: 16,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex flex-col gap-4">
      {/* Column header */}
      <div className="w-[250px] bg-gray-100 border border-gray-300 p-2 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">{column.title}</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onPointerDown={e => e.stopPropagation()} onClick={onEditColumn}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onPointerDown={e => e.stopPropagation()} onClick={onDeleteColumn}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Task list */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4">
          {tasks.map(task => (
            <Task
              key={task.id}
              task={task}
              onView={() => onViewTask(task)}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task)}
            />
          ))}
        </div>
      </SortableContext>

      {/* Add task button */}
      <div className="w-[250px]">
        <Button
          variant="outline"
          className="w-full text-sm rounded-none"
          onPointerDown={e => e.stopPropagation()}
          onClick={onAddTask}
        >
          + Add task
        </Button>
      </div>
    </div>
  );
};

export default Column; 