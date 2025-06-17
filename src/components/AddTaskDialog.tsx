"use client";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
// import { X } from "lucide-react";
interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (title: string, description: string, file: File | null) => void;
  isView?: boolean;
  task?: { title: string; description: string; attachmentUrl?: string; fileName?: string } | null
  isEdit?: boolean;

}

export function AddTaskDialog({
  open,
  onClose,
  onSave,
  isView = false,
  task,
}: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<{title?: string, description?: string, file?: string}>({});
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [task]);

  const handleSubmit = () => {
    const newErrors: {title?: string, description?: string, file?: string} = {};
    if (!title.trim()) newErrors.title = "Task title is required.";
    if (!description.trim()) newErrors.description = "Task description is required.";
    if (!file) newErrors.file = "Task attachment is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    if (onSave) {
      onSave(title, description, file);
    }
    setTitle("");
    setDescription("");
    setFile(null);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <div className="flex justify-between items-center border-b pb-2">
          <DialogTitle>Task</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon">

            </Button>
          </DialogClose>
        </div>

        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Eg, In review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isView}

            />
            {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title}</span>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Write description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isView}

              rows={4}
            />
            {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description}</span>}
          </div>

          <div>
            <Label htmlFor="file">Attachments</Label>
            {isView ? (
              task?.attachmentUrl ? (
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">File: {task.fileName ?? "Unknown file"}</p>
                  <a
                    href={task.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View Attachment
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No attachment</p>
              )
            ) : (
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                disabled={isView}
              />
            )}
            {errors.file && <span className="text-red-500 text-xs mt-1">{errors.file}</span>}
          </div>
        </div>

        <DialogFooter className="pt-4">
          {!isView && <Button onClick={handleSubmit}>Save</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
