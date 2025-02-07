"use client";
import { ArrowRight01Icon, Delete02Icon, PlusSignIcon } from "hugeicons-react";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { TeamWithTeamLeaders } from "@/types/prismaTypes";
import { Card } from "./ui/card";
import { useState } from "react";
import TeamLeaderCard from "./team-leader-card";
import Typography from "./typography";

interface TeamLeadersCollapsibleProps {
  team: TeamWithTeamLeaders;
  clubSlug: string;
}

const TeamLeadersCollapsible: React.FC<TeamLeadersCollapsibleProps> = ({
  team,
  clubSlug,
  ...props
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Collapsible
      {...props}
      open={isOpen}
      onOpenChange={setOpen}
      className="space-y-3"
    >
      <Card className="flex items-center justify-between p-2 shadow-none">
        <Typography variant="p" className="font-medium">
          {team.name}
        </Typography>
        <div className="flex">
          <Button variant="ghost" className="text-destructive" size="icon-lg">
            <Delete02Icon />
          </Button>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon-lg">
              <ArrowRight01Icon
                className={`${isOpen ? "rotate-90" : "rotate-0"} transition`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
      </Card>
      <CollapsibleContent className="space-y-3">
        {team?.teamLeader.map((teamLeader) => (
          <TeamLeaderCard
            name={teamLeader.fullName}
            email={teamLeader.email}
            key={teamLeader.id}
            id={teamLeader.id}
            clubSlug={clubSlug}
          />
        ))}
        <Button variant="outline" className="w-full">
          <PlusSignIcon />
          Hinzufügen
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TeamLeadersCollapsible;
