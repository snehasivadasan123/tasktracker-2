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
  onSave: (data: { type: string; title: string }) => void
  initialData?: { title: string } | null

}

export default function WorkspaceDialog({
  open,
  onOpenChange,
  onSave,
  initialData
}: WorkspaceDialogProps) {
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [error, setError] = React.useState("");
  const [mode, setMode] = React.useState<'manual' | 'import'>('manual');
  const [importFile, setImportFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    setTitle(initialData?.title || "");
    setError("");
    setMode('manual');
    setImportFile(null);
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'manual') {
      if (!title.trim()) {
        setError("Workspace title is required.");
        return;
      }
      setError("");
      onSave({ type: "manual", title });
      setTitle("");
    } else {
      if (!importFile) {
        setError("Import file is required.");
        return;
      }
      if (importFile.type.startsWith('image/')) {
        setError("Image files are not allowed. Please select a .json, .csv, or .txt file.");
        return;
      }
      setError("");
      onSave({ type: "import", title: importFile.name });
      setImportFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Workspace
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-4 mb-4">
              <Button type="button" variant={mode === 'manual' ? 'default' : 'outline'} onClick={() => setMode('manual')}>Manual</Button>
              <Button type="button" variant={mode === 'import' ? 'default' : 'outline'} onClick={() => setMode('import')}>Import</Button>
            </div>
            {mode === 'manual' && (
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Eg, Digital marketing"
                />
              </div>
            )}
            {mode === 'import' && (
              <div>
                <label htmlFor="importFile" className="block text-sm font-medium text-gray-700">Import file</label>
                <input
                  type="file"
                  id="importFile"
                  accept=".json,.csv,.txt,application/json,text/csv,text/plain"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    if (file && file.type.startsWith('image/')) {
                      setError("Image files are not allowed. Please select a .json, .csv, or .txt file.");
                      setImportFile(null);
                    } else {
                      setError("");
                      setImportFile(file);
                    }
                  }}
                  className="mt-1 block w-full"
                />
              </div>
            )}
            {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}