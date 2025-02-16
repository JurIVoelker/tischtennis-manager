"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Add01Icon } from "hugeicons-react";
import { postAPI } from "@/lib/APIUtils";

interface AddTeamModalProps {
  clubSlug: string;
}

export const AddTeamModal: React.FC<AddTeamModalProps> = ({ clubSlug }) => {
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (!teamName.trim()) {
      setError("Team Name is required");
      return;
    }

    const res = await postAPI("/api/team", {
      teamName: teamName.trim(),
      clubSlug,
    });

    // @ts-expect-error error will be returned because of zod
    if (res?.error?.error?.length) {
      // @ts-expect-error error will be returned because of zod
      setError(res?.error?.error[0]);
      setLoading(false);
    } else {
      setLoading(false);
      setTeamName("");
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-14 flex w-full">
          <Add01Icon /> Mannschaft hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neue Mannschaft hinzufügen</DialogTitle>
          <DialogDescription>
            Erstelle eine neue Mannschaft. Du kannst später einen
            Mannschaftsführer hinzufügen. Der Manschaftsname sollte eindeutig
            sein.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className=" items-center gap-4">
              <Label htmlFor="teamName">Mannschaftsname</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button type="submit" isLoading={isLoading}>
              Hinzufügen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
