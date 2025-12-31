"use client";
import { MatchAvailabilityVote, Player } from "@prisma/client";
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
import PlayerTable from "./lineup/player-table";
import { getTeamsWithEqualType, sortPlayersByTeam } from "@/lib/teamUtils";
import { umami } from "@/lib/umami";

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

  const onAddPlayer = (playerId: string) => {
    const playerToAdd = mainPlayers.find((player) => player.id === playerId);
    if (!playerToAdd) return;
    setSelectedPlayers((prevList) => {
      const players = [...prevList, playerToAdd];
      const newList = sortPlayersByTeam(players, allTeams, teamName);
      return newList;
    });
  };

  const onAddAlternativePlayer = (playerIds: string[]) => {
    const playersToAdd: Player[] = [];
    allTeams.forEach((team) => {
      team.players.forEach((player) => {
        if (playerIds.includes(player.id)) playersToAdd.push(player);
      });
    });

    setSelectedPlayers((prevList) => {
      const players = [...prevList, ...playersToAdd];
      const newList = sortPlayersByTeam(players, allTeams, teamName);
      return newList;
    });
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
      umami?.track("error:save-lineup");
      setUnknownErrorToastMessage();
    } else {
      umami?.track("save-lineup");
      toast({ title: "Aufstellung gespeichert" });
      push("../../../?refresh=true");
    }
  };

  const availableAlternativeTeams = getTeamsWithEqualType({
    teamName,
    teams: allTeams,
    excludeOwn: true,
  });

  return (
    <>
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
                onClick={() => onAddPlayer(player.id)}
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
                {getPlayerName(player)}
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
      {availableAlternativeTeams.length > 0 && (
        <AddExistingPlayerDrawer
          teams={availableAlternativeTeams}
          value={selectedPlayers.map((player) => player.id)}
          onChange={onAddAlternativePlayer}
          isExchangePlayers
        />
      )}
      <Card className="p-4">
        {selectedPlayers.length > 0 && (
          <>
            <Typography variant="p-gray" className="mb-4">
              Ausgewählte Spieler
            </Typography>
            <PlayerTable
              players={selectedPlayers}
              handleRemovePlayer={handleRemovePlayer}
            />
          </>
        )}

        {selectedPlayers.length === 0 && (
          <Typography variant="p-gray">
            Klicke auf die Spieler, um sie zu der Aufstellung hinzuzufügen.
          </Typography>
        )}
      </Card>
      <div className="h-20" />
      <div className="flex gap-2 w-full bottom-0 left-0 | bg-gradient-to-t from-background to-background/0 p-6 fixed | md:static md:p-0 | md:bg-transparent z-20">
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "w-full z-20")}
          href={"../../../"}
        >
          <Cancel01Icon strokeWidth={2} />
          Abbrechen
        </Link>
        <Button className="w-full z-20" onClick={onSave}>
          <Tick01Icon strokeWidth={2} />
          Speichern
        </Button>
      </div>
    </>
  );
};

export default ConfigureLineupWrapper;
