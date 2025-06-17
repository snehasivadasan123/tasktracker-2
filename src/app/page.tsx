"use client"

import React, { useEffect, useState } from 'react'
import WorkspaceOverview from '@/components/WorkspaceOverview'
import { Iworkspace } from "@/types"
import WorkspaceDialog from '@/components/WorkspaceDialog'
// import { workspaceData } from '@/data/workspaceData'

const page = () => {
  const [open, setOpen] = React.useState(false);
  const [workspaces, setWorkspaces] = React.useState<Iworkspace[]>([]);
  // [
  //   { id: 1, title: "Project management", date: "Mon May 02 2022" },
  //   { id: 2, title: "Digital marketing course timeline", date: "Mon May 02 2022" },
  //   { id: 3, title: "Business planning", date: "Mon May 02 2022" },]


  // )
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [workspaceToEdit, setWorkspaceToEdit] = useState<Iworkspace | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:3001/workspaces")
        const data = await res.json()
        setWorkspaces(data)
        console.log("the datassssssss", res)
      } catch (error) {
        console.error("Failed to fetch workspaces", error);

      }
      finally {
        setLoading(false)
      }
    }
    fetchData();
  }, [])

  const handleAddWorkspace = () => {
    setOpen(true);
  }
  const handleEditWorkspace = (workspace: Iworkspace) => {
    setWorkspaceToEdit(workspace)
    setOpen(true)
  }
  const handleDeleteWorkspace = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/workspaces/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete workspace");

      setWorkspaces((prev) => prev.filter(ws => ws.id !== id));
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const handleDownloadWorkspace = async (workspace: Iworkspace) => {
    const { id } = workspace;

    try {
      const [workspacesRes, columnsRes, tasksRes, attachmentsRes] = await Promise.all([
        fetch(`http://localhost:3001/workspaces?id=${id}`),
        fetch(`http://localhost:3001/columns?workspaces_id=${id}`),
        fetch(`http://localhost:3001/tasks?workspaces_id=${id}`),
        fetch(`http://localhost:3001/attachments?workspaces_id=${id}`),
      ]);

      const [workspaces, columns, tasks, attachments] = await Promise.all([
        workspacesRes.json(),
        columnsRes.json(),
        tasksRes.json(),
        attachmentsRes.json(),
      ]);

      const filteredData = {
        workspaces,
        columns,
        tasks,
        attachments,
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
        onSave={async (data) => {
          if (workspaceToEdit) {
            const updatedWorkspace = {
              ...workspaceToEdit,
              title: data.title,
              date: new Date().toDateString(),
            };

            try {
              const res = await fetch(`http://localhost:3001/workspaces/${workspaceToEdit.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedWorkspace),
              });

              if (!res.ok) throw new Error("Failed to update workspace");

              const saved = await res.json();

              setWorkspaces((prev) =>
                prev.map((ws) => (ws.id === saved.id ? saved : ws))
              );
            } catch (err) {
              console.error("Failed to update workspace", err);
            }
          }



          else {
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
              const res = await fetch("http://localhost:3001/workspaces", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newWorkspace),
              });

              if (!res.ok) throw new Error("Failed to save workspace");

              const savedWorkspace = await res.json();
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
