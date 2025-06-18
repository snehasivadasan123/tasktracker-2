"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (title: string, description: string, file: File | null) => void;
  isView?: boolean;
  task?: {
    title: string;
    description: string;
    attachmentUrl?: string;
    fileName?: string;
  } | null;
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
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    } else {
      setTitle("");
      setDescription("");
    }
    setError("");
  }, [task, open]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Title cannot be empty or whitespace.");
      return;
    }
    if (!description.trim()) {
      setError("Description cannot be empty or whitespace.");
      return;
    }
    if (!file && !task?.attachmentUrl) {
      setError("Please upload an attachment.");
      return;
    }

    if (onSave) {
      onSave(title.trim(), description.trim(), file);
      setTitle("");
      setDescription("");
      setFile(null);
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <div className="flex justify-between items-center border-b pb-2">
          <DialogTitle>Task</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" />
          </DialogClose>
        </div>

        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Eg, In review"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              disabled={isView}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Write description here..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError("");
              }}
              disabled={isView}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="file">Attachments</Label>
            {isView ? (
              task?.attachmentUrl ? (
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">
                    File: {task.fileName ?? "Unknown file"}
                  </p>
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
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  if (error) setError("");
                }}
                disabled={isView}
              />
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="pt-4">
          {!isView && <Button onClick={handleSubmit}>Save</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
