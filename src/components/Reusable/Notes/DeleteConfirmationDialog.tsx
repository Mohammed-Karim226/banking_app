"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { useState } from "react";
import { deleteNote } from "@/src/utils/actions/user.actions"; // Make sure the path is correct
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import Image from "next/image";
import { Danger } from "iconsax-react";

interface DeleteConfirmationDialogProps {
  noteId: string;
  onDeleteSuccess: () => void; // A function to be called on successful deletion
}

const DeleteConfirmationDialog = ({
  noteId,
  onDeleteSuccess,
}: DeleteConfirmationDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteNote({ noteId });
      toast.success("Note deleted successfully.", {
        position: "bottom-right",
      });
      onDeleteSuccess();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete note.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex justify-center items-start p-1">
          <Trash size="16" color="#C62E2E" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white gap-0 dark:bg-stone-500 dark:border-stone-700">
        <DialogTitle className="flex justify-start items-center gap-1">
          <Danger size="32" color="#C62E2E " />
          Delete Note
        </DialogTitle>
        <DialogDescription className="mb-4 mt-1  dark:text-slate-900">
          Are you sure you want to delete this note? This action cannot be
          undone.
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="dark:border-stone-700 dark:text-slate-900"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-500 dark:border-stone-700 dark:text-slate-900 text-white"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
