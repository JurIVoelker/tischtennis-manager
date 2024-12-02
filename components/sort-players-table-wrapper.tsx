"use client";

import { useState } from "react";
import { SortablePlayerTable } from "./sort-players/sortable-player-table";
import { Player } from "@prisma/client";
import { arrayMove } from "@dnd-kit/sortable";

interface SortPlayersTableWrapperProps {
  defaultPlayers: Player[];
}

const SortPlayersTableWrapper: React.FC<SortPlayersTableWrapperProps> = ({
  defaultPlayers,
}) => {
  const [players, setPlayers] = useState(
    defaultPlayers.map((player, index) => ({ player, id: index.toString() }))
  );

  const handleSortItems = (activeId: string, overId: string) => {
    setPlayers((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === activeId);
      const newIndex = prev.findIndex((item) => item.id === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };
  return (
    <>
      <SortablePlayerTable
        className="mt-16"
        players={players}
        handleOnChange={handleSortItems}
      />
    </>
  );
};

export default SortPlayersTableWrapper;
