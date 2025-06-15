"use client";

import React from "react";
import { useParams } from "next/navigation";
import { workspaceData } from "@/data/workspaceData";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const WorkAreapage = () => {
  const params = useParams();
  const worksid = Number(params.workId);
  const workspace = workspaceData.workspaces.find((ws) => ws.id === worksid);
  const columns = workspaceData.columns.filter(
    (col) => col.workspaces_id === worksid
  );

  console.log("the worksid is", columns);
  return (
   <div>
      <h1 className="text-xl font-semibold mb-6">{workspace?.title}</h1>
      <div className="flex gap-6">
        {columns.map((col) => (
          <Card
            key={col.id}
            className="bg-gray-100 w-[220px] h-[50px] flex flex-col justify-between p-0 rounded-none"
          >
            <CardContent className="flex flex-row justify-between items-center h-full px-4 py-2">
              <span className="font-medium">{col.title}</span>
              <span className="flex gap-2">
                <Button variant="ghost" size="icon" className="bg-gray-200 rounded-none p-2">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-gray-200 rounded-none p-2">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </span>
            </CardContent>
          </Card>
        ))}

        <Card className="w-[220px] h-[50px] flex items-center justify-center bg-white border border-dashed border-gray-300 rounded-none cursor-pointer">
          <CardContent className="flex items-center justify-center w-full h-full px-4 py-2">
            <span className="text-gray-700 font-medium">+ Add column</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkAreapage;
