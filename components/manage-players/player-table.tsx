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
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Move02Icon, UserMinus02Icon } from "hugeicons-react";

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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-2 w-60">
                  <Button className="w-full justify-start p-2" variant="ghost">
                    <UserMinus02Icon />
                    {`${player.firstName} entfernen`}
                  </Button>
                  <Button className="w-full justify-start p-2" variant="ghost">
                    <Move02Icon />
                    Position verschieben
                  </Button>
                </PopoverContent>
              </Popover>
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
