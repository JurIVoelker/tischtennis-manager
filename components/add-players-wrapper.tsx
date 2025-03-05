"use client";

import { TeamWithPlayers } from "@/types/prismaTypes";
import AddExistingPlayerDrawer from "./add-existing-player-drawer";
import { useState } from "react";
import { useMemo } from "react";
import { Player } from "@prisma/client";
import { PlayerTable } from "./manage-players/player-table";
import AddCustomPlayerForm from "./add-custom-player-form";
import Link from "next/link";
import { Cancel01Icon, Tick01Icon } from "hugeicons-react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import { postAPI } from "@/lib/APIUtils";
import { setUnknownErrorToastMessage } from "@/lib/apiResponseUtils";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface AddPlayersWrapperProps {
  teams: TeamWithPlayers[];
  clubSlug: string;
  teamSlug: string;
}

const AddPlayersWrapper: React.FC<AddPlayersWrapperProps> = ({
  teams,
  clubSlug,
  teamSlug,
}) => {
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const { push } = useRouter();
  const [customPlayers, setCustomPlayers] = useState<
    { firstName: string; lastName: string }[]
  >([]);

  const handleAddCustomPlayer = (data: {
    lastName: string;
    firstName: string;
  }) => {
    setCustomPlayers((prev) => [...prev, data]);
  };

  const handleRemoveCustomPlayer = (index: number) => {
    setCustomPlayers((prev) => prev.filter((_, i) => i !== index));
  };

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

  const onSave = async () => {
    const postPromises = selectedPlayers.map((player) =>
      postAPI("/api/player", {
        clubSlug,
        teamSlug,
        firstName: player.firstName,
        lastName: player.lastName,
      })
    );
    postPromises.push(
      ...customPlayers.map((player) =>
        postAPI("/api/player", { ...player, clubSlug, teamSlug })
      )
    );
    const res = await Promise.all(postPromises);
    if (!res.every((r) => r.ok)) {
      setUnknownErrorToastMessage();
    } else {
      toast({ title: "Spieler erfolgreich hinzugefügt" });
      push("./verwalten?refresh=true");
    }
  };

  return (
    <>
      <Card className="p-4 mb-6">
        <AddCustomPlayerForm handleAddCustomPlayer={handleAddCustomPlayer} />
      </Card>
      <AddExistingPlayerDrawer
        teams={teams}
        onChange={handleSelectPlayerId}
        value={selectedPlayerIds}
      />

      {(selectedPlayers.length > 0 || customPlayers.length > 0) && (
        <Card className="space-y-2 mt-6 p-4 mb-20">
          <PlayerTable
            players={selectedPlayers}
            isAddPlayers
            handleRemovePlayer={handleRemovePlayer}
            handleRemoveCustomPlayer={handleRemoveCustomPlayer}
            customPlayers={customPlayers}
          />
        </Card>
      )}
      <div className="flex gap-2 w-full bottom-0 left-0 | bg-gradient-to-t from-white to-white/0 p-6 fixed | md:static md:p-0 | md:bg-transparent">
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          href={"./verwalten"}
        >
          <Cancel01Icon strokeWidth={2}/>
          Abbrechen
        </Link>
        <Button
          className="w-full"
          disabled={!(selectedPlayers.length > 0 || customPlayers.length > 0)}
          onClick={onSave}
        >
          <Tick01Icon strokeWidth={2}/>
          Speichern
        </Button>
      </div>
    </>
  );
};

export default AddPlayersWrapper;
