"use client"

import React from 'react'
import WorkspaceOverview from '@/components/WorkspaceOverview'
import { Iworkspace } from "@/types"
import WorkspaceDialog from '@/components/WorkspaceDialog'

const page = () => {
  const [open, setOpen] = React.useState(false);
  const [workspaces, setWorkspaces] = React.useState<Iworkspace[]>([
    { id: 1, title: "Project management", date: "Mon May 02 2022" },
    { id: 2, title: "Digital marketing course timeline", date: "Mon May 02 2022" },
    { id: 3, title: "Business planning", date: "Mon May 02 2022" },
  ]);

  const handleAddWorkspace = () => {
    setOpen(true);
  };

  return (
    <main className='p-8'>
      <h1 className="text-lg font-medium flex items-center space-x-4">Workspace</h1>
      <WorkspaceOverview 
        workspaceDatas={workspaces} 
        onAddWorkspace={handleAddWorkspace}
      />
      <WorkspaceDialog
        open={open}
        onOpenChange={setOpen}
        onSave={({ type, title }) => {
          setWorkspaces(ws => [
            ...ws,
            {
              id: ws.length + 1,
              title,
              date: new Date().toDateString(),
            },
          ]);
          setOpen(false);
        }}
      />
    </main>
  );
}

export default page;
