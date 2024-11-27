"use client";
import { getRole } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import Typography from "./typography";
import { Button } from "./ui/button";
import Link from "next/link";

interface TeamLeaderJoinSuggestionProps {
  clubSlug: string;
  teamSlug: string;
}

const TeamLeaderJoinSuggestion: React.FC<TeamLeaderJoinSuggestionProps> = ({
  clubSlug,
  teamSlug,
}) => {
  const [isSuggestionVisible, setSuggestionVisible] = useState<boolean>(false);
  useEffect(() => {
    const roleData = getRole();
    const isPromtHidden = localStorage.getItem(
      `${clubSlug}-${teamSlug}_isTeamLeaderJoinSuggestionVisible`
    );

    if (
      !isPromtHidden &&
      roleData.includes("leader") &&
      !roleData.includes("member")
    ) {
      setSuggestionVisible(true);
    }
  }, [clubSlug, teamSlug]);

  const handleDecline = () => {
    localStorage.setItem(
      `${clubSlug}-${teamSlug}_isTeamLeaderJoinSuggestionVisible`,
      "false"
    );
    setSuggestionVisible(false);
  };

  if (!isSuggestionVisible) return <></>;
  if (isSuggestionVisible)
    return (
      <Card className="p-6 mb-8 space-y-4">
        <Typography variant="h4">Du bist kein Mitglied</Typography>
        <Typography variant="p-gray">
          Du bist Mannschaftsführer, aber kein Mitglied der Mannschaft. Deshalb
          kannst du bei den Spielen nicht abstimmen, ob du Zeit hast. Möchtest
          du der Mannschaft beitreten?
        </Typography>
        <div className="flex gap-2">
          <Button className="w-full" variant="outline" onClick={handleDecline}>
            Nein
          </Button>
          <Button className="w-full" asChild>
            <Link href={`./${teamSlug}/login`}>Beitreten</Link>
          </Button>
        </div>
      </Card>
    );
};

export default TeamLeaderJoinSuggestion;
