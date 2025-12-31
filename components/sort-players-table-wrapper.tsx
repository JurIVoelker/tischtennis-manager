"use client";

import { useState } from "react";
import { SortablePlayerTable } from "./sort-players/sortable-player-table";
import { Player } from "@prisma/client";
import { arrayMove } from "@dnd-kit/sortable";
import { Cancel01Icon, Tick01Icon } from "hugeicons-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { postAPI } from "@/lib/APIUtils";
import { setUnknownErrorToastMessage } from "@/lib/apiResponseUtils";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { umami } from "@/lib/umami";

interface SortPlayersTableWrapperProps {
  defaultPlayers: Player[];
  clubSlug: string;
  teamSlug: string;
}

const SortPlayersTableWrapper: React.FC<SortPlayersTableWrapperProps> = ({
  defaultPlayers,
  clubSlug,
  teamSlug,
}) => {
  const [players, setPlayers] = useState(
    defaultPlayers.map((player, index) => ({ player, id: index.toString() }))
  );

  const { push } = useRouter();

  const handleSortItems = (activeId: string, overId: string) => {
    setPlayers((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === activeId);
      const newIndex = prev.findIndex((item) => item.id === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const onSave = async () => {
    const res = await postAPI("/api/player/position", {
      playerIds: players.map((item) => item.player.id),
      clubSlug,
      teamSlug,
    });
    if (!res.ok) {
      umami()?.track("error:save-player-positions");
      setUnknownErrorToastMessage();
    } else {
      umami()?.track("save-player-positions");
      toast({
        title: "Spielerpositionen erfolgreich gespeichert",
      });
      push("./verwalten?refresh=true");
    }
  };
  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" asChild className="w-full">
          <Link href="./verwalten">
            <Cancel01Icon strokeWidth={2} />
            Abbrechen
          </Link>
        </Button>
        <Button className="w-full" onClick={onSave}>
          <Tick01Icon strokeWidth={2} />
          Speichern
        </Button>
      </div>
      <SortablePlayerTable
        className="mt-16"
        players={players}
        handleOnChange={handleSortItems}
      />
    </>
  );
};

export default SortPlayersTableWrapper;
