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

interface ChangeUserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetailsChange: (newEmail: string, newName: string) => void;
  id: string;
  currentEmail: string;
  currentName: string;
  clubSlug: string;
  isAdmin?: boolean;
}

export function ChangeLeaderDetailsModal({
  isOpen,
  onClose,
  id,
  onDetailsChange,
  clubSlug,
  currentEmail,
  currentName,
  isAdmin,
}: ChangeUserDetailsModalProps) {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!newEmail && !newName) {
      setError(
        "Bitte geben Sie eine neue E-Mail-Adresse oder einen neuen Namen ein"
      );
      setLoading(false);
      return;
    }

    if (newEmail && !/\S+@\S+\.\S+/.test(newEmail)) {
      setError("Ungültiges E-Mail-Format");
      setLoading(false);
      return;
    }

    try {
      if (!isAdmin) {
        await putAPI("/api/leader", {
          leaderId: id,
          email: newEmail || currentEmail || null,
          name: newName || currentName || null,
          clubSlug,
        });
      } else {
        await putAPI("/api/admin", {
          adminId: id,
          email: newEmail || currentEmail || null,
          fullName: newName || currentName || null,
          clubSlug,
        });
      }
      onDetailsChange(newEmail || currentEmail, newName || currentName);
      router.refresh();
      onClose();
    } catch {
      setError(
        "Fehler beim Aktualisieren der Benutzerdetails. Bitte versuchen Sie es erneut."
      );
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isAdmin ? "Admin" : "Mannschaftsführer"}-Details ändern
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-email">Aktuelle E-Mail-Adresse</Label>
            <Input id="current-email" value={currentEmail} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-email">Neue E-Mail-Adresse (optional)</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Neue E-Mail-Adresse eingeben..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current-name">Aktueller Name</Label>
            <Input id="current-name" value={currentName} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-name">Neuer Name (optional)</Label>
            <Input
              id="new-name"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Neuen Namen eingeben..."
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Wird gespeichert..." : "Speichern"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
