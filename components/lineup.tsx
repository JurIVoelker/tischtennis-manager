import { Lineup as LineupType } from "@prisma/client";
import React from "react";
import Typography from "./typography";

interface LineupProps {
  lineup?: LineupType | undefined;
}

const Lineup: React.FC<LineupProps> = ({ lineup }) => {
  if (!lineup)
    return (
      <Typography variant="p-gray" className="[&:not(:first-child)]:mt-0">
        Der Mannschaftsführer hat noch keine Aufstellung ausgewählt.
      </Typography>
    );
  return <div>{JSON.stringify(lineup)}</div>;
};

export default Lineup;
