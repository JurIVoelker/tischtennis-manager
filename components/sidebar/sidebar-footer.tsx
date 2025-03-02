import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";
import { LogOut, User2Icon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "../popups/confirm-modal";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

interface AppSidebarFooterProps {
  userClub: string;
  currentTeamSlug: string;
}

const AppSidebarFooter: React.FC<AppSidebarFooterProps> = ({
  userClub,
  currentTeamSlug,
}) => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const { toggleSidebar, isMobile } = useSidebar();

  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleClickLink = (path: string) => {
    push(path);
    if (isMobile) toggleSidebar();
  };

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("leaderAt");
  };

  return (
    <SidebarFooter>
      <div className="pb-4 space-y-4">
        <SidebarSeparator />
        <SidebarMenu>
          {!session && (
            <SidebarMenuButton
              onClick={() =>
                signIn("google", {
                  callbackUrl: `${window.location.protocol}//${window.location.host}/${userClub}/${currentTeamSlug}/mannschaftsfuehrer/login/validieren`,
                  redirect: true,
                })
              }
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start"
              )}
            >
              Mannschaftsführer Login
            </SidebarMenuButton>
          )}
          {session && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="h-10"
                  onClick={() => setLogoutModalOpen(true)}
                >
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
                  <LogOut size={32} className="ml-auto" />
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                  Mannschaften verwalten
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                  Admins verwalten
                </SidebarMenuButton>
              </SidebarMenuItem>
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
