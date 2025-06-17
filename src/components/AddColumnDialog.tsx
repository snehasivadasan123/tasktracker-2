import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (title: string) => void
  initialTitle?: string;

}
export const AddColumnDialog = ({ open, onClose, onSave, initialTitle = "" }: Props) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      setError("Column title is required.");
      return;
    }
    setError("");
    onSave(title.trim());
    setTitle("");
    onClose();
  }
  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setError("");
    }
  }, [open, initialTitle]);
  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className="rounded-none p-6">
        <DialogHeader>
          <DialogTitle>{initialTitle ? "Edit Column" : "Add Column"}</DialogTitle>
          <DialogTitle>
            Column
          </DialogTitle>

        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <label className="text-sm font-medium">Title</label>
          <input
            placeholder="Eg, In review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

}


