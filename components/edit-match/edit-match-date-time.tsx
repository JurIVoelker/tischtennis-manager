"use client";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import Typography from "../typography";
import TimeInput from "../ui/time-input";
import { DatePicker } from "../ui/date-picker";
import { Skeleton } from "../ui/skeleton";
import { TimeValue } from "react-aria-components";

const EditMatchDateTime = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeValue, setTimeValue] = useState<TimeValue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Card className="p-4 space-y-4">
      <Typography variant="p-gray">Datum und Uhrzeit</Typography>
      <DatePicker
        date={date}
        setDate={setDate}
        className={"w-full"}
        label="Spieldatum auswählen"
      />
      {isLoading && <Skeleton className="h-10" />}
      {!isLoading && (
        <TimeInput
          value={timeValue}
          onChange={setTimeValue}
          label="Spieluhrzeit eingeben"
        />
      )}
    </Card>
  );
};

export default EditMatchDateTime;
