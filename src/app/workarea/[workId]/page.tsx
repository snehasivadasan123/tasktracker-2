"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddColumnDialog } from "@/components/AddColumnDialog";
import { AddTaskDialog } from "@/components/AddTaskDialog"
import { notFound } from "next/navigation";
import axios from 'axios';

import {
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,

} from '@dnd-kit/sortable';
import Board from '@/components/WorkArea/Board';
import { PageContainer } from "@/components/PageContainer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AddColumnParams {
  title: string;
}

interface AddTaskParams {
  title: string;
  description: string;
  file: File | null;
}

const WorkAreapage = () => {
  const params = useParams();
  const worksid = Number(params.workId);
  const [workspace, setWorkspace] = useState<{ id: number; title: string } | null>(null);
  const [columns, setColumns] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: workspaceData } = await axios.get(`${API_URL}/workspaces/${worksid}`);

        const [colRes, taskRes] = await Promise.all([
          axios.get(`${API_URL}/columns?workspaces_id=${worksid}`),
          axios.get(`${API_URL}/tasks?workspaces_id=${worksid}`),
        ]);

        // Sort columns and tasks by 'order' field
        const sortedColumns = colRes.data.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        const sortedTasks = taskRes.data.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

        setWorkspace(workspaceData);
        setColumns(sortedColumns);
        setTasks(sortedTasks);
      } catch (error) {

        notFound()
        return
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
  async function handleAddColumn({ title }: AddColumnParams): Promise<void> {
    if (editingColumn) {
      const updatedCols = columns.map((col) =>
        col.id === editingColumn.id ? { ...col, title } : col
      );
      setColumns(updatedCols);

      try {
        await axios.patch(`${API_URL}/columns/${editingColumn.id}`, { title });
      } catch (err) {
        console.error("Failed to update column:", err);
      }
    } else {
      const { data: allColumns } = await axios.get(`${API_URL}/columns`);
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
        const { data: savedCol } = await axios.post(`${API_URL}/columns`, newCol);
        setColumns([...columns, savedCol]);
      } catch (err) {
        console.error("Error adding column:", err);
      }
    }

    setDialogOpen(false);
    setEditingColumn(null);
  }

  async function handleDeleteColumn({ colId }: { colId: number }) {
    try {
      await axios.delete(`${API_URL}/columns/${colId}`);
      const relatedTasks = tasks.filter((task) => Number(task.columns_id) === Number(colId));

      await Promise.all(
        relatedTasks.map((task) =>
          axios.delete(`${API_URL}/tasks/${task.id}`)
        )
      );

      setColumns(columns.filter((col) => col.id !== colId));
      setTasks(tasks.filter((task) => task.columns_id !== colId));
    } catch (error) {
      console.error("Error deleting column and tasks:", error);
    }
  }

  async function handleAddTask({ title, description, file }: AddTaskParams) {
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
          await axios.patch(`${API_URL}/tasks/${editingTask.id}`, {
            title,
            description,
            attachmentUrl: file ? URL.createObjectURL(file) : editingTask.attachmentUrl,
            fileName: file ? file.name : editingTask.fileName,
          });
        } catch (err) {
          console.error("Failed to update task:", err);
        }

        setEditingTask(null);
      } else {
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
          const { data: savedTask } = await axios.post(`${API_URL}/tasks`, newTask);
          setTasks([...tasks, savedTask]);
        } catch (err) {
          console.error("Error adding task:", err);
        }
      }

      setTaskDialogOpen(false);
      setTaskColumnId(null);
    }
  }

  async function handleDeleteTask({ taskId }: { taskId: number }) {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
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
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        setColumns(newColumns);
        // Persist new order to backend
        newColumns.forEach((col, idx) => {
          axios.patch(`${API_URL}/columns/${col.id}`, { order: idx });
        });
      }
      return;
    }

    // 2. Task drag
    const activeTask = tasks.find(t => t.id === active.id);
    const overTask = tasks.find(t => t.id === over.id);

    if (activeTask && overTask) {
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
        // Persist new order to backend
        reordered.forEach((task, idx) => {
          axios.patch(`${API_URL}/tasks/${task.id}`, { order: idx });
        });
      } else {
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
        // Persist new order to backend for destination column
        filtered.forEach((task, idx) => {
          axios.patch(`${API_URL}/tasks/${task.id}`, { order: idx });
        });
      }
    } else if (activeTask && !overTask) {
      // Dropped on empty column area: move to end of that column
      const columnId = columns.find(col => col.id === over.id)?.id;
      if (columnId) {
        const updatedTasks = tasks.map(t =>
          t.id === active.id ? { ...t, columns_id: columnId } : t
        );
        setTasks(updatedTasks);
        // Persist column change to backend
        const movedTask = updatedTasks.find(t => t.id === active.id);
        if (movedTask) {
          axios.patch(`${API_URL}/tasks/${movedTask.id}`, { columns_id: columnId });
        }
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

    <PageContainer>
      <div className="py-12 ">
        <div className="flex items-center gap-10 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold ">{workspace?.title}</h1>
        </div>
        <Board
          columns={columns}
          tasks={tasks}
          onEditColumn={(col) => { setEditingColumn({ id: col.id, title: col.title }); setDialogOpen(true); }}
          onDeleteColumn={(col) => handleDeleteColumn({ colId: col.id })}
          onAddTask={(col) => { setTaskColumnId(col.id); setTaskDialogOpen(true); }}
          onViewTask={(task) => { setViewTask({ title: task.title, description: task.description, attachmentUrl: task.attachmentUrl, fileName: task.fileName }); setIsViewOpen(true); }}
          onEditTask={(task) => { setEditingTask(task); setTaskColumnId(task.columns_id); setTaskDialogOpen(true); }}
          onDeleteTask={(task) => handleDeleteTask({ taskId: task.id })}
          onDragEnd={handleDragEnd}
          onAddColumn={() => setDialogOpen(true)}
        />
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
          open={taskDialogOpen || isViewOpen}
          onClose={() => {
            if (taskDialogOpen) {
              setTaskDialogOpen(false);
              setTaskColumnId(null);
              setEditingTask(null);
            }
            if (isViewOpen) {
              setIsViewOpen(false);
              setViewTask(null);
            }
          }}
          onSave={taskDialogOpen ? handleAddTask : () => { }}
          task={taskDialogOpen ? editingTask : viewTask}
          isEdit={taskDialogOpen && !!editingTask}
          isView={isViewOpen}
        />
      </div>
    </PageContainer>

  );
};

export default WorkAreapage;