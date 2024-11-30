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
import { PlusSignIcon } from "hugeicons-react";

interface AddExistingPlayerDrawerProps {
  teams: TeamWithPlayers[];
}

const AddExistingPlayerDrawer: React.FC<AddExistingPlayerDrawerProps> = ({
  teams,
}) => {
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
        <div className="max-h-[60vh] overflow-y-scroll px-4 space-y-4">
          {teams.map((team) => (
            <Card key={team.id} className="p-4">
              <Typography variant="p-gray">{team.name}</Typography>
              <div className="flex flex-wrap space-y-2 pt-3">
                {team.players.map((player) => (
                  <Button
                    key={player.id}
                    variant={"outline"}
                    className="w-full justify-start"
                  >
                    <PlusSignIcon />
                    {getPlayerName(player, team.players)}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <DrawerFooter>
          <Button>Speichern</Button>
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
