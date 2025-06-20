"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
//import { workspaceData } from "@/data/workspaceData";
import { Card, CardContent, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowLeft, EyeIcon, MoveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddColumnDialog } from "@/components/AddColumnDialog";
import { AddTaskDialog } from "@/components/AddTaskDialog"
import { notFound } from "next/navigation";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableColumn({ id, children }: { id: string | number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    minWidth: 250,
    marginRight: 16,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

function SortableTask({ id, children }: { id: string | number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 12,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

const WorkAreapage = () => {
  const params = useParams();
  const worksid = Number(params.workId);
  const [workspace, setWorkspace] = useState<{ id: number; title: string } | null>(null);
  const [columns, setColumns] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)
  console.log("the task iss???????", tasks)
  console.log("the columns iss???????", columns)
  const sensors = useSensors(useSensor(PointerSensor));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const wsRes = await fetch(`http://localhost:3001/workspaces/${worksid}`)
        console.log("the********************", wsRes)
        if (!wsRes.ok) {
          console.log(`Workspace with ID ${worksid} not found.`);
          notFound()
          return;
        }


        const workspaceData = await wsRes.json();

        const [colRes, taskRes] = await Promise.all([
          fetch(`http://localhost:3001/columns?workspaces_id=${worksid}`),
          fetch(`http://localhost:3001/tasks?workspaces_id=${worksid}`),
        ]);
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<", taskRes)
        const columns = colRes.ok ? await colRes.json() : [];
        const tasks = taskRes.ok ? await taskRes.json() : [];

        setWorkspace(workspaceData);
        setColumns(columns);
        setTasks(tasks);
      } catch (error) {
        console.error("Failed to fetch workspace data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [worksid]);

  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskColumnId, setTaskColumnId] = useState<number | null>(null);
  const [editingColumn, setEditingColumn] = useState<{ id: number; title: string } | null>(null);
  const [viewTask, setViewTask] = useState<{
    title: string;
    description: string;
    attachmentUrl?: string;
    fileName?: string;
  } | null>(null)
  const [editingTask, setEditingTask] = useState<{
    id: number;
    title: string;
    description: string;
    columns_id: number;
    attachmentUrl?: string;
    fileName?: string;
  } | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const createNewColumn = (title: string) => ({
    id: Date.now(),
    order: columns.length + 1,
    workspaces_id: worksid,
    title,
    created_at: Date.now(),
  });
  async function handleAddColumn(title: string): Promise<void> {
    if (editingColumn) {
      console.log("yessss")
      const updatedCols = columns.map((col) =>
        col.id === editingColumn.id ? { ...col, title } : col
      );
      setColumns(updatedCols);

      try {
        console.log("editing coloumn____________")
        await fetch(`http://localhost:3001/columns/${editingColumn.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });
      } catch (err) {
        console.error("Failed to update column:", err);
      }
    } else {
      const allColumnsRes = await fetch("http://localhost:3001/columns");
      const allColumns = allColumnsRes.ok ? await allColumnsRes.json() : [];
      const maxColumnId = allColumns.reduce((max: number, col: { id: string; }) => {
        const numericId = parseInt(col.id);
        return isNaN(numericId) ? max : Math.max(max, numericId);
      }, 0);
      const newCol = {
        id: String(maxColumnId + 1),
        title,
        order: columns.length + 1,
        workspaces_id: worksid,
        created_at: Date.now(),
      };

      try {
        const response = await fetch("http://localhost:3001/columns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCol),
        });

        if (!response.ok) {
          throw new Error("Failed to add column");
        }

        const savedCol = await response.json();
        setColumns([...columns, savedCol]);
      } catch (err) {
        console.error("Error adding column:", err);
      }
    }

    setDialogOpen(false);
    setEditingColumn(null);
  }

  async function handleDeleteColumn(colId: number) {
    try {

      const colRes = await fetch(`http://localhost:3001/columns/${colId}`, {
        method: "DELETE",
      });

      if (!colRes.ok) throw new Error("Failed to delete column");


      const relatedTasks = tasks.filter((task) => Number(task.columns_id) === Number(colId));

      await Promise.all(
        relatedTasks.map((task) =>
          fetch(`http://localhost:3001/tasks/${task.id}`, {
            method: "DELETE",
          })
        )
      );


      setColumns(columns.filter((col) => col.id !== colId));
      setTasks(tasks.filter((task) => task.columns_id !== colId));
    } catch (error) {
      console.error("Error deleting column and tasks:", error);
    }
  }


  async function handleAddTask(title: string, description: string, file: File | null) {
    if (taskColumnId !== null) {
      if (editingTask) {
        const updatedTasks = tasks.map((t) =>
          t.id === editingTask.id
            ? {
              ...t,
              title,
              description,
              attachmentUrl: file ? URL.createObjectURL(file) : t.attachmentUrl,
              fileName: file ? file.name : t.fileName,
            }
            : t
        );
        setTasks(updatedTasks);

        try {
          await fetch(`http://localhost:3001/tasks/${editingTask.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              description,
              attachmentUrl: file ? URL.createObjectURL(file) : editingTask.attachmentUrl,
              fileName: file ? file.name : editingTask.fileName,
            }),
          });
        } catch (err) {
          console.error("Failed to update task:", err);
        }

        setEditingTask(null);
      }




      else {
        const newTask = {
          columns_id: taskColumnId,
          title,
          description,
          attachmentUrl: file ? URL.createObjectURL(file) : "",
          fileName: file?.name || "",
          created_at: Date.now(),
          workspaces_id: worksid,
        };

        try {
          const response = await fetch("http://localhost:3001/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
          });

          if (!response.ok) {
            throw new Error("Failed to add task");
          }

          const savedTask = await response.json();
          setTasks([...tasks, savedTask]);
        } catch (err) {
          console.error("Error adding task:", err);
        }
      }

      setTaskDialogOpen(false);
      setTaskColumnId(null);
    }
  }


  async function handleDeleteTask(taskId: number) {
    try {
      const res = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    // 1. Column drag
    if (columns.some(col => col.id === active.id)) {
      const oldIndex = columns.findIndex(col => col.id === active.id);
      const newIndex = columns.findIndex(col => col.id === over.id);
      if (oldIndex !== newIndex) {
        setColumns(arrayMove(columns, oldIndex, newIndex));
      }
      return;
    }

    // 2. Task drag
    const activeTask = tasks.find(t => t.id === active.id);
    const overTask = tasks.find(t => t.id === over.id);

    if (activeTask && overTask) {
      // a) Same column: reorder
      if (activeTask.columns_id === overTask.columns_id) {
        const columnTasks = tasks.filter(
          t => t.columns_id === activeTask.columns_id
        );
        const oldIndex = columnTasks.findIndex(t => t.id === active.id);
        const newIndex = columnTasks.findIndex(t => t.id === over.id);

        const reordered = arrayMove(columnTasks, oldIndex, newIndex);

        // Replace the tasks in the column with the reordered ones
        let reorderIdx = 0;
        const newTasks = tasks.map(t => {
          if (t.columns_id === activeTask.columns_id) {
            return reordered[reorderIdx++];
          }
          return t;
        });
        setTasks(newTasks);
      } else {
        // b) Different column: move to new column, place after the task it was dropped on
        const newTasks = tasks.map(t =>
          t.id === active.id ? { ...t, columns_id: overTask.columns_id } : t
        );

        // Move the task to the correct position in the new column
        const destColumnTasks = newTasks.filter(
          t => t.columns_id === overTask.columns_id
        );
        const movingTask = newTasks.find(t => t.id === active.id);
        const filtered = destColumnTasks.filter(t => t.id !== active.id);
        const overIndex = filtered.findIndex(t => t.id === over.id);

        filtered.splice(overIndex + 1, 0, movingTask);

        // Rebuild the tasks array with the reordered destination column
        let destIdx = 0;
        const finalTasks = newTasks.map(t => {
          if (t.columns_id === overTask.columns_id) {
            return filtered[destIdx++];
          }
          return t;
        });
        setTasks(finalTasks);
      }
    } else if (activeTask && !overTask) {
      // Dropped on empty column area: move to end of that column
      const columnId = columns.find(col => col.id === over.id)?.id;
      if (columnId) {
        setTasks(tasks.map(t =>
          t.id === active.id ? { ...t, columns_id: columnId } : t
        ));
      }
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!workspace && !loading) {
    return (
      <div className="p-6 text-center text-red-500">
        Workspace not found.
      </div>
    );
  }

  return (
    <div className="p-6 ml-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold ml-2">{workspace?.title}</h1>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columns.map(col => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex items-start gap-4 overflow-x-auto">
            {columns.map((col) => {
              console.log("Current column ID:", col.id, typeof col.id);
              console.log("All task columns_id:", tasks.map(t => [t.id, t.columns_id, typeof t.columns_id]));

              const columnTasks = tasks.filter(
                (task) => Number(task.columns_id) === Number(col.id)
              );
              console.log("the columntask issssssss=============>>>>///", columnTasks)


              return (
                <SortableColumn key={col.id} id={col.id}>
                  <div className="w-[250px] bg-gray-100 shadow-sm p-2">
                    <div className="flex justify-between items-center mb-">
                      <h2 className="font-semibold">{col.title}</h2>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingColumn({ id: col.id, title: col.title });
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteColumn(col.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <SortableContext
                    items={tasks.filter(t => Number(t.columns_id) === Number(col.id)).map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {tasks.filter(t => Number(t.columns_id) === Number(col.id)).map((task) => (
                        <SortableTask key={task.id} id={task.id}>
                          <Card className="bg-gray-200 hover:bg-white p-2 shadow mt-10 rounded-none">
                            <div className="text-sm font-medium mb-2">{task.title}</div>
                            <div className="flex justify-between">
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setViewTask({
                                      title: task.title,
                                      description: task.description,
                                      attachmentUrl: task.attachmentUrl,
                                      fileName: task.fileName,
                                    });
                                    setIsViewOpen(true);
                                  }}
                                >
                                  <EyeIcon className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon"
                                  onClick={() => {
                                    setEditingTask(task);
                                    setTaskColumnId(task.columns_id);
                                    setTaskDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon"
                                  onClick={() => handleDeleteTask(task.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <Button variant="ghost" size="icon">
                                <MoveIcon className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(task.created_at).toDateString()}
                            </p>
                          </Card>
                        </SortableTask>
                      ))}
                    </div>
                  </SortableContext>
                  <Button
                    variant="outline"
                    className="w-full text-sm mt-6 rounded-none"
                    onClick={() => {
                      setTaskColumnId(col.id);
                      setTaskDialogOpen(true);
                    }}
                  >
                    + Add task
                  </Button>
                </SortableColumn>
              );
            })}
            <div
              className="w-[250px] h-[60px] flex items-center justify-center bg-white border border-dashed border-gray-300 cursor-pointer"
              onClick={() => setDialogOpen(true)}
            >
              <span className="text-gray-700 font-medium">+ Add column</span>
            </div>
          </div>
        </SortableContext>
      </DndContext>
      <AddColumnDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingColumn(null);
        }}
        onSave={handleAddColumn}
        initialTitle={editingColumn?.title}
      />
      <AddTaskDialog
        open={taskDialogOpen}
        onClose={() => {
          setTaskDialogOpen(false)
          setTaskColumnId(null)
          setEditingTask(null)
        }}
        onSave={handleAddTask}
        task={editingTask}
        isEdit={!!editingTask}
      />

      <AddTaskDialog
        open={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setViewTask(null);
        }}
        task={viewTask}
        isView={true}
      />
    </div>
  );
};

export default WorkAreapage;
