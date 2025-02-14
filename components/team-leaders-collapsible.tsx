"use client";
import { ArrowRight01Icon, Delete02Icon, PlusSignIcon } from "hugeicons-react";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { TeamWithTeamLeadersAndTeamLeaderInvites } from "@/types/prismaTypes";
import { Card } from "./ui/card";
import { useState } from "react";
import TeamLeaderCard from "./team-leader-card";
import Typography from "./typography";
import InviteLeaderModal from "./popups/invite-leader-modal";

interface TeamLeadersCollapsibleProps {
  team: TeamWithTeamLeadersAndTeamLeaderInvites;
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
        {team?.teamLeaderInvite.map((invite) => (
          <TeamLeaderCard
            variant={invite.expiresAt < new Date() ? "timeout" : "pending"}
            name={invite.fullName}
            email={invite.email}
            key={invite.id}
            id={invite.id}
            clubSlug={clubSlug}
          />
        ))}
        <InviteLeaderModal
          teamName={team.name}
          clubSlug={clubSlug}
          teamSlug={team.slug}
        >
          <Button variant="outline" className="w-full">
            <PlusSignIcon />
            Hinzufügen
          </Button>
        </InviteLeaderModal>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TeamLeadersCollapsible;
