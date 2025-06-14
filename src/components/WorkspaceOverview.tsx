import { Iworkspace } from "@/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, Download, Pencil, Plus, Trash2 } from "lucide-react";
import React from "react";
interface Props {
  workspaceDatas: Iworkspace[];
}

const WorkspaceOverview = ({ workspaceDatas }: Props) => {
  console.log("the datas are", workspaceDatas);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
      {workspaceDatas.map((ws) => (
        <Card
          key={ws.id}
          className="flex flex-col justify-between bg-gray-100 border  hover:bg-white border-gray-200 rounded-none w-[340px] h-[200px] p-0"
        >
          <CardContent className="flex-1 flex flex-col justify-between p-6 pb-0">
            <div className="text-lg font-semibold mb-8">{ws.title}</div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="icon" className="bg-gray-200 rounded-none p-2">
                <Pencil className="w-5 h-5 " />
              </Button>
              <Button variant="ghost" size="icon" className="bg-gray-200 rounded-none p-2">
                <Trash2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-gray-200 rounded-none p-2">
                <Download className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-gray-200 rounded-none p-2">
                <ArrowRight className="w-5 h-5 " />
              </Button>
            </div>
          </CardContent>
          <div className="px-6 py-2 text-gray-400 text-right bg-gray-50 text-[13px] border-t font-medium">
            {ws.date}
          </div>
        </Card>
      ))}
<Card className="flex flex-col justify-center items-center bg-gray-100 hover:bg-white transition-colors border border-gray-200 rounded-none w-[340px] h-[200px] p-0 cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center flex-1 p-6">
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-200 rounded-none mb-2 p-2">
            <Plus className="w-5 h-5 text-gray-700" />
          </Button>
          <a
            href="#"
            className="text-base underline text-gray-800"
          
          >
            Add workspace
          </a>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default WorkspaceOverview;
