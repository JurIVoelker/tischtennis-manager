"use client";

import axios from "axios";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma/prisma";
import { Button, buttonVariants } from "./ui/button";
import React, { useEffect, useState } from "react";
import Typography from "./typography";
import { useRouter } from "next/router";
import Link from "next/link";
import { Club, Team } from "@prisma/client";
import { getTeams } from "@/hooks/useGetUserTeams";
import { Skeleton } from "./ui/skeleton";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const AppSidebar = ({}) => {
  const userClub = "Test-Club";

  const [teams, setTeams] = useState<Team[] | null>(null);

  useEffect(() => {
    getTeams(userClub).then((fetchedTeams: Team[]) => {
      setTeams(fetchedTeams);
    });
  }, []);

  const pathname = usePathname();
  const currentTeamSlug = pathname.split("/")[2];

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup className="mt-28">
          <Typography variant="muted">Alle Mannschaften</Typography>
          <div className="flex flex-col gap-2 pt-2">
            {teams &&
              teams.map((team) => {
                const buttonStyles = buttonVariants({
                  variant:
                    team.slug === currentTeamSlug ? "default" : "secondary",
                });
                return (
                  <SidebarMenuButton asChild key={team.id}>
                    <Link
                      href={`/${userClub}/${team.slug}`}
                      className={cn(buttonStyles, "justify-start")}
                    >
                      {team.name}
                    </Link>
                  </SidebarMenuButton>
                );
              })}
            {teams === null &&
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-8" />
              ))}
            {Array.isArray(teams) && teams.length === 0 && (
              <Typography variant="muted">
                Keine Mannschaften gefunden
              </Typography>
            )}
          </div>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
