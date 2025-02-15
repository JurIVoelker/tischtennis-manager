"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Cancel01Icon } from "hugeicons-react";
import { postAPI } from "@/lib/APIUtils";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface AddLeaderModalProps {
  teamName: string;
  children: React.ReactNode;
  teamId: string;
  clubSlug: string;
}

export default function AddLeaderModal({
  teamId,
  teamName,
  children,
  clubSlug,
}: AddLeaderModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { refresh } = useRouter();

  useEffect(() => {
    const isNameValid = name.trim().length > 0;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsFormValid(isNameValid && isEmailValid);
  }, [name, email]);

  const onAdd = async (name: string, email: string) => {
    setLoading(true);
    const res = await postAPI("/api/leader", {
      teamId,
      fullName: name,
      email: email.toLowerCase().trim(),
      clubSlug,
    });
    setLoading(false);
    if (res.error) {
      toast({
        // @ts-expect-error error message is available through zod
        title: `Fehler: ${res.error[0]?.message || "Unbekannter Fehler"}`,
      });
    } else {
      resetForm();
      refresh();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onAdd(name, email);
    }
  };

  const resetForm = (isOpen = false) => {
    setName("");
    setEmail("");
    setOpen(isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mannschaftsführer hinzufügen</DialogTitle>
          <DialogDescription>
            Fülle das Formular aus um einen neuen Mannschaftsführer für{" "}
            {teamName} hinzuzufügen.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => resetForm()}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={!isFormValid} isLoading={isLoading}>
              Hinzufügen
            </Button>
          </DialogFooter>
        </form>
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => resetForm()}
        >
          <Cancel01Icon className="h-4 w-4" />
          <span className="sr-only">Abbrechen</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
