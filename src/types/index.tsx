export interface Iworkspace {
  id: number;
  title: string;
  date: string;
  created_at?: number;
}

export interface Icolumn {
  id: number;
  order: number;
  workspaces_id: number;
  title: string;
  created_at: number;
}

export interface Itask {
  id: number;
  order: number;
  columns_id: number;
  workspaces_id: number;
  title: string;
  description: string;
  created_at: number;
}

export interface Iattachment {
  id: number;
  tasks_id: number;
  workspaces_id: number;
  name: string;
  size: number;
  src: string;
}

export interface IWorkspaceData {
  workspaces: Iworkspace[];
  columns: Icolumn[];
  tasks: Itask[];
  attachments: Iattachment[];
}