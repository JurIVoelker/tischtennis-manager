"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button, buttonVariants } from "./ui/button";
import React, { useEffect, useState } from "react";
import Typography from "./typography";
import { useRouter } from "next/navigation";
import { Team } from "@prisma/client";
import { getTeams } from "@/hooks/useGetUserTeams";
import { Skeleton } from "./ui/skeleton";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { LOGIN_PAGE_REGEX } from "@/constants/regex";

export const AppSidebar = ({}) => {

  // Hide sidebar on excludedPages
  const pathname = usePathname();
  const excludedRoutes = [LOGIN_PAGE_REGEX]
  if (excludedRoutes.some((route) => new RegExp(route).test(pathname))) {
    return <></>
  }


  // Get club teams of user
  const userClub = "Test-Club";
  const [teams, setTeams] = useState<Team[] | null>(null);

  useEffect(() => {
    getTeams(userClub).then((fetchedTeams: Team[]) => {
      setTeams(fetchedTeams);
    });
  }, []);

  // Handle click on team
  const { toggleSidebar } = useSidebar();
  const currentTeamSlug = pathname.split("/")[2];
  const { push } = useRouter();
  const isMobile = useIsMobile();
  const handleClickLink = (teamSlug: string) => {
    push(`/${userClub}/${teamSlug}`);
    if (isMobile) toggleSidebar();
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup className="mt-28">
          <Typography variant="muted">Alle Mannschaften</Typography>
          <div className="flex flex-col gap-2 pt-2">
            {teams &&
              teams.map((team) => {
                const isCurrentTeam = team.slug === currentTeamSlug;
                const buttonStyles = buttonVariants({
                  variant: isCurrentTeam ? "default" : "ghost",
                });
                const customButtonStyles = isCurrentTeam
                  ? "hover:text-primary-foreground"
                  : "bg-transparent text-primary hover:bg-sidebar-accent";
                return (
                  <SidebarMenuButton asChild key={team.id}>
                    <Button
                      className={cn(
                        buttonStyles,
                        customButtonStyles,
                        "justify-start"
                      )}
                      onClick={() => handleClickLink(team.slug)}
                    >
                      {team.name}
                    </Button>
                  </SidebarMenuButton>
                );
              })}
            {teams === null &&
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-10" />
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
