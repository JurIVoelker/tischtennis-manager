"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
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
} from "@/constants/regex";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ArrowUp01Icon } from "hugeicons-react";
import { getUserData, setUserData } from "@/lib/localstorageUtils";
import { User2Icon } from "lucide-react";

export const AppSidebar = ({}) => {
  const { data: session } = useSession();
  const { toggleSidebar } = useSidebar();
  const [teams, setTeams] = useState<Team[] | null>(null);
  const { push } = useRouter();
  const isMobile = useIsMobile();
  const [usersTeams, setUsersTeams] = useState<string[]>([]);

  // Hide sidebar on excludedPages
  const pathname = usePathname();
  const excludedRoutes = [
    ADMIN_PAGE_REGEX,
    INVALID_LINK_PAGE_REGEX,
    LOGIN_PAGE_REGEX,
    LEADER_LOGIN_PAGES_REGEX,
  ];

  // Get club teams of user
  const userClub = "Test-Club";

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getTeams(userClub).then((fetchedTeams: Team[]) => {
      setTeams(fetchedTeams);
    });
    const usersTeamsData = getUserData();
    setUsersTeams(Object.keys(usersTeamsData));
  }, []);

  // Handle click on team
  const currentTeamSlug = pathname.split("/")[2];

  const handleClickLink = (teamSlug: string) => {
    push(`/${userClub}/${teamSlug}`);
    if (isMobile) toggleSidebar();
  };

  const handleLeaveTeam = (teamName: string) => {
    setUserData({ [teamName]: undefined });
    window.location.reload();
  };

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("leaderAt");
  };

  if (excludedRoutes.some((regex) => regex.test(pathname))) {
    return <></>;
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup className="mt-28">
          <Typography variant="muted">Alle Mannschaften</Typography>
          <div className="flex flex-col gap-2 pt-4">
            {teams &&
              teams
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((team) => {
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
      <SidebarFooter>
        <div className="pb-4 space-y-4">
          <SidebarSeparator />
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-10">
                    {session?.user?.name ? (
                      <>
                        <span className="flex justify-center items-center rounded-full bg-gray-200 h-6 w-6">
                          <User2Icon size={16} />
                        </span>{" "}
                        {session.user.name}
                      </>
                    ) : (
                      "Meine Mannschaften"
                    )}
                    <ArrowUp01Icon size={20} className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  {usersTeams
                    .sort((a, b) => a.localeCompare(b))
                    .map((teamName) => (
                      <DropdownMenuItem
                        key={teamName}
                        onClick={() => handleLeaveTeam(teamName)}
                      >
                        <span className="inline-flex items-center gap-2">
                          {`${teamName.replace("-", " ")} verlassen`}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  {Boolean(usersTeams.length) && (
                    <SidebarSeparator className="my-1" />
                  )}
                  {session && (
                    <DropdownMenuItem onClick={handleSignOut}>
                      <span className="inline-flex items-center gap-2">
                        Logout
                      </span>
                    </DropdownMenuItem>
                  )}
                  {!session && (
                    <>
                      <SidebarMenuButton
                        onClick={() =>
                          signIn("google", {
                            callbackUrl: `${window.location.protocol}//${window.location.host}/${userClub}/${currentTeamSlug}/mannschaftsfuehrer/login/validieren`,
                            redirect: true,
                          })
                        }
                      >
                        Mannschaftsführer Login
                      </SidebarMenuButton>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
