"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAPI } from "@/lib/APIUtils";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteLeaderDialogProps {
  leaderName: string;
  open: boolean;
  leaderId: string;
  clubSlug: string;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
}

export function DeleteLeaderDialog({
  leaderName,
  leaderId,
  clubSlug,
  open,
  isAdmin,
  onOpenChange,
}: DeleteLeaderDialogProps) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    if (!isAdmin) {
      const { error } = await deleteAPI("/api/leader", { leaderId, clubSlug });
      if (error) {
        console.error(error);
      }
    } else {
      // TODO+
      await deleteAPI("/api/admin", { adminId: leaderId, clubSlug });
    }
    setLoading(false);
    router.refresh();
    // onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {isAdmin ? "Admin" : "Mannschaftsführer"} löschen
          </DialogTitle>
          <DialogDescription>
            Sind Sie sicher, dass Sie den{" "}
            {isAdmin ? "Admin" : "Mannschaftsführer"} &quot;{leaderName}
            &quot; löschen möchten? Diese Aktion kann nicht rückgängig gemacht
            werden.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            Löschen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
