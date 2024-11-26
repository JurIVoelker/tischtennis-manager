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
} from "@/constants/regex";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ArrowUp01Icon, UserIcon } from "hugeicons-react";

export const AppSidebar = ({}) => {
  const { data: session } = useSession();
  // Hide sidebar on excludedPages
  const pathname = usePathname();
  const excludedRoutes = [
    ADMIN_PAGE_REGEX,
    INVALID_LINK_PAGE_REGEX,
    LOGIN_PAGE_REGEX,
  ];
  if (excludedRoutes.some((regex) => regex.test(pathname))) {
    return <></>;
  }

  // Get club teams of user
  const userClub = "Test-Club";
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [teams, setTeams] = useState<Team[] | null>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    getTeams(userClub).then((fetchedTeams: Team[]) => {
      setTeams(fetchedTeams);
    });
  }, []);

  // Handle click on team
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { toggleSidebar } = useSidebar();
  const currentTeamSlug = pathname.split("/")[2];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { push } = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
          <div className="flex flex-col gap-2 pt-4">
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
      <SidebarFooter>
        {session && (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <UserIcon size={20} /> {session?.user?.name}
                    <ArrowUp01Icon size={20} className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};
