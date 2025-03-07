"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
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
import {
  INVALID_LINK_PAGE_REGEX,
  ADMIN_PAGE_REGEX,
  LOGIN_PAGE_REGEX,
  LEADER_LOGIN_PAGES_REGEX,
  INDEX_PAGE_REGEX,
} from "@/constants/regex";
import AppSidebarFooter from "./sidebar/sidebar-footer";
import { getUserData } from "@/lib/localstorageUtils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ArrowDown01Icon, CrownIcon, StarIcon } from "hugeicons-react";
import { Separator } from "./ui/separator";

export const AppSidebar = ({}) => {
  const { toggleSidebar } = useSidebar();
  const [teams, setTeams] = useState<Team[] | null>(null);
  const { push } = useRouter();
  const isMobile = useIsMobile();
  const [usersTeams, setUsersTeams] = useState<string[]>([]);
  const [userLeaderAt, setUserLeaderAt] = useState<string[]>([]);
  const [userClub, setUserClub] = useState<string>("");

  // Hide sidebar on excludedPages
  const pathname = usePathname();
  const excludedRoutes = [
    ADMIN_PAGE_REGEX,
    INVALID_LINK_PAGE_REGEX,
    LOGIN_PAGE_REGEX,
    LEADER_LOGIN_PAGES_REGEX,
    INDEX_PAGE_REGEX,
  ];

  useEffect(() => {
    const clubSlug = window.location.pathname.split("/")[1];
    setUserClub(clubSlug);
    if (clubSlug) {
      getTeams(clubSlug).then((fetchedTeams: Team[]) => {
        setTeams(fetchedTeams);
      });
      type LeaderAt = { clubName: string; teamName: string };
      const userLeaderAtData = JSON.parse(
        localStorage.getItem("leaderAt") || "[]"
      )
        ?.filter((data: LeaderAt) => data.clubName === clubSlug)
        ?.map((data: LeaderAt) => data.teamName);
      setUserLeaderAt(userLeaderAtData);

      const usersTeamsData = getUserData();
      const userTeams = Object.keys(usersTeamsData || {})?.filter(
        (data: string) => !userLeaderAtData.includes(data)
      );
      setUsersTeams(userTeams);
    }
  }, []);

  // Handle click on team
  const currentTeamSlug = pathname.split("/")[2];

  const handleClickLink = (path: string) => {
    push(path);
    if (isMobile) toggleSidebar();
  };

  const getButtonStyles = (isCurrentTeam: boolean) => {
    const buttonStyles = buttonVariants({
      variant: isCurrentTeam ? "default" : "ghost",
    });
    const customButtonStyles = isCurrentTeam
      ? "hover:text-primary-foreground"
      : "bg-transparent text-primary hover:bg-sidebar-accent";

    return cn(buttonStyles, customButtonStyles, "justify-start");
  };

  if (excludedRoutes.some((regex) => regex.test(pathname))) {
    return <></>;
  }

  const sortings = ["Herren", "Damen", "Jungen", "Mädchen"];

  return (
    <Sidebar>
      <SidebarHeader className="h-20" />
      <SidebarContent>
        {usersTeams.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Meine Mannschaften</SidebarGroupLabel>
            <SidebarMenu>
              <div className="flex flex-col gap-2">
                {usersTeams.map((teamSlug) => {
                  const team = teams?.find((t) => t.slug === teamSlug);
                  return (
                    <SidebarMenuButton asChild key={team?.id}>
                      <Button
                        className={getButtonStyles(
                          teamSlug === currentTeamSlug
                        )}
                        onClick={() =>
                          handleClickLink(`/${userClub}/${teamSlug}`)
                        }
                      >
                        <StarIcon strokeWidth={2} />
                        {team?.name}
                      </Button>
                    </SidebarMenuButton>
                  );
                })}
                {userLeaderAt.map((teamSlug) => {
                  const team = teams?.find((t) => t.slug === teamSlug);
                  return (
                    <SidebarMenuButton asChild key={team?.id}>
                      <Button
                        className={getButtonStyles(
                          teamSlug === currentTeamSlug
                        )}
                        onClick={() =>
                          handleClickLink(`/${userClub}/${teamSlug}`)
                        }
                      >
                        <CrownIcon strokeWidth={2} />
                        {team?.name}
                      </Button>
                    </SidebarMenuButton>
                  );
                })}
              </div>
            </SidebarMenu>
          </SidebarGroup>
        )}
        {usersTeams.length > 0 && <Separator />}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarGroupLabel>Alle Mannschaften</SidebarGroupLabel>
            <div className="flex flex-col gap-2">
              {sortings.map((category) => {
                const categoryTeams = teams?.filter((team) =>
                  team.name.includes(category)
                );

                if (!categoryTeams || categoryTeams.length === 0) return null;

                return (
                  <Collapsible
                    key={category}
                    defaultOpen
                    className={cn("group/collapsible")}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            buttonVariants({
                              variant: "secondary",
                            }),
                            "justify-start",
                            "flex justify-between items-center"
                          )}
                        >
                          {category}
                          <ArrowDown01Icon strokeWidth={2} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {categoryTeams
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((team) => (
                              <SidebarMenuSubItem key={team.id}>
                                <Button
                                  className={cn(
                                    getButtonStyles(
                                      team.slug === currentTeamSlug
                                    ),
                                    "w-full"
                                  )}
                                  onClick={() =>
                                    handleClickLink(`/${userClub}/${team.slug}`)
                                  }
                                >
                                  {team.name}
                                </Button>
                              </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
              {teams
                ?.filter(
                  (team) =>
                    !sortings.some((category) => team.name.includes(category))
                )
                .map((team) => (
                  <SidebarMenuButton asChild key={team.id}>
                    <Button
                      className={getButtonStyles(team.slug === currentTeamSlug)}
                      onClick={() =>
                        handleClickLink(`/${userClub}/${team.slug}`)
                      }
                    >
                      {team.name}
                    </Button>
                  </SidebarMenuButton>
                ))}
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
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <AppSidebarFooter userClub={userClub} currentTeamSlug={currentTeamSlug} />
    </Sidebar>
  );
};
