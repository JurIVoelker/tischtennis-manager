"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Typography from "./typography";
import { useIsPermitted } from "@/hooks/use-has-permission";
import { getUserData } from "@/lib/localstorageUtils";
import {
  AvailabilityVoteWithPlayer,
  MatchAvailablilites,
} from "@/types/prismaTypes";
import { postAPI } from "@/lib/APIUtils";
import { toast } from "@/hooks/use-toast";

type optionsType = "Ja" | "Nein" | "Vielleicht";

interface AvailabiltyButtonsProps {
  defaultSelectedValue?: optionsType | undefined;
  matchAvailabilityVotes: AvailabilityVoteWithPlayer[];
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

  useEffect(() => {
    const userId = getUserData()[teamSlug]?.id;
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
  }, [matchAvailabilityVotes, teamSlug]);

  const isButtonsVisible = useIsPermitted("view:game-availability-buttons");

  const selectableOptions: selectableOptionsType[] = [
    { name: "Ja", variant: "positive" },
    { name: "Vielleicht", variant: "neutral" },
    { name: "Nein", variant: "negative" },
  ];

  const handleSelctOption = async (option: optionsType) => {
    setSelectedAvailabilty(option);
    try {
      const vote =
        option === "Ja"
          ? "available"
          : option === "Nein"
          ? "unavailable"
          : "maybe";
      await postAPI("/api/vote", {
        vote,
        clubSlug,
        teamSlug,
        matchId,
        playerId: getUserData()[teamSlug]?.id || "",
      });
    } catch (error) {
      toast({
        title: "Fehler beim Speichern der Antwort",
        description: "Bitte versuche es erneut",
      });
      console.error(error);
    }
  };

  if (!isButtonsVisible) return <></>;

  return (
    <div className=" mt-8 space-y-2">
      <Typography variant="h5">Hast du Zeit zu spielen?</Typography>
      <div className="flex gap-2">
        {selectableOptions.map((option) => (
          <Button
            key={option.name}
            className="w-full"
            variant={
              selectedAvailabilty === option.name ? option.variant : "outline"
            }
            onClick={() => handleSelctOption(option.name)}
          >
            {option.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AvailabiltyButtons;
