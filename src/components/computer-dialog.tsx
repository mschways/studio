'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ComputerForm } from "./computer-form";
import type { Computer } from "@/lib/types";
import { ComputerFormData } from "@/lib/schema";
import { addComputer, updateComputer } from "@/lib/actions";
import { useState } from "react";

interface ComputerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  computer?: Computer | null; // For editing
}

export function ComputerDialog({ isOpen, onOpenChange, computer }: ComputerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ComputerFormData) => {
    setIsSubmitting(true);
    let result;
    if (computer) {
      result = await updateComputer({ ...data, id: computer.id });
    } else {
      result = await addComputer(data);
    }
    setIsSubmitting(false);
    
    if (result.success) {
      onOpenChange(false); // Close dialog on success
    }
    return result; // Return result for form to handle toast
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-primary">{computer ? "Edit Computer" : "Add New Computer"}</DialogTitle>
          <DialogDescription>
            {computer ? "Update the details of this computer." : "Enter the details for the new computer."}
          </DialogDescription>
        </DialogHeader>
        <ComputerForm
          computer={computer}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
