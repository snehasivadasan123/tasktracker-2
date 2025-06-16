"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { workspaceData } from "@/data/workspaceData";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowLeft, EyeIcon, MoveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddColumnDialog } from "@/components/AddColumnDialog";
import { AddTaskDialog } from "@/components/AddTaskDialog";

const WorkAreapage = () => {
  const params = useParams();
  const worksid = Number(params.workId);
  const workspace = workspaceData.workspaces.find((ws) => ws.id === worksid);
  const [columns, setColumns] = useState(
    workspaceData.columns.filter((col) => col.workspaces_id === worksid)
  );

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


  function handleAddColumn(title: string): void {
    if (editingColumn) {
      const updatedCols = columns.map((col) =>
        col.id === editingColumn.id ? { ...col, title } : col
      );
      setColumns(updatedCols);
    } else {
      const newCol = createNewColumn(title);
      setColumns([...columns, newCol]);
    }

    setDialogOpen(false);
    setEditingColumn(null);
  }

  function handleDeleteColumn(colId: number) {
    const updatedCols = columns.filter(col => col.id !== colId);
    setColumns(updatedCols);
    workspaceData.tasks = workspaceData.tasks.filter(task => task.columns_id !== colId);
  }

  function handleAddTask(title: string, description: string, file: File | null) {
    if (taskColumnId !== null) {
      if (editingTask) {
        // Update existing task
        const taskIndex = workspaceData.tasks.findIndex(t => t.id === editingTask.id);
        if (taskIndex !== -1) {
          workspaceData.tasks[taskIndex] = {
            ...workspaceData.tasks[taskIndex],
            title,
            description,
            attachmentUrl: file ? URL.createObjectURL(file) : editingTask.attachmentUrl,
            fileName: file ? file.name : editingTask.fileName,
          };
        }
        setEditingTask(null);
      } else {
        // Add new task
        const newTask = {
          id: Date.now(),
          columns_id: taskColumnId,
          title,
          description,
          attachmentUrl: file ? URL.createObjectURL(file) : "",
          fileName: file?.name || "",
          created_at: Date.now(),
        };
        workspaceData.tasks.push(newTask);
      }

      setTaskDialogOpen(false);
      setTaskColumnId(null);
    }
  }
  function handleDeleteTask(taskId: number) {
    workspaceData.tasks = workspaceData.tasks.filter(task => task.id !== taskId);
    setColumns([...columns]);
  }
  return (
    <div className="p-6 ml-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold ml-2">{workspace?.title}</h1>
      </div>

      <div className="flex items-start gap-4 overflow-x-auto">
        {columns.map((col) => {
          const tasks = workspaceData.tasks.filter((task) => task.columns_id === col.id);

          return (
            <div key={col.id}>
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

              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card key={task.id} className="bg-gray-200 hover:bg-white p-2 shadow mt-10 rounded-none">
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
                ))}
              </div>

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
            </div>
          );
        })}
        <div
          className="w-[250px] h-[60px] flex items-center justify-center bg-white border border-dashed border-gray-300 cursor-pointer"
          onClick={() => setDialogOpen(true)}
        >
          <span className="text-gray-700 font-medium">+ Add column</span>
        </div>
      </div>
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
