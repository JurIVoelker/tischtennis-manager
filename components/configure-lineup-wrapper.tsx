"use client";
import { Player } from "@prisma/client";
import { SortablePlayerTable } from "./sort-players/sortable-player-table";
import { useMemo, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { getPlayerName } from "@/lib/stringUtils";
import AddExistingPlayerDrawer from "./add-existing-player-drawer";
import { TeamWithPlayers } from "@/types/prismaTypes";
import { arrayMove } from "@dnd-kit/sortable";
import Typography from "./typography";
import { Card } from "./ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Cancel01Icon, Tick01Icon } from "hugeicons-react";

interface ConfigureLineupWrapperProps {
  mainPlayers: Player[];
  disabledPlayerIds: string[];
  allTeams: TeamWithPlayers[];
  teamName: string;
}

const ConfigureLineupWrapper: React.FC<ConfigureLineupWrapperProps> = ({
  mainPlayers,
  disabledPlayerIds,
  teamName,
  allTeams,
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const remainingMainPlayers = useMemo(
    () =>
      mainPlayers.filter(
        (player) =>
          !selectedPlayers.find(
            (selectedPlayer) => selectedPlayer.id === player.id
          )
      ),
    [mainPlayers, selectedPlayers]
  );

  const handleSortItems = (activeId: string, overId: string) => {
    setSelectedPlayers((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === activeId);
      const newIndex = prev.findIndex((item) => item.id === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSelectPlayer = (playerId: string) => {
    const playerToAdd = mainPlayers.find((player) => player.id === playerId);
    if (playerToAdd) setSelectedPlayers((prev) => [...prev, playerToAdd]);
  };

  const handleSelectExistingPlayer = (playerIds: string[]) => {
    const playersToAdd: Player[] = [];
    allTeams.forEach((team) => {
      team.players.forEach((player) => {
        if (playerIds.includes(player.id)) playersToAdd.push(player);
      });
    });

    setSelectedPlayers((prev) => [...prev, ...playersToAdd]);
  };

  const handleRemovePlayer = (id: string) => {
    setSelectedPlayers((prev: Player[]) =>
      prev.filter((player: Player) => player.id !== id)
    );
  };

  return (
    <>
      <Card className="p-4">
        {selectedPlayers.length > 0 && (
          <>
            <Typography variant="p-gray" className="mb-4">
              Ausgewählte Spieler
            </Typography>
            <SortablePlayerTable
              players={selectedPlayers.map((player) => ({
                player,
                id: player.id,
              }))}
              disabledPlayerIds={disabledPlayerIds}
              isRemovable
              handleRemovePlayer={handleRemovePlayer}
              handleOnChange={handleSortItems}
            />
          </>
        )}

        {selectedPlayers.length === 0 && (
          <Typography variant="p-gray">
            Wähle Spieler aus, um sie zu der Aufstellung hinzuzufügen
          </Typography>
        )}
      </Card>
      {remainingMainPlayers.length > 0 && (
        <Card className="space-y-2 p-4">
          <Typography variant="p-gray">Stammspieler</Typography>
          {remainingMainPlayers.map((player) => (
            <Button
              key={player.id}
              onClick={() => handleSelectPlayer(player.id)}
              className="w-full"
              variant={"secondary"}
            >
              {getPlayerName(player, remainingMainPlayers)}
            </Button>
          ))}
        </Card>
      )}
      <AddExistingPlayerDrawer
        teams={allTeams.filter((team) => team.name !== teamName)}
        value={selectedPlayers.map((player) => player.id)}
        onChange={handleSelectExistingPlayer}
        isExchangePlayers
      />
      <div className="flex gap-2 w-full bottom-0 left-0 | bg-gradient-to-t from-white to-white/0 p-6 fixed | md:static md:p-0 | md:bg-transparent">
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          href={"../../../"}
        >
          <Cancel01Icon />
          Abbrechen
        </Link>
        <Button
          type="submit"
          className="w-full"
          disabled={selectedPlayers.length <= 0}
        >
          <Tick01Icon />
          Speichern
        </Button>
      </div>
    </>
  );
};

export default ConfigureLineupWrapper;
