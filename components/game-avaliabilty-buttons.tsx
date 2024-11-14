"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Typography from "./typography";
import { getUserData } from "@/lib/localstorageUtils";

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
  teamName,
}) => {
  const [selectedAvailabilty, setSelectedAvailabilty] = useState(
    defaultSelectedValue || null
  );

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUserData();
    const userName = userData[teamName]?.name;
    if (!userName) {
      setButtonDisabled(true);
    }
    setLoading(false);
  }, [teamName]);

  const selectableOptions: selectableOptionsType[] = [
    { name: "Ja", variant: "positive" },
    { name: "Vielleicht", variant: "neutral" },
    { name: "Nein", variant: "negative" },
  ];

  const handleSelctOption = (option: optionsType) => {
    setSelectedAvailabilty(option);
  };

  if (buttonDisabled) return <></>;

  return (
    <div className=" mt-8 space-y-2">
      {!isLoading && (
        <Typography variant="h5">Hast du Zeit zu spielen?</Typography>
      )}
      {isLoading && <Skeleton className="w-1/2 h-6" />}
      <div className="flex gap-2">
        {!isLoading &&
          selectableOptions.map((option) => (
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
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton className="w-full h-10" key={index} />
          ))}
      </div>
    </div>
  );
};

export default AvailabiltyButtons;
