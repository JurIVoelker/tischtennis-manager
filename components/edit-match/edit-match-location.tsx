"use client";
import { Card } from "../ui/card";
import Typography from "../typography";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState } from "react";
import { Label } from "../ui/label";

const EditMatchLocation = () => {
  const [isHomeGame, setIsHomeGame] = useState<boolean | null>(null);

  const locationOptions = ["Heimspiel", "Auswährts"];

  return (
    <Card className="p-4 space-y-4">
      <Typography variant="p-gray">Spielort</Typography>
      <Input placeholder="Hallenname..." />
      <Input placeholder="Straße und Nummer..." />
      <Input placeholder="Ort und PLZ..." />
      <RadioGroup
        onValueChange={(value) => {
          setIsHomeGame(value === locationOptions[0]);
        }}
        value={
          typeof isHomeGame === "boolean"
            ? locationOptions[isHomeGame ? 0 : 1]
            : undefined
        }
        className="flex gap-2"
      >
        {locationOptions.map((option) => (
          <Card
            className="flex gap-2 h-10 w-full items-center px-3 justify-center shadow-none"
            key={option}
          >
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option}>{option}</Label>
          </Card>
        ))}
      </RadioGroup>
    </Card>
  );
};

export default EditMatchLocation;
