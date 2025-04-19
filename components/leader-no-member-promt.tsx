"use client";
import { getRole } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { useUserStore } from "@/store/store";

interface TeamLeaderJoinSuggestionProps {
  clubSlug: string;
  teamSlug: string;
}

const TeamLeaderJoinSuggestion: React.FC<TeamLeaderJoinSuggestionProps> = ({
  clubSlug,
  teamSlug,
}) => {
  const [isSuggestionVisible, setSuggestionVisible] = useState<boolean>(false);
  const { declineJoin, declinedJoins } = useUserStore();

  useEffect(() => {
    const roleData = getRole();
    const isPromtHidden = Boolean(
      declinedJoins.find(
        (item) => item.teamSlug === teamSlug && item.clubSlug === clubSlug
      )?.joinDeclined
    );

    if (
      !isPromtHidden &&
      roleData.includes("leader") &&
      !roleData.includes("member")
    ) {
      setSuggestionVisible(true);
    } else {
      setSuggestionVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubSlug, teamSlug, declinedJoins]);

  const handleDecline = () => {
    declineJoin(clubSlug, teamSlug);
    setSuggestionVisible(false);
  };

  if (!isSuggestionVisible) return <></>;
  if (isSuggestionVisible)
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Du bist kein Mitglied</CardTitle>
          <CardDescription>
            Du bist Mannschaftsführer, aber kein Mitglied der Mannschaft.
            Deshalb kannst du bei den Spielen nicht abstimmen, ob du Zeit hast.
            Möchtest du der Mannschaft beitreten?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Button className="w-full" variant="outline" onClick={handleDecline}>
            Nein
          </Button>
          <Button className="w-full" asChild>
            <Link href={`./${teamSlug}/login`}>Beitreten</Link>
          </Button>
        </CardContent>
      </Card>
    );
};

export default TeamLeaderJoinSuggestion;
