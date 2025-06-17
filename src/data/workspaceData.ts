import { IWorkspaceData } from "@/types";

export const workspaceData: IWorkspaceData = {
  workspaces: [
    {
      id: 1,
      title: "Project management",
      date: "Mon May 02 2022",
      created_at: 1651478883677
    },
    {
      id: 2,
      title: "Digital Marketing Course Timeline",
      date: "Mon Jun 17 2024",
      created_at: Date.now()
    }
  ],
  columns: [
    // Project Management Columns
    {
      id: 1,
      order: 1,
      workspaces_id: 1,
      title: "To do",
      created_at: 1651479365800
    },
    {
      id: 2,
      order: 2,
      workspaces_id: 1,
      title: "In progress",
      created_at: 1651479365800
    },
    {
      id: 3,
      order: 3,
      workspaces_id: 1,
      title: "Completed",
      created_at: 1651479365800
    },
    // Digital Marketing Columns
    {
      id: 4,
      order: 1,
      workspaces_id: 2,
      title: "To Learn",
      created_at: Date.now()
    },
    {
      id: 5,
      order: 2,
      workspaces_id: 2,
      title: "Learning",
      created_at: Date.now()
    },
    {
      id: 6,
      order: 3,
      workspaces_id: 2,
      title: "Completed",
      created_at: Date.now()
    }
  ],
  tasks: [
    // Project Management Tasks
    {
      id: 1,
      order: 1,
      columns_id: 1,
      workspaces_id: 1,
      title: "Column 1 Task 1",
      description: "Task description here",
      created_at: 1651479365800,
      fileName: undefined,
      attachmentUrl: undefined
    },
    {
      id: 2,
      order: 2,
      columns_id: 1,
      workspaces_id: 1,
      title: "Column 1 Task 2",
      description: "",
      created_at: 1651479365800,
      fileName: undefined,
      attachmentUrl: undefined
    },
    {
      id: 3,
      order: 3,
      columns_id: 1,
      workspaces_id: 1,
      title: "Column 1 Task 3",
      description: "",
      created_at: 1651479365800,
      fileName: undefined,
      attachmentUrl: undefined
    },
    {
      id: 4,
      order: 1,
      columns_id: 2,
      workspaces_id: 1,
      title: "Column 2 Task 1",
      description: "",
      created_at: 1651479365800,
      fileName: undefined,
      attachmentUrl: undefined
    },
    {
      id: 5,
      order: 1,
      columns_id: 3,
      workspaces_id: 1,
      title: "Column 3 Task 1",
      description: "",
      created_at: 1651479365800,
      fileName: undefined,
      attachmentUrl: undefined
    },
    // Digital Marketing Tasks
    {
      id: 6,
      order: 1,
      columns_id: 4,
      workspaces_id: 2,
      title: "SEO Basics",
      description: "Understand search engine optimization fundamentals",
      created_at: Date.now(),
      fileName: undefined,
      attachmentUrl: undefined
    },
    {
      id: 7,
      order: 2,
      columns_id: 4,
      workspaces_id: 2,
      title: "Content Strategy",
      description: "Learn how to plan and execute content marketing",
      created_at: Date.now(),
      fileName: undefined,
      attachmentUrl: undefined
    },
    {
      id: 8,
      order: 1,
      columns_id: 5,
      workspaces_id: 2,
      title: "Google Ads Introduction",
      description: "Basics of paid ads through Google",
      created_at: Date.now(),
      fileName: undefined,
      attachmentUrl: undefined
    },
    {
      id: 9,
      order: 1,
      columns_id: 6,
      workspaces_id: 2,
      title: "Social Media Marketing",
      description: "Completed module on Facebook and Instagram Ads",
      created_at: Date.now(),
      fileName: undefined,
      attachmentUrl: undefined
    }
  ],
  attachments: [
    {
      id: 1,
      tasks_id: 1,
      workspaces_id: 1,
      name: "react.png",
      size: 34973,
      src: "data:image/png;base64,..."
    }
  ]
};
