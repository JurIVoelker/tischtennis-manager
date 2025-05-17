import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "../popups/confirm-modal";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import {
  AddTeamIcon,
  LoginSquare01Icon,
  ShieldUserIcon,
  UserCircleIcon,
} from "hugeicons-react";
import { useIsPermitted } from "@/hooks/use-has-permission";
import { useUserStore } from "@/store/store";
import Link from "next/link";
import ThemeToggle from "../theme-toggle";

interface AppSidebarFooterProps {
  userClub: string;
}

const AppSidebarFooter: React.FC<AppSidebarFooterProps> = ({ userClub }) => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const { toggleSidebar, isMobile } = useSidebar();

  const { clear } = useUserStore();

  const isAdminButtonVisible = useIsPermitted("view:manage-admin-button");
  const isLeaderButtonVisible = useIsPermitted("view:manage-leaders-button");

  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleClickLink = (path: string) => {
    push(path);
    if (isMobile) toggleSidebar();
  };

  const handleSignOut = () => {
    clear();
    signOut({
      callbackUrl: `${window.location.protocol}//${window.location.host}/${userClub}/`,
    });
    clear();
  };

  return (
    <SidebarFooter>
      <div className="pb-4 space-y-4">
        <SidebarSeparator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
          {!session && (
            <SidebarMenuButton
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start"
              )}
              asChild
            >
              <Link href={`/${userClub}/mannschaftsfuehrer/login`}>
                <LoginSquare01Icon strokeWidth={2} />
                Mannschaftsführer Login
              </Link>
            </SidebarMenuButton>
          )}
          {session && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start"
                  )}
                  onClick={() => setLogoutModalOpen(true)}
                >
                  {session?.user?.name || session?.user?.email ? (
                    <>
                      <UserCircleIcon strokeWidth={2} />
                      {session?.user?.name || session?.user?.email}
                    </>
                  ) : (
                    "Abmelden"
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isAdminButtonVisible && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() =>
                      handleClickLink(`/${userClub}/admin/mannschaftsfuehrer`)
                    }
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start"
                    )}
                  >
                    <AddTeamIcon strokeWidth={2} />
                    Mannschaften verwalten
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {isLeaderButtonVisible && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() =>
                      handleClickLink(`/${userClub}/admin/verwalten`)
                    }
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start"
                    )}
                  >
                    <ShieldUserIcon strokeWidth={2} />
                    Admins verwalten
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </>
          )}
        </SidebarMenu>
      </div>
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Ausloggen"
        description="Möchtest du dich wirklich ausloggen?"
        onConfirm={() => handleSignOut()}
        onClose={() => setLogoutModalOpen(false)}
      />
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
