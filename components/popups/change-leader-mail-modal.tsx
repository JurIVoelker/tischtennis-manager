"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { putAPI } from "@/lib/APIUtils";
import { useRouter } from "next/navigation";

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailChange: (newEmail: string) => void;
  id: string;
  currentEmail: string;
  clubSlug: string;
}

export function ChangeEmailModal({
  isOpen,
  onClose,
  id,
  onEmailChange,
  clubSlug,
  currentEmail,
}: ChangeEmailModalProps) {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!newEmail) {
      setError("E-Mail ist erforderlich");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setError("Ungültiges E-Mail-Format");
      return;
    }

    try {
      await putAPI("/api/leader", {
        leaderId: id,
        email: newEmail,
        clubSlug,
      });
      onEmailChange(newEmail);
      router.refresh();
    } catch {
      setError(
        "Fehler beim Aktualisieren der E-Mail. Bitte versuchen Sie es erneut."
      );
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>E-Mail-Adresse von Mannschaftsführer ändern</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-email">Aktuelle E-Mail-Adresse</Label>
            <Input id="current-email" value={currentEmail} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-email">Neue E-Mail-Adresse</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Neue E-Mail-Adresse eingeben..."
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Speichern
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
