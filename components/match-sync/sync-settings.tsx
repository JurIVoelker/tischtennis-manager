"use client";
import { Settings } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { SettingsIcon } from "lucide-react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useState } from "react";
import { postAPI } from "@/lib/APIUtils";
import { toast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/store";

interface SyncSettingsProps {
  settings: Settings | null;
  className?: string;
}

type SettingsState = Omit<Settings, "id">;

const SyncSettings = (props: SyncSettingsProps) => {
  const { settings } = props;

  const [isLoading, setLoading] = useState(false);
  const [settingsState, setSettingsState] = useState<SettingsState>(
    settings || { autoSync: false, includeRRSync: false }
  );
  const [isOpen, setIsOpen] = useState(false);

  const { clubSlug } = useUserStore();

  const onSaveSettings = async () => {
    setLoading(true);

    const { error } = await postAPI("/api/settings/sync", {
      autoSync: settingsState?.autoSync,
      includeRRSync: settingsState?.includeRRSync,
      clubSlug,
    });

    if (error) {
      toast({
        title: "Fehler",
        description: "Einstellungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
      console.error(error);
    } else {
      toast({
        title: "Erfolg",
        description: "Einstellungen wurden erfolgreich gespeichert.",
      });
      setIsOpen(false);
      document.location.reload();
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className={props.className}>
        <Button>
          <SettingsIcon /> Einstellungen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Synchronisationseinstellungen</DialogTitle>
        <DialogDescription>
          Stelle deine Synchronisationseinstellungen ein.
        </DialogDescription>
        <form
          className="space-y-3 mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSaveSettings();
          }}
        >
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-sync-switch"
              checked={settingsState?.autoSync}
              onCheckedChange={() =>
                setSettingsState((prev) => ({
                  ...prev,
                  autoSync: !prev.autoSync,
                }))
              }
            />
            <Label htmlFor="auto-sync-switch">
              Automatische Synchronisation
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="include-rr-sync-switch"
              checked={settingsState?.includeRRSync}
              onCheckedChange={() =>
                setSettingsState((prev) => ({
                  ...prev,
                  includeRRSync: !prev.includeRRSync,
                }))
              }
            />
            <Label htmlFor="include-rr-sync-switch">
              Rückrunde Synchronisieren
            </Label>
          </div>
        </form>
        <DialogFooter>
          <Button onClick={onSaveSettings} isLoading={isLoading}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SyncSettings;
