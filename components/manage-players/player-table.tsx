"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Player } from "@prisma/client";
import Typography from "../typography";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { Cancel01Icon, Move02Icon, UserMinus02Icon } from "hugeicons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { getPlayerName } from "@/lib/stringUtils";
import { deleteAPI } from "@/lib/APIUtils";
import { setUnknownErrorToastMessage } from "@/lib/apiResponseUtils";
import { toast } from "@/hooks/use-toast";
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
import { umami } from "@/lib/umami";

interface PlayerTableProps {
  className?: string;
  players?: Player[];
  customPlayers?: { firstName: string; lastName: string }[];
  isAddPlayers?: boolean;
  handleRemovePlayer?: (id: string) => void;
  handleRemoveCustomPlayer?: (index: number) => void;
  teamSlug?: string;
  clubSlug?: string;
}

export const PlayerTable: React.FC<PlayerTableProps> = ({
  className = "",
  players,
  isAddPlayers = false,
  handleRemoveCustomPlayer = () => {},
  customPlayers,
  handleRemovePlayer = () => {},
  teamSlug,
  clubSlug,
  ...props
}) => {
  const { push, refresh } = useRouter();
  const [playerToDelete, setPlayerToDelete] = useState<{
    uniqueName: string;
    id: string;
  } | null>(null);

  const handleClickOrderPlayers = () => {
    push("./sortieren");
  };

  const onDeletePlayer = async (playerId: string) => {
    const res = await deleteAPI("/api/player", {
      clubSlug: clubSlug,
      teamSlug: teamSlug,
      playerId: playerId,
    });
    if (!res.ok) {
      setUnknownErrorToastMessage();
      umami()?.track("error:remove-player-from-team");
    } else {
      toast({
        title: "Spieler erfolgreich entfernt",
      });
      umami()?.track("remove-player-from-team");
      refresh();
    }
  };

  return (
    <AlertDialog>
      <Table className={className} {...props}>
        <TableHeader>
          <TableRow>
            {!isAddPlayers && <TableHead className="w-[100px]">Pos.</TableHead>}
            <TableHead>Spieler</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players?.map((player: Player, i: number) => (
            <TableRow key={player.id}>
              {!isAddPlayers && (
                <TableCell className="font-medium">{i + 1}</TableCell>
              )}
              <TableCell>{getPlayerName(player)}</TableCell>
              <TableCell className="flex justify-end p-1.5">
                {!isAddPlayers && (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="p-2 w-60">
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="flex items-center gap-2 p-2 text-destructive"
                            onSelect={() =>
                              setPlayerToDelete({
                                uniqueName: getPlayerName(player),
                                id: player.id,
                              })
                            }
                          >
                            <UserMinus02Icon strokeWidth={2} />
                            {`${getPlayerName(player)} entfernen`}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>

                        <DropdownMenuItem
                          className="flex items-center gap-2 p-2"
                          onSelect={handleClickOrderPlayers}
                        >
                          <Move02Icon strokeWidth={2} />
                          Position verschieben
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
                {isAddPlayers && (
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    className="h-8 w-8 mt-1"
                    onClick={() => handleRemovePlayer(player.id)}
                  >
                    <Cancel01Icon strokeWidth={2} />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {customPlayers &&
            customPlayers.map((player, i) => (
              <TableRow key={i}>
                <TableCell>{`${player.firstName} ${player.lastName}`}</TableCell>
                <TableCell className="flex justify-end p-1.5">
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    className="h-8 w-8 mt-1"
                    onClick={() => handleRemoveCustomPlayer(i)}
                  >
                    <Cancel01Icon strokeWidth={2} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {!players && (
            <Typography variant="p-gray">
              Diese Mannschaft hat keine Spieler
            </Typography>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {`${playerToDelete?.uniqueName} entfernen`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Bist du dir sicher, dass du den Spieler entfernen möchtest?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onDeletePlayer(playerToDelete?.id || "");
                }}
              >
                Spieler entfernen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </TableBody>
      </Table>
    </AlertDialog>
  );
};
