"use client";
import { TeamWithPlayers } from "@/types/prismaTypes";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Card } from "./ui/card";
import Typography from "./typography";
import { getPlayerName } from "@/lib/stringUtils";
import { PlusSignIcon, Tick01Icon } from "hugeicons-react";
import { useState } from "react";

interface AddExistingPlayerDrawerProps {
  teams: TeamWithPlayers[];
  onChange: (selectedPlayers: string[]) => void;
  value: string[];
}

const AddExistingPlayerDrawer: React.FC<AddExistingPlayerDrawerProps> = ({
  teams,
  onChange,
  value,
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handleAddPlayers = () => {
    onChange(selectedPlayers);
    setSelectedPlayers([]);
  };

  const handleSelectPlayer = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers((prev) => prev.filter((id) => id !== playerId));
    } else {
      setSelectedPlayers((prev) => [...prev, playerId]);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Öffnen</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-left">
            Bestehenden Spieler hinzufügen
          </DrawerTitle>
          <DrawerDescription className="text-left">
            Füge bestehende Spieler aus anderen Mannschaften hinzu.
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[60vh] overflow-y-scroll px-4 space-y-4 relative">
          {teams.map((team) => (
            <Card key={team.id} className="p-4">
              <Typography variant="p-gray">{team.name}</Typography>
              <div className="flex flex-wrap space-y-2 pt-3">
                {team.players.map((player) => {
                  const isPlayerSelected = selectedPlayers.includes(player.id);
                  const isPlayerDisabled = value.includes(player.id);
                  return (
                    <Button
                      key={player.id}
                      variant={
                        isPlayerSelected || isPlayerDisabled
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => handleSelectPlayer(player.id)}
                      disabled={isPlayerDisabled}
                    >
                      {!isPlayerSelected && !isPlayerDisabled && (
                        <PlusSignIcon />
                      )}
                      {(isPlayerSelected || isPlayerDisabled) && <Tick01Icon />}
                      {getPlayerName(player, team.players)}
                    </Button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose
            disabled={selectedPlayers?.length ? false : true}
            onClick={handleAddPlayers}
          >
            <Button
              disabled={selectedPlayers?.length ? false : true}
              className="w-full"
            >
              Hinzufügen
            </Button>
          </DrawerClose>
          <DrawerClose>
            <Button variant="outline" className="w-full">
              Abbrechen
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddExistingPlayerDrawer;
