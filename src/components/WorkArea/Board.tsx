import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';

interface BoardProps {
  columns: any[];
  tasks: any[];
  onEditColumn: (col: any) => void;
  onDeleteColumn: (col: any) => void;
  onAddTask: (col: any) => void;
  onViewTask: (task: any) => void;
  onEditTask: (task: any) => void;
  onDeleteTask: (task: any) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onAddColumn: () => void;
}

const Board: React.FC<BoardProps> = ({
  columns,
  tasks,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onDragEnd,
  onAddColumn,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={columns.map(col => col.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex items-start gap-4 overflow-x-auto">
          {columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => Number(task.columns_id) === Number(col.id))}
              onEditColumn={() => onEditColumn(col)}
              onDeleteColumn={() => onDeleteColumn(col)}
              onAddTask={() => onAddTask(col)}
              onViewTask={onViewTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
          <div
            className="w-[250px] h-[60px] flex items-center justify-center bg-white border border-dashed border-gray-300 cursor-pointer"
            onClick={onAddColumn}
          >
            <span className="text-gray-700 font-medium">+ Add column</span>
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default Board; 