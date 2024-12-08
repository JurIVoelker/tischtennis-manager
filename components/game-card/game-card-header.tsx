"use client";
import Typography from "../typography";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Copy01Icon,
  Delete02Icon,
  LeftToRightListNumberIcon,
  PencilEdit02Icon,
} from "hugeicons-react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getInfoTextString } from "@/lib/stringUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MatchWithLineupAndLocation } from "@/types/prismaTypes";
import { useRouter } from "next/navigation";
import { useIsPermitted } from "@/hooks/use-has-permission";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";
import { setUnknownErrorToastMessage } from "@/lib/apiResponseUtils";
import { deleteAPI } from "@/lib/APIUtils";

interface GameCardHeaderProps {
  match: MatchWithLineupAndLocation;
  teamSlug: string;
  clubSlug: string;
}

const GameCardHeader: React.FC<GameCardHeaderProps> = ({
  match,
  teamSlug,
  clubSlug,
}) => {
  const isGameCardOptionsVisible = useIsPermitted("view:game-card-options");
  const { push, refresh } = useRouter();
  const [matchToDelete, setMatchToDelete] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const handleCopy = () => {
    const text = getInfoTextString(match);
    if (!text) {
      toast({
        title: "Fehler beim Kopieren",
        description: (
          <div className="mt-2 w-[340px] flex gap-2">
            <Typography variant="p" className="leading-1">
              Beim kopieren des Infotextes ist ein Fehler aufgetreten.
            </Typography>
          </div>
        ),
      });
      return;
    }
    navigator.clipboard.writeText(text);
    toast({
      title: "Infotext kopiert",
      description: (
        <div className="mt-2 w-[340px] flex gap-2">
          <Typography variant="p" className="leading-1">
            {"Der Infotext für das Spiel gegen "}
            <strong>{match.enemyClubName}</strong> wurde erfolgreich in die
            Zwischenablage kopiert.
          </Typography>
        </div>
      ),
    });
  };

  const handleEdit = () => {
    push(`./${teamSlug}/spiel/anpassen/${match.id}`);
  };

  const handleConfigureLineup = () => {
    push(`./${teamSlug}/spiel/aufstellung/verwalten/${match.id}`);
  };

  const onDeleteMatch = async () => {
    if (!matchToDelete) setUnknownErrorToastMessage();
    const res = await deleteAPI("/api/match", {
      matchId: matchToDelete?.id,
      clubSlug,
      teamSlug,
    });
    if (!res.ok) {
      setUnknownErrorToastMessage();
    } else {
      refresh();
      toast({ title: "Spiel erfolgreich gelöscht" });
    }
  };

  const dropdownOptions = [
    {
      name: "Infotext kopieren",
      IconComponent: Copy01Icon,
      isDisabled: !match.lineups.length,
      handler: handleCopy,
    },
    {
      name: "Spieldaten anpassen",
      IconComponent: PencilEdit02Icon,
      handler: handleEdit,
    },
    {
      name: "Aufstellungen verwalten",
      IconComponent: LeftToRightListNumberIcon,
      handler: handleConfigureLineup,
    },
    {
      name: "Spiel löschen",
      IconComponent: Delete02Icon,
      handler: onDeleteMatch,
      isDeleteMatch: true,
    },
  ];

  return (
    <AlertDialog>
      <div className="flex justify-between mb-6 gap-4 h-10 items-center">
        <Typography variant="h4">{match.enemyClubName}</Typography>
        <div className="inline-flex gap-2 flex-wrap items-center">
          <Badge variant="secondary" className="h-fit">
            {match.isHomeGame ? "Heim" : "Auswährts"}
          </Badge>
          {isGameCardOptionsVisible && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon-lg">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 p-2">
                {dropdownOptions.map(
                  (
                    {
                      name,
                      IconComponent,
                      handler,
                      isDisabled,
                      isDeleteMatch = false,
                    },
                    id
                  ) => (
                    <>
                      {isDeleteMatch && (
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            key={id}
                            onSelect={() => {
                              setMatchToDelete({
                                name: match.enemyClubName,
                                id: match.id,
                              });
                            }}
                            className="flex items-center gap-2 p-2"
                            disabled={isDisabled}
                          >
                            <IconComponent />
                            {name}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      )}
                      {!isDeleteMatch && (
                        <DropdownMenuItem
                          key={id}
                          onSelect={handler}
                          className="flex items-center gap-2 p-2"
                          disabled={isDisabled}
                        >
                          <IconComponent />
                          {name}
                        </DropdownMenuItem>
                      )}
                    </>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Spiel gegen {matchToDelete?.name} löschen
              </AlertDialogTitle>
              <AlertDialogDescription>
                Bist du dir sicher, dass du das Spiel löschen möchtest?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteMatch}>
                Spiel löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>
      </div>
    </AlertDialog>
  );
};

export default GameCardHeader;
