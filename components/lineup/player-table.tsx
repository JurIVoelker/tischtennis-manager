import { Player } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card } from "../ui/card";
import { Cancel01Icon } from "hugeicons-react";
import Typography from "../typography";
import { getPlayerName } from "@/lib/stringUtils";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface PlayerTableProps {
  players: Player[];
  handleRemovePlayer?: (id: string) => void;
  className?: string;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  className,
  handleRemovePlayer = () => {},
  ...props
}) => {
  return (
    <>
      <Table className={cn(className, "overflow-hidden")} {...props}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Pos.</TableHead>
            <TableHead>Spieler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players?.map((player, i) => {
            return (
              <TableRow key={player.id}>
                <TableCell className="font-medium">{i + 1}</TableCell>
                <TableCell className="py-0 pr-2">
                  <div className="bg-secondary rounded-sm">
                    <Card className="py-1.5 px-2  rounded-sm flex justify-between">
                      <div className="flex gap-2 items-center">
                        <Typography variant="p" className="pl-3">
                          {getPlayerName(player)}
                        </Typography>
                      </div>
                      <Button
                        variant="destructive"
                        className="h-7 w-7 z-10"
                        size="icon"
                        onClick={() => {
                          handleRemovePlayer(player.id);
                        }}
                      >
                        <Cancel01Icon strokeWidth={2} />
                      </Button>
                    </Card>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {!Boolean(players?.length) && (
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="p-gray">
                  Keine Spieler vorhanden
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default PlayerTable;
