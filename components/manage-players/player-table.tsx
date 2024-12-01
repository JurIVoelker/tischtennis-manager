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

interface PlayerTableProps {
  className?: string;
  players?: Player[];
  customPlayers?: { firstName: string; lastName: string }[];
  isAddPlayers?: boolean;
  handleRemovePlayer?: (id: string) => void;
  handleRemoveCustomPlayer?: (index: number) => void;
}

export const PlayerTable: React.FC<PlayerTableProps> = ({
  className = "",
  players,
  isAddPlayers = false,
  handleRemoveCustomPlayer = () => {},
  customPlayers,
  handleRemovePlayer = () => {},
  ...props
}) => {
  const { push } = useRouter();

  const handleClickOrderPlayers = () => {
    push("./sortieren");
  };

  return (
    <Table className={className} {...props}>
      <TableHeader>
        <TableRow>
          {!isAddPlayers && <TableHead className="w-[100px]">Pos.</TableHead>}
          <TableHead>Spieler</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players?.map((player, i) => (
          <TableRow key={player.id}>
            {!isAddPlayers && (
              <TableCell className="font-medium">{i + 1}</TableCell>
            )}
            <TableCell>{getPlayerName(player, players)}</TableCell>
            <TableCell className="flex justify-end p-1.5">
              {!isAddPlayers && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-2 w-60">
                    <DropdownMenuItem className="flex items-center gap-2 p-2">
                      <UserMinus02Icon />
                      {`${getPlayerName(player, players)} entfernen`}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 p-2"
                      onSelect={handleClickOrderPlayers}
                    >
                      <Move02Icon />
                      Position verschieben
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {isAddPlayers && (
                <Button
                  variant={"destructive"}
                  size={"icon"}
                  className="h-8 w-8 mt-1"
                  onClick={() => handleRemovePlayer(player.id)}
                >
                  <Cancel01Icon />
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
                  <Cancel01Icon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        {!players && (
          <Typography variant="p-gray">
            Diese Mannschaft hat keine Spieler
          </Typography>
        )}
      </TableBody>
    </Table>
  );
};
