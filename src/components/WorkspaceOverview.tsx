// Header.tsx
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full bg-gray-100 px-4 py-3 flex justify-between items-center shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link href="/">
          <Image
            src="https://react-task-management.vercel.app/assets/images/logo.svg"
            alt="Logo"
            width={120}
            height={40}
            priority
          />
        </Link>
        <Link
          href="/documentation"
          className="text-gray-700 hover:text-gray-900 font-medium"
        >
          Documentation
        </Link>
      </div>
    </header>
  );
}

// WorkspaceOverview.tsx
import { Iworkspace } from "@/types";
import {
  Card,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Download, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface WorkspaceOverviewProps {
  workspaceDatas: Iworkspace[];
  onAddWorkspace: () => void;
  onEditWorkspace: (params: { workspace: Iworkspace }) => void;
  onDeleteWorkspace: (params: { id: number }) => void;
  onDownloadWorkspace: (params: { workspace: Iworkspace }) => void
  onViewWorkspace?: (workspace: Iworkspace) => void;
}

const WorkspaceOverview = ({
  workspaceDatas,
  onAddWorkspace,
  onEditWorkspace,
  onDeleteWorkspace,
  onDownloadWorkspace,
}: WorkspaceOverviewProps) => {
  const router = useRouter();

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="py-20">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Workspace
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-start">
          {workspaceDatas.map((ws) => (
            <Card
              key={ws.id}
              className="flex flex-col justify-between bg-gray-100 border hover:bg-white hover:shadow-md transition-all duration-200 border-gray-200 rounded-none w-[280px] h-[180px]"
            >
              <CardContent className="flex-1 flex flex-col p-6 pb-0">
                <div className="text-lg font-medium text-gray-900 leading-tight h-14 flex items-start overflow-hidden">
                  {ws.title}
                </div>
                <div className="flex-1"></div>
                <div className="flex justify-end gap-2 mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-gray-200 hover:bg-gray-300 rounded-none w-8 h-8 transition-colors"
                    onClick={() => onEditWorkspace({ workspace: ws })}
                  >
                    <Pencil className="w-4 h-4 text-gray-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-gray-200 hover:bg-gray-300 rounded-none w-8 h-8 transition-colors"
                    onClick={() => onDeleteWorkspace({ id: ws.id })}
                  >
                    <Trash2 className="w-4 h-4 text-gray-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-gray-200 hover:bg-gray-300 rounded-none w-8 h-8 transition-colors"
                    onClick={() => onDownloadWorkspace({ workspace: ws })}
                  >
                    <Download className="w-4 h-4 text-gray-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-gray-200 hover:bg-gray-300 rounded-none w-8 h-8 transition-colors"
                    onClick={() => router.push(`/workarea/${ws.id}`)}
                  >
                    <ArrowRight className="w-4 h-4 text-gray-700" />
                  </Button>
                </div>
              </CardContent>
              <div className="px-6 py-2 text-gray-500 text-right bg-gray-50 text-xs border-t border-gray-200 font-medium">
                {ws.date}
              </div>
            </Card>
          ))}

          {/* Add Workspace Card */}
          <Card
            onClick={onAddWorkspace}
            className="flex flex-col justify-center items-center bg-gray-100 hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-200 rounded-none w-[280px] h-[180px] cursor-pointer"
          >
            <CardContent className="flex flex-col items-center justify-center flex-1 p-6">
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-200 hover:bg-gray-300 rounded-none mb-3 w-8 h-8 transition-colors"
                onClick={onAddWorkspace}
              >
                <Plus className="w-4 h-4 text-gray-700" />
              </Button>
              <span className="text-sm underline text-gray-800 hover:text-gray-900 transition-colors">
                Add workspace
              </span>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  );
};

export default WorkspaceOverview;