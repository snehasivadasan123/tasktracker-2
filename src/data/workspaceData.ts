import { IWorkspaceData } from "@/types";

export const workspaceData: IWorkspaceData = {
  "workspaces": [
    {
      "id": 1,
      "title": "Project management",
      "date": "Mon May 02 2022",
      "created_at": 1651478883677
    }
  ],
  "columns": [
    {
      "id": 1,
      "order": 1,
      "workspaces_id": 1,
      "title": "To do",
      "created_at": 1651479365800
    },
    {
      "id": 2,
      "order": 2,
      "workspaces_id": 1,
      "title": "In progress",
      "created_at": 1651479365800
    },
    {
      "id": 3,
      "order": 3,
      "workspaces_id": 1,
      "title": "Completed",
      "created_at": 1651479365800
    }
  ],
  "tasks": [
    {
      "id": 1,
      "order": 1,
      "columns_id": 1,
      "workspaces_id": 1,
      "title": "Column 1 Task 1",
      "description": "Task description here",
      "created_at": 1651479365800
    },
    {
      "id": 2,
      "order": 2,
      "columns_id": 1,
      "workspaces_id": 1,
      "title": "Column 1 Task 2",
      "description": "",
      "created_at": 1651479365800
    },
    {
      "id": 3,
      "order": 3,
      "columns_id": 1,
      "workspaces_id": 1,
      "title": "Column 1 Task 3",
      "description": "",
      "created_at": 1651479365800
    },
    {
      "id": 4,
      "order": 1,
      "columns_id": 2,
      "workspaces_id": 1,
      "title": "Column 2 Task 1",
      "description": "",
      "created_at": 1651479365800
    },
    {
      "id": 5,
      "order": 1,
      "columns_id": 3,
      "workspaces_id": 1,
      "title": "Column 3 Task 1",
      "description": "",
      "created_at": 1651479365800
    }
  ],
  "attachments": [
    {
      "id": 1,
      "tasks_id": 1,
      "workspaces_id": 1,
      "name": "react.png",
      "size": 34973,
      "src": "data:image/png;base64,..." // Truncated for brevity
    }
  ]
}; 