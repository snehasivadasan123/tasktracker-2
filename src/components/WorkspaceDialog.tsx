"use client"

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface WorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { type: string; title: string }) => void;
  onImport?: (file: File) => void;
  initialData?: { title: string } | null;
}

export default function WorkspaceDialog({
  open,
  onOpenChange,
  onSave,
  onImport,
  initialData,
}: WorkspaceDialogProps) {
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [type, setType] = React.useState<"manual" | "import">("manual");
  const [importFile, setImportFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setTitle(initialData?.title || "");
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "manual") {
      if (!title.trim()) {
        setError("Title cannot be empty or whitespace");
        return;
      }
      onSave({ type: "workspace", title });
      setTitle("");
    } else if (importFile && onImport) {
      onImport(importFile);
      setImportFile(null);
    }
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Workspace" : "Create New Workspace"}
          </DialogTitle>
        </DialogHeader>

        {/* Toggle buttons for Manual vs Import */}
        {!initialData && (
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={type === "manual" ? "default" : "outline"}
              onClick={() => setType("manual")}
            >
              Manual
            </Button>
            <Button
              type="button"
              variant={type === "import" ? "default" : "outline"}
              onClick={() => setType("import")}
            >
              Import
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Manual Input */}
          {type === "manual" && (
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError("");
                }}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter workspace title"
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}

            </div>
          )}

          {/* Import Input */}
          {type === "import" && (
            <div>
              <label htmlFor="importFile" className="block text-sm font-medium text-gray-700">
                Upload JSON File
              </label>
              <input
                type="file"
                accept="application/json"
                id="importFile"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update" : type === "manual" ? "Create" : "Import"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
