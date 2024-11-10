import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma/prisma";
import { Button } from "./ui/button";
import React from "react";

interface AppSidebarProps {
  clubSlug: string;
  teamSlug: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = async ({
  clubSlug,
  teamSlug,
}) => {
  const club = (
    await prisma.club.findMany({
      where: { slug: clubSlug },
      include: {
        teams: true,
      },
    })
  )[0];

  const currentTeam = club.teams.find((team) => team.slug === teamSlug);

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup title="Alle Mannschaften">
          {club.teams.map((team) => (
            <Button
              key={team.id}
              variant={currentTeam?.id === team.id ? "default" : "outline"}
            >
              {team.name}
            </Button>
          ))}
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
