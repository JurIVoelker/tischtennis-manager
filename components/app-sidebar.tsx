"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
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
  WELCOME_PAGE_REGEX,
} from "@/constants/regex";
import AppSidebarFooter from "./sidebar/sidebar-footer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ArrowDown01Icon, CrownIcon, StarIcon } from "hugeicons-react";
import { Separator } from "./ui/separator";
import { useUserStore } from "@/store/store";

export const AppSidebar = ({}) => {
  const { toggleSidebar } = useSidebar();
  const clubSlug = useUserStore((state) => state.clubSlug);
  const teamSlug = useUserStore((state) => state.teamSlug);
  const joinedTeams = useUserStore((state) => state.joinedTeams);
  const leaderAt = useUserStore((state) => state.leaderAt);

  const { push } = useRouter();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const [teams, setTeams] = useState<Team[] | null>(null);

  useEffect(() => {
    if (clubSlug) {
      getTeams(clubSlug).then((fetchedTeams: Team[]) => {
        setTeams(fetchedTeams);
      });
    }
  }, [clubSlug, leaderAt]);

  const excludedRoutes = [
    ADMIN_PAGE_REGEX,
    INVALID_LINK_PAGE_REGEX,
    LOGIN_PAGE_REGEX,
    LEADER_LOGIN_PAGES_REGEX,
    INDEX_PAGE_REGEX,
    WELCOME_PAGE_REGEX,
  ];

  if (excludedRoutes.some((regex) => regex.test(pathname))) {
    return <></>;
  }

  const teamsLeaderAt =
    leaderAt?.length <= 0
      ? []
      : leaderAt
          ?.map((l) => teams?.find((t) => t.slug === l.teamSlug))
          .filter(Boolean);

  const teamsJoined =
    joinedTeams?.length <= 0
      ? []
      : joinedTeams
          ?.map((j) => teams?.find((t) => t.slug === j.teamSlug))
          .filter(Boolean)
          .filter((t) => !teamsLeaderAt?.some((l) => l?.slug === t?.slug));

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

  const sortings = [
    "Herren",
    "Damen",
    "Jungen",
    "Mädchen",
    "Erwachsene",
    "Jugend",
  ];

  return (
    <Sidebar>
      <SidebarContent className="pt-20">
        {(joinedTeams?.length > 0 || leaderAt?.length > 0) && (
          <SidebarGroup>
            <SidebarGroupLabel>Meine Mannschaften</SidebarGroupLabel>
            <SidebarMenu>
              <div className="flex flex-col gap-2">
                {teamsLeaderAt?.map((team, key) => (
                  <SidebarMenuButton asChild key={key}>
                    <Button
                      className={getButtonStyles(team?.slug === teamSlug)}
                      onClick={() =>
                        handleClickLink(`/${clubSlug}/${team?.slug}`)
                      }
                    >
                      <CrownIcon strokeWidth={2} />
                      {team?.name}
                    </Button>
                  </SidebarMenuButton>
                ))}
                {teamsJoined?.map((team, key) => (
                  <SidebarMenuButton asChild key={key}>
                    <Button
                      className={getButtonStyles(team?.slug === teamSlug)}
                      onClick={() =>
                        handleClickLink(`/${clubSlug}/${team?.slug}`)
                      }
                    >
                      <StarIcon strokeWidth={2} />
                      {team?.name}
                    </Button>
                  </SidebarMenuButton>
                ))}
              </div>
            </SidebarMenu>
          </SidebarGroup>
        )}
        {joinedTeams.length > 0 && <Separator />}
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
                                    getButtonStyles(team.slug === teamSlug),
                                    "w-full"
                                  )}
                                  onClick={() =>
                                    handleClickLink(`/${clubSlug}/${team.slug}`)
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
                      className={getButtonStyles(team.slug === teamSlug)}
                      onClick={() =>
                        handleClickLink(`/${clubSlug}/${team.slug}`)
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
      <AppSidebarFooter userClub={clubSlug} />
    </Sidebar>
  );
};
