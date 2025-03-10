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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SortablePlayerItem } from "./sortable-player-item";
import { Card } from "../ui/card";
import { Cancel01Icon, DragDropVerticalIcon } from "hugeicons-react";
import { cn } from "@/lib/utils";
import { getPlayerName } from "@/lib/stringUtils";
import { Button } from "../ui/button";

interface PlayerTableProps {
  className?: string;
  players?: ListItem[];
  disabledPlayerIds?: string[];
  isRemovable?: boolean;
  handleRemovePlayer?: (id: string) => void;
  handleOnChange?: (activeId: string, overId: string) => void;
}

type ListItem = { player: Player; id: string };

export const SortablePlayerTable: React.FC<PlayerTableProps> = ({
  className = "",
  players,
  disabledPlayerIds,
  isRemovable = false,
  handleOnChange = () => {},
  handleRemovePlayer = () => {},
  ...props
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      handleOnChange(String(active?.id), String(over?.id));
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      autoScroll={false}
    >
      <SortableContext items={players || []}>
        <Table className={cn(className, "overflow-hidden")} {...props}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Pos.</TableHead>
              <TableHead>Spieler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players?.map((playerList, i) => {
              const isDisabled = disabledPlayerIds?.includes(
                playerList.player.id
              );

              return (
                <TableRow key={playerList.id}>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell className="py-0 pr-2">
                    <div className="bg-secondary rounded-sm">
                      <SortablePlayerItem
                        id={playerList.id}
                        isDisabled={isDisabled}
                      >
                        <Card className="py-1.5 px-2  rounded-sm flex justify-between">
                          <div className="flex gap-2 items-center">
                            <DragDropVerticalIcon
                              className={isDisabled ? "opacity-15" : ""}
                            />
                            <Typography variant="p">
                              {getPlayerName(
                                playerList.player,
                                players.map((p) => p?.player)
                              )}
                            </Typography>
                          </div>
                          {isRemovable && (
                            <Button
                              variant="destructive"
                              className="h-7 w-7 z-10"
                              size="icon"
                              onClick={() => {
                                handleRemovePlayer(playerList.id);
                              }}
                            >
                              <Cancel01Icon strokeWidth={2} />
                            </Button>
                          )}
                        </Card>
                      </SortablePlayerItem>
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
      </SortableContext>
    </DndContext>
  );
};
