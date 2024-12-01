"use client";

import { TeamWithPlayers } from "@/types/prismaTypes";
import AddExistingPlayerDrawer from "./add-existing-player-drawer";
import { useState } from "react";
import { useMemo } from "react";
import { Player } from "@prisma/client";
import { PlayerTable } from "./manage-players/player-table";

interface AddPlayersWrapperProps {
  teams: TeamWithPlayers[];
}

const AddPlayersWrapper: React.FC<AddPlayersWrapperProps> = ({ teams }) => {
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  const handleSelectPlayerId = (playerIds: string[]) => {
    playerIds.forEach((playerId) => {
      if (!selectedPlayerIds.includes(playerId)) {
        setSelectedPlayerIds((prev) => [...prev, playerId]);
      }
    });
  };

  const allPlayers = useMemo(
    () => teams.flatMap((team) => team.players),
    [teams]
  );

  const selectedPlayers: Player[] = useMemo(
    () =>
      selectedPlayerIds.map((id) =>
        allPlayers.find((player) => player.id === id)
      ),
    [selectedPlayerIds, allPlayers]
  ).filter((player) => player !== undefined) as Player[];

  const handleRemovePlayer = (id: string) => {
    setSelectedPlayerIds((prev) => prev.filter((playerId) => playerId !== id));
  };

  return (
    <>
      <div className="space-y-2 mb-2">
        {selectedPlayers.length > 0 && (
          <PlayerTable
            players={selectedPlayers}
            isAddPlayers
            handleRemovePlayer={handleRemovePlayer}
          />
        )}
      </div>
      <AddExistingPlayerDrawer
        teams={teams}
        onChange={handleSelectPlayerId}
        value={selectedPlayerIds}
      />
    </>
  );
};

export default AddPlayersWrapper;
