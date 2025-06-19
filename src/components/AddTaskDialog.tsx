"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (params: { title: string; description: string; file: File | null }) => void;
  task?: {
    title: string;
    description: string;
    attachmentUrl?: string;
    fileName?: string;
  } | null;
  isEdit?: boolean;
  isView?: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  file: FileList | null;
}

export const AddTaskDialog = ({
  open,
  onClose,
  onSave,
  task,
  isEdit = false,
  isView = false,
}: AddTaskDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
    },
  });
  useEffect(() => {
    if (open) {
      reset({
        title: task?.title || "",
        description: task?.description || "",
      });
    }
  }, [open, task, reset]);

  const file = watch("file");

  const onSubmit = (data: TaskFormData) => {
    onSave({
      title: data.title.trim(),
      description: data.description.trim(),
      file: data.file?.[0] || null,
    });
    reset();
    onClose();
  };

  if (isView && task) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <p className="mt-1">{task.title}</p>
            </div>
            <div>
              <Label>Description</Label>
              <p className="mt-1">{task.description}</p>
            </div>
            {task.attachmentUrl && (
              <div>
                <Label>Attachment</Label>
                <p className="mt-1">
                  <a
                    href={task.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {task.fileName || "View Attachment"}
                  </a>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", {
                required: "Title is required",
                validate: (value) =>
                  value.trim() !== "" || "Title cannot be empty or whitespace",
              })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}

            />

          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Attachment</Label>
            <Input id="file" type="file" {...register("file")} />


            {file?.[0] && (
              <p className="text-sm text-gray-500">Selected: {file[0].name}</p>
            )}


            {!file?.[0] && task?.attachmentUrl && (
              <p className="text-sm text-blue-500">
                Existing:{" "}
                <a
                  href={task.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {task.fileName || "View Attachment"}
                </a>
              </p>
            )}
          </div>


          <div className="flex justify-end">
            <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
