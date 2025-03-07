"use client";
import { MatchAvailabilityVote, Player } from "@prisma/client";
import { SortablePlayerTable } from "./sort-players/sortable-player-table";
import { useMemo, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { getPlayerName } from "@/lib/stringUtils";
import AddExistingPlayerDrawer from "./add-existing-player-drawer";
import {
  LineupWithPlayers,
  matchAvailablilites,
  MatchAvailablilites,
  TeamWithPlayers,
} from "@/types/prismaTypes";
import { arrayMove } from "@dnd-kit/sortable";
import Typography from "./typography";
import { Card } from "./ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Cancel01Icon, HelpCircleIcon, Tick01Icon } from "hugeicons-react";
import AvailabilityColorsLegend from "./availibility-colors-legend";
import { putAPI } from "@/lib/APIUtils";
import { setUnknownErrorToastMessage } from "@/lib/apiResponseUtils";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ConfigureLineupWrapperProps {
  mainPlayers: Player[];
  disabledPlayerIds: string[];
  allTeams: TeamWithPlayers[];
  teamName: string;
  matchAvailablilityVotes: MatchAvailabilityVote[];
  defaultLineup: LineupWithPlayers[];
  clubSlug: string;
  teamSlug: string;
  matchId: string;
}

const ConfigureLineupWrapper: React.FC<ConfigureLineupWrapperProps> = ({
  mainPlayers,
  disabledPlayerIds,
  teamName,
  allTeams,
  matchAvailablilityVotes,
  defaultLineup = [],
  clubSlug,
  teamSlug,
  matchId,
}) => {
  const { push } = useRouter();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>(
    defaultLineup.map((lineup) => lineup.player)
  );
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
    if (playerToAdd)
      setSelectedPlayers((prevList) => {
        if (prevList.length === 0) {
          return [playerToAdd];
        }

        const customPlayers = prevList.filter(
          (player) => !mainPlayers.some((p) => p.id === player.id)
        );
        const customPlayerIndicies = customPlayers.map((player) =>
          prevList.findIndex((p) => p.id === player.id)
        );

        const listWithNewPlayer = [...prevList, playerToAdd];
        const newList: Player[] = mainPlayers.filter((player) =>
          listWithNewPlayer.some((p) => p.id === player.id)
        );

        customPlayerIndicies.forEach((index, i) => {
          newList.splice(index, 0, customPlayers[i]);
        });
        return newList;
      });
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

  const onSave = async () => {
    const res = await putAPI("/api/lineup", {
      playerIds: selectedPlayers.map((player) => player.id),
      matchId,
      clubSlug,
      teamSlug,
    });
    if (!res.ok) {
      setUnknownErrorToastMessage();
    } else {
      toast({ title: "Aufstellung gespeichert" });
      push("../../../?refresh=true");
    }
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
          {remainingMainPlayers.map((player) => {
            const _availability =
              matchAvailablilityVotes.find(
                (vote) => vote.playerId === player.id
              )?.availability || "";

            let availability: MatchAvailablilites;
            if (!matchAvailablilites.includes(_availability)) {
              availability = "unknown";
            } else {
              // @ts-expect-error _availability is of type MatchAvailablilites
              availability = _availability;
            }

            return (
              <Button
                key={player.id}
                onClick={() => handleSelectPlayer(player.id)}
                className="w-full flex justify-between items-center"
                variant={
                  availability === "available"
                    ? "positive"
                    : availability === "unavailable"
                    ? "negative"
                    : availability === "maybe"
                    ? "neutral"
                    : "secondary"
                }
              >
                {getPlayerName(player, remainingMainPlayers)}
                {availability === "maybe" && <HelpCircleIcon strokeWidth={2} />}
                {availability === "unavailable" && (
                  <Cancel01Icon strokeWidth={2} />
                )}
                {availability === "available" && <Tick01Icon strokeWidth={2} />}
              </Button>
            );
          })}
          <AvailabilityColorsLegend />
        </Card>
      )}
      <AddExistingPlayerDrawer
        teams={allTeams.filter((team) => team.name !== teamName)}
        value={selectedPlayers.map((player) => player.id)}
        onChange={handleSelectExistingPlayer}
        isExchangePlayers
      />
      <div className="h-20" />
      <div className="flex gap-2 w-full bottom-0 left-0 | bg-gradient-to-t from-white to-white/0 p-6 fixed | md:static md:p-0 | md:bg-transparent">
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          href={"../../../"}
        >
          <Cancel01Icon strokeWidth={2} />
          Abbrechen
        </Link>
        <Button className="w-full" onClick={onSave}>
          <Tick01Icon strokeWidth={2} />
          Speichern
        </Button>
      </div>
    </>
  );
};

export default ConfigureLineupWrapper;
