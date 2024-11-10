"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";

type optionsType = "Ja" | "Nein" | "Vielleicht";

interface AvailabiltyButtonsProps {
  defaultSelectedValue?: optionsType | undefined;
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

  const selectableOptions: selectableOptionsType[] = [
    { name: "Ja", variant: "positive" },
    { name: "Vielleicht", variant: "neutral" },
    { name: "Nein", variant: "negative" },
  ];

  const handleSelctOption = (option: optionsType) => {
    setSelectedAvailabilty(option);
  };

  return (
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
  );
};

export default AvailabiltyButtons;
