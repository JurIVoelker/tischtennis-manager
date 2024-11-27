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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { SortablePlayerItem } from "./sortable-player-item";
import { Card } from "../ui/card";
import { DragDropVerticalIcon } from "hugeicons-react";
import { cn } from "@/lib/utils";
import { getPlayerName } from "@/lib/stringUtils";

interface PlayerTableProps {
  className?: string;
  players?: Player[];
}

export const SortablePlayerTable: React.FC<PlayerTableProps> = ({
  className = "",
  players,
  ...props
}) => {
  const [listItems, setListItems] = useState(
    players?.map((player, id) => ({ player: player, id: id + 1 })) || []
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setListItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      autoScroll={false}
    >
      <SortableContext items={listItems}>
        <Table className={cn(className, "overflow-hidden")} {...props}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Pos.</TableHead>
              <TableHead>Spieler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listItems?.map((playerList, i) => (
              <TableRow key={playerList.id}>
                <TableCell className="font-medium">{i + 1}</TableCell>
                <TableCell className="py-0 pr-2">
                  <div className="bg-secondary rounded-sm">
                    <SortablePlayerItem id={playerList.id}>
                      <Card className="py-1.5 px-2 flex gap-2 items-center rounded-sm">
                        <DragDropVerticalIcon />
                        {getPlayerName(
                          playerList.player,
                          listItems.map((p) => p.player)
                        )}
                      </Card>
                    </SortablePlayerItem>
                  </div>
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
      </SortableContext>
    </DndContext>
  );
};
