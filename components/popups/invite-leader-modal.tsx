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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Cancel01Icon,
  Copy01Icon,
  Mail01Icon,
  Tick01Icon,
} from "hugeicons-react";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { postAPI } from "@/lib/APIUtils";
import { useRouter } from "next/navigation";

interface InviteLeaderModalProps {
  teamName: string;
  children: React.ReactNode;
  clubSlug: string;
  teamSlug: string;
}

export default function InviteLeaderModal({
  teamName,
  children,
  clubSlug,
  teamSlug,
}: InviteLeaderModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [showInfiniteWarning, setShowInfiniteWarning] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [step, setStep] = useState(1);

  const { refresh } = useRouter();

  useEffect(() => {
    const isNameValid = name.trim().length > 0;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isTimeLimitValid = timeLimit !== "";
    setIsFormValid(isNameValid && isEmailValid && isTimeLimitValid);
  }, [name, email, timeLimit]);

  const onInvite = (name: string, email: string, timeLimit: string) => {
    // Simulating API call
    toast({ title: "Einladung senden..." });
    setTimeout(() => {
      console.log("Invited", { name, email, timeLimit });
      toast({ title: "Einladung erfolgreich per E-Mail versendet" });
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onInvite(name, email, timeLimit);
      resetForm();
    }
  };

  const resetForm = (isOpen = false) => {
    setName("");
    setEmail("");
    setTimeLimit("");
    setIsLinkCopied(false);
    setShowInfiniteWarning(false);
    setStep(1);
    setOpen(isOpen);
  };

  const generateInviteLink = async () => {
    // Simulating API call
    const res = await postAPI("/api/leader/invite-token", {
      clubSlug,
      teamSlug,
      name,
      email,
      timeLimit,
    });
    let token = "";
    if (typeof res.data === "object") {
      //@ts-expect-error parsing causes error
      token = res.data?.token;
    }
    setInviteLink(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "localhost:3000"
      }/${clubSlug}/${teamSlug}/invite?token=${token}`
    );
    refresh();
  };

  const copyInviteLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    }
  };

  const handleTimeLimitChange = (value: string) => {
    setTimeLimit(value);
    setShowInfiniteWarning(value === "infinite");
  };

  const handleContinue = async () => {
    setStep(2);
    if (isFormValid) {
      await generateInviteLink();
      setStep(3);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetForm}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mannschaftsführer einladen</DialogTitle>
          <DialogDescription>
            Lade einen neuen Mannschaftsführer für {teamName} ein
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
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
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timeLimit">Zeitlimit</Label>
                <Select onValueChange={handleTimeLimitChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Zeitlimit auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2weeks">2 Wochen</SelectItem>
                    <SelectItem value="1month">1 Monat</SelectItem>
                    <SelectItem value="2months">2 Monate</SelectItem>
                    <SelectItem value="infinite">Unbegrenzt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showInfiniteWarning && (
                <Alert>
                  <AlertTitle>Achtung</AlertTitle>
                  <AlertDescription>
                    Ein unbegrenztes Zeitlimit kann ein Sicherheitsrisiko
                    darstellen. Bitte verwenden Sie diese Option mit Vorsicht.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          {step === 2 && (
            <div className="py-12 flex justify-center items-center gap-2">
              <Loader2 className="animate-spin" size={24} />
              Generiere Einladungslink...
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4 py-4">
              <h4 className="text-sm font-medium">Einladungslink</h4>
              <div className="flex items-center gap-2">
                <Input
                  value={inviteLink || ""}
                  readOnly
                  className="flex-grow"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={copyInviteLink}
                  className="shrink-0"
                >
                  {isLinkCopied ? (
                    <Tick01Icon className="h-4 w-4" />
                  ) : (
                    <Copy01Icon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex justify-between">
                <Button type="submit" disabled>
                  <Mail01Icon className="mr-2 h-4 w-4" />
                  Als E-Mail senden
                </Button>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => resetForm()}
            >
              Abbrechen
            </Button>
            {step === 1 && (
              <Button
                type="button"
                onClick={handleContinue}
                disabled={!isFormValid}
              >
                Weiter
              </Button>
            )}
          </DialogFooter>
        </form>
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => resetForm()}
        >
          <Cancel01Icon className="h-4 w-4" />
          <span className="sr-only">Schließen</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
