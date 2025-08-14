"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Typography from "./typography";
import { useIsPermitted } from "@/hooks/use-has-permission";
import {
  AvailabilityVoteWithPlayer,
  MatchAvailablilites,
} from "@/types/prismaTypes";
import { postAPI } from "@/lib/APIUtils";
import { useRouter } from "next/navigation";
import { PLAYER_NOT_FOUND_ERROR } from "@/constants/APIError";
import { handlePostRequestError } from "@/lib/apiResponseUtils";
import { useUserStore } from "@/store/store";
import { Player } from "@prisma/client";

type optionsType = "Ja" | "Nein" | "Vielleicht";

interface AvailabiltyButtonsProps {
  defaultSelectedValue?: optionsType | undefined;
  matchAvailabilityVotes: AvailabilityVoteWithPlayer[];
  allPlayers: Player[];
  teamSlug: string;
  clubSlug: string;
  matchId: string;
}

interface selectableOptionsType {
  name: optionsType;
  variant: "positive" | "negative" | "neutral";
}

const AvailabiltyButtons: React.FC<AvailabiltyButtonsProps> = ({
  defaultSelectedValue,
  matchAvailabilityVotes,
  teamSlug,
  clubSlug,
  matchId,
}) => {
  const [selectedAvailabilty, setSelectedAvailabilty] = useState(
    defaultSelectedValue || null
  );

  const joinedTeams = useUserStore((state) => state.joinedTeams);

  const userId = joinedTeams?.find(
    (team) => team.teamSlug === teamSlug
  )?.playerId;

  const { push, refresh } = useRouter();

  useEffect(() => {
    if (userId) {
      // @ts-expect-error this is the expected type
      const availabilityAnswer: MatchAvailablilites | undefined =
        matchAvailabilityVotes.find(
          (availabilityVote) => availabilityVote.playerId === userId
        )?.availability;

      if (availabilityAnswer) {
        if (availabilityAnswer === "available") {
          setSelectedAvailabilty("Ja");
        } else if (availabilityAnswer === "maybe") {
          setSelectedAvailabilty("Vielleicht");
        } else if (availabilityAnswer === "unavailable") {
          setSelectedAvailabilty("Nein");
        }
      }
    }
  }, [matchAvailabilityVotes, teamSlug, userId]);

  const isButtonsVisible = useIsPermitted("view:game-availability-buttons");

  const selectableOptions: selectableOptionsType[] = [
    { name: "Ja", variant: "positive" },
    { name: "Vielleicht", variant: "neutral" },
    { name: "Nein", variant: "negative" },
  ];

  const handleSelectOption = async (option: optionsType) => {
    setSelectedAvailabilty(option);
    const vote =
      option === "Ja"
        ? "available"
        : option === "Nein"
          ? "unavailable"
          : "maybe";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await postAPI("/api/vote", {
      vote,
      clubSlug,
      teamSlug,
      matchId,
      playerId: userId || "",
    });
    if ((!res.data && !res.ok) || res?.error) {
      handlePostRequestError(res, [
        {
          message: PLAYER_NOT_FOUND_ERROR,
          toast: {
            title: "Übermitteln der Anfrage fehlgeschlagen",
            description:
              "Mit deinem Account stimmt etwas nicht. Bitte logge dich erneut ein.",
          },
          callback: () => {
            push(`./${teamSlug}/login`);
          },
        },
      ]);
    } else {
      refresh();
    }
  };

  if (!isButtonsVisible) return <></>;

  return (
    <div className="mt-8 space-y-3">
      <Typography variant="h5">Hast du Zeit zu spielen?</Typography>
      <div className="flex gap-2">
        {selectableOptions.map((option) => (
          <Button
            key={option.name}
            className="w-full"
            variant={
              selectedAvailabilty === option.name ? option.variant : "outline"
            }
            onClick={() => handleSelectOption(option.name)}
          >
            {option.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AvailabiltyButtons;
