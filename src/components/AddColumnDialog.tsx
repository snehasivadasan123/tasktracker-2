import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AddColumnDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (params: { title: string }) => void;
  initialTitle?: string;
}

interface ColumnFormData {
  title: string;
}

export const AddColumnDialog = ({
  open,
  onClose,
  onSave,
  initialTitle = "",
}: AddColumnDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ColumnFormData>({
    defaultValues: { title: "" },
  });

  useEffect(() => {
    if (open) {
      reset({ title: initialTitle || "" });
    }
  }, [initialTitle, open, reset]);

  const onSubmit = (data: ColumnFormData) => {
    onSave({ title: data.title.trim() });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialTitle ? "Edit Column" : "Add Column"}</DialogTitle>
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
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
