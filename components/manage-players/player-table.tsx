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
import { Move02Icon, UserMinus02Icon } from "hugeicons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface PlayerTableProps {
  className?: string;
  players?: Player[];
}

export const PlayerTable: React.FC<PlayerTableProps> = ({
  className = "",
  players,
  ...props
}) => {
  return (
    <Table className={className} {...props}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Pos.</TableHead>
          <TableHead>Spieler</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players?.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="font-medium">
              {/* TODO: Player position {player?.position || 1} */}
              {1}
            </TableCell>
            <TableCell>{player.firstName}</TableCell>
            <TableCell className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 w-60">
                  <DropdownMenuItem className="flex items-center gap-2 p-2">
                    <UserMinus02Icon />
                    {`${player.firstName} entfernen`}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 p-2">
                    <Move02Icon />
                    Position verschieben
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
