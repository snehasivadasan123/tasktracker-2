import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
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
    <main className="p-6">
      <div className="max-w-none">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={columns.map(col => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-6 overflow-x-auto pb-4">
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

              {/* Add Column Button */}
              <div className="flex-shrink-0 w-60">
                <div
                  className="border border-gray-300 border-dashed p-4 bg-white hover:bg-gray-50 transition-colors h-16 flex items-center justify-center cursor-pointer"
                  onClick={onAddColumn}
                >
                  <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add column
                  </button>
                </div>
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
};

export default Board;