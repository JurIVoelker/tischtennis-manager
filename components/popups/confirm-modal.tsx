import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmButtonMessage?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Bist du sicher?",
  description = "Diese Aktion kann nicht rückgängig gemacht werden.",
  isDestructive = false,
  confirmButtonMessage = "Bestätigen",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            onClick={onConfirm}
            variant={isDestructive ? "destructive" : "default"}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {confirmButtonMessage}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
