"use client";
import { useState } from "react";
import { Card } from "../ui/card";
import Typography from "../typography";
import TimeInput from "../ui/time-input";
import { DatePicker } from "../ui/date-picker";
import { TimeValue } from "react-aria-components";

const EditMatchDateTime = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeValue, setTimeValue] = useState<TimeValue | null>(null);

  return (
    <Card className="p-4 space-y-4">
      <Typography variant="p-gray">Datum und Uhrzeit</Typography>
      <DatePicker date={date} setDate={setDate} className={"w-full"} />
      {/* <TimeInput value={timeValue} onChange={setTimeValue} label="est" /> */}
    </Card>
  );
};

export default EditMatchDateTime;
