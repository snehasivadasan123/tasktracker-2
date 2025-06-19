import { Iworkspace } from "@/types";
import WorkspaceOverview from "./WorkspaceOverview";

interface PageProps {
  workspaces: Iworkspace[];
  onAddWorkspace?: () => void;
  onViewWorkspace?: (workspace: Iworkspace) => void;
  onEditWorkspace?: (workspace: Iworkspace) => void;
  onDeleteWorkspace?: (workspace: Iworkspace) => void;
  onDownloadWorkspace?: (workspace: Iworkspace) => void;
}

export default function Page({
  workspaces,
  onAddWorkspace,
  onViewWorkspace,
  onEditWorkspace,
  onDeleteWorkspace,
  onDownloadWorkspace,
}: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
        <p className="text-gray-600 mt-2">Manage your workspaces and projects</p>
      </div>

      <WorkspaceOverview
        workspaceDatas={workspaces}
        onAddWorkspace={onAddWorkspace ?? (() => { })}
        onViewWorkspace={onViewWorkspace}
        onEditWorkspace={
          onEditWorkspace
            ? ({ workspace }) => onEditWorkspace(workspace)
            : () => { }
        }
        onDeleteWorkspace={
          onDeleteWorkspace
            ? ({ id }) => {
              const ws = workspaces.find(w => w.id === id);
              if (ws) onDeleteWorkspace(ws);
            }
            : () => { }
        }
        onDownloadWorkspace={
          onDownloadWorkspace
            ? ({ workspace }) => onDownloadWorkspace(workspace)
            : () => { }
        } />
    </div>
  );
} 