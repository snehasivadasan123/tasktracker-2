"use client"

import React, { useState } from 'react'
import WorkspaceOverview from '@/components/WorkspaceOverview'
import { Iworkspace } from "@/types"
import WorkspaceDialog from '@/components/WorkspaceDialog'
import { workspaceData } from '@/data/workspaceData'

const page = () => {
  const [open, setOpen] = React.useState(false);
  const [workspaces, setWorkspaces] = React.useState<Iworkspace[]>([
    { id: 1, title: "Project management", date: "Mon May 02 2022" },
    { id: 2, title: "Digital marketing course timeline", date: "Mon May 02 2022" },
    { id: 3, title: "Business planning", date: "Mon May 02 2022" },
  ])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [workspaceToEdit, setWorkspaceToEdit] = useState<Iworkspace | null>(null)

  const handleAddWorkspace = () => {
    setOpen(true);
  }
  const handleEditWorkspace = (workspace: Iworkspace) => {
    setWorkspaceToEdit(workspace)
    setOpen(true)
  }
  const handleDeleteWorkspace = (id: number) => {
    setWorkspaces((prev) => prev.filter(ws => ws.id !== id));
  }
  const handleDownloadWorkspace = (workspace: Iworkspace) => {
    const { id } = workspace
    const filteredData = {
      workspaces: workspaceData.workspaces.filter(w => w.id === id),
      columns: workspaceData.columns.filter(c => c.workspaces_id === id),
      tasks: workspaceData.tasks.filter(t => t.workspaces_id === id),
      attachments: workspaceData.attachments.filter(a => a.workspaces_id === id)
    }
    const blob = new Blob([JSON.stringify(filteredData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${workspace.title.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <main className='p-8'>
      <h1 className="text-lg font-medium flex items-center space-x-4">Workspace</h1>
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
          if (!state) setWorkspaceToEdit(null)
        }}
        initialData={workspaceToEdit}
        onSave={({ type, title }) => {
          if (workspaceToEdit) {
            // Edit mode
            setWorkspaces(ws =>
              ws.map(w =>
                w.id === workspaceToEdit.id ? { ...w, title } : w
              )
            );
          } else {

            setWorkspaces(ws => [
              ...ws,
              {
                id: ws.length + 1,
                title,
                date: new Date().toDateString(),
              },
            ]);
          }

          setOpen(false);
          setWorkspaceToEdit(null); // Clear after saving
        }}
      />
    </main>
  );
}

export default page;
