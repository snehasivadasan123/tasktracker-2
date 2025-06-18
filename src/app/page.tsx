"use client"

import React, { useEffect, useState } from 'react'
import WorkspaceOverview from '@/components/WorkspaceOverview'
import { Iworkspace } from "@/types"
import WorkspaceDialog from '@/components/WorkspaceDialog'
import axios from 'axios'
// import { workspaceData } from '@/data/workspaceData'

interface WorkspaceDialogData {
  title: string;
}

interface DeleteWorkspaceParams {
  id: number;
}

interface DownloadWorkspaceParams {
  workspace: Iworkspace;
}

const page = () => {
  const [open, setOpen] = React.useState(false);
  const [workspaces, setWorkspaces] = React.useState<Iworkspace[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [workspaceToEdit, setWorkspaceToEdit] = useState<Iworkspace | null>(null)
  const [loading, setLoading] = useState(true)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(`${API_URL}/workspaces`)
        setWorkspaces(data)
        console.log("the datassssssss", data)
      } catch (error) {
        console.error("Failed to fetch workspaces", error);
      } finally {
        setLoading(false)
      }
    }
    fetchData();
  }, [])

  const handleAddWorkspace = () => {
    setOpen(true);
  }
  const handleEditWorkspace = ({ workspace }: { workspace: Iworkspace }) => {
    setWorkspaceToEdit(workspace)
    setOpen(true)
  }
  const handleDeleteWorkspace = async ({ id }: DeleteWorkspaceParams) => {
    try {
      await axios.delete(`${API_URL}/workspaces/${id}`);
      setWorkspaces((prev) => prev.filter(ws => ws.id !== id));
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const handleDownloadWorkspace = async ({ workspace }: DownloadWorkspaceParams) => {
    const { id } = workspace;

    try {
      const [workspacesRes, columnsRes, tasksRes, attachmentsRes] = await Promise.all([
        axios.get(`${API_URL}/workspaces?id=${id}`),
        axios.get(`${API_URL}/columns?workspaces_id=${id}`),
        axios.get(`${API_URL}/tasks?workspaces_id=${id}`),
        axios.get(`${API_URL}/attachments?workspaces_id=${id}`),
      ]);

      const filteredData = {
        workspaces: workspacesRes.data,
        columns: columnsRes.data,
        tasks: tasksRes.data,
        attachments: attachmentsRes.data,
      };

      const blob = new Blob([JSON.stringify(filteredData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${workspace.title.replace(/\s+/g, "_")}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to fetch data for download", error);
    }
  };

  if (loading) {
    return (
      <main className="p-8 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
      </main>
    );
  }
  return (
    <main className='p-8'>
      <h1 className="text-lg font-medium flex items-center space-x-4 ml-30 p-5">Workspace</h1>
      <WorkspaceOverview
        workspaceDatas={workspaces}
        onAddWorkspace={handleAddWorkspace}
        onEditWorkspace={handleEditWorkspace}
        onDeleteWorkspace={handleDeleteWorkspace}
        onDownloadWorkspace={handleDownloadWorkspace}
      />
      <WorkspaceDialog
        open={open}
        onOpenChange={(state) => {
          setOpen(state);
          if (!state) setWorkspaceToEdit(null);
        }}
        initialData={workspaceToEdit}
        onSave={async (data: WorkspaceDialogData) => {
          if (workspaceToEdit) {
            const updatedWorkspace = {
              ...workspaceToEdit,
              title: data.title,
              date: new Date().toDateString(),
            };

            try {
              const { data: saved } = await axios.put(
                `${API_URL}/workspaces/${workspaceToEdit.id}`,
                updatedWorkspace
              );

              setWorkspaces((prev) =>
                prev.map((ws) => (ws.id === saved.id ? saved : ws))
              );
            } catch (err) {
              console.error("Failed to update workspace", err);
            }
          } else {
            const maxId = workspaces.reduce((max, ws) => {
              const numericId = typeof ws.id === "number" ? ws.id : parseInt(ws.id);
              return isNaN(numericId) ? max : Math.max(max, numericId);
            }, 0);

            const newWorkspace = {
              id: String(maxId + 1),
              title: data.title,
              date: new Date().toDateString(),
              created_at: Date.now(),
            };

            try {
              const { data: savedWorkspace } = await axios.post(
                `${API_URL}/workspaces`,
                newWorkspace
              );
              setWorkspaces((prev) => [...prev, savedWorkspace]);
            } catch (err) {
              console.error("Failed to add workspace", err);
            }
          }

          setOpen(false);
          setWorkspaceToEdit(null);
        }}
      />
    </main>
  )
}

export default page;
