"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Typography from "./typography";
import { useIsPermitted } from "@/hooks/use-has-permission";

type optionsType = "Ja" | "Nein" | "Vielleicht";

interface AvailabiltyButtonsProps {
  defaultSelectedValue?: optionsType | undefined;
  teamName: string;
}

interface selectableOptionsType {
  name: optionsType;
  variant: "positive" | "negative" | "neutral";
}

const AvailabiltyButtons: React.FC<AvailabiltyButtonsProps> = ({
  defaultSelectedValue,
}) => {
  const [selectedAvailabilty, setSelectedAvailabilty] = useState(
    defaultSelectedValue || null
  );

  const isButtonsVisible = useIsPermitted("view:game-availability-buttons");

  const selectableOptions: selectableOptionsType[] = [
    { name: "Ja", variant: "positive" },
    { name: "Vielleicht", variant: "neutral" },
    { name: "Nein", variant: "negative" },
  ];

  const handleSelctOption = (option: optionsType) => {
    setSelectedAvailabilty(option);
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
