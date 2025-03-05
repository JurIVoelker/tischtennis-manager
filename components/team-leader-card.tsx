"use client";

import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import Typography from "./typography";
import { MoreHorizontal, User2Icon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowReloadHorizontalIcon, Cancel01Icon } from "hugeicons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChangeLeaderDetailsModal } from "./popups/change-leader-details-modal";
import { useState } from "react";
import { DeleteLeaderDialog } from "./popups/delete-leader-modal";
import { ConfirmModal } from "./popups/confirm-modal";
import { deleteAPI, putAPI } from "@/lib/APIUtils";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface TeamLeaderCardProps {
  email: string;
  className?: string;
  id: string;
  variant?: "joined" | "pending" | "timeout";
  clubSlug: string;
  name: string;
  isAdmin?: boolean;
}

const TeamLeaderCard: React.FC<TeamLeaderCardProps> = ({
  email,
  name,
  className,
  clubSlug,
  variant = "joined",
  id,
  isAdmin = false,
  ...props
}) => {
  const [emailState, setEmailState] = useState(email);
  const [nameState, setNameState] = useState(name);
  const [isChangeDetailsModalOpen, setChangeDetailsModalOpen] = useState(false);
  const [isDeleteLeaderDialogOpen, setDeleteLeaderDialogOpen] = useState(false);
  const [confirmModalSettings, setConfirmModalSettings] = useState({
    open: false,
    onConfirm: () => {},
    onClose: () =>
      setConfirmModalSettings((prev) => ({ ...prev, open: false })),
    description: "",
    isDestructive: false,
    isLoading: false,
  });

  const router = useRouter();

  const onChange = (newEmail: string, newName: string) => {
    setEmailState(newEmail);
    setNameState(newName);
    setChangeDetailsModalOpen(false);
  };

  const onRevokeInviteModalOpen = () => {
    setConfirmModalSettings((prev) => ({
      ...prev,
      open: true,
      onConfirm: onRevokeInvite,
      description: "Möchtest du die Einladung wirklich widerrufen?",
      isDestructive: true,
    }));
  };

  const onRevokeInvite = async () => {
    setConfirmModalSettings((prev) => ({ ...prev, isLoading: true }));
    await deleteAPI("/api/leader/invite-token", { id, clubSlug });
    setConfirmModalSettings((prev) => ({
      ...prev,
      open: false,
      isLoading: false,
    }));
    router.refresh();
  };

  const onRenewInviteModalOpen = () => {
    setConfirmModalSettings((prev) => ({
      ...prev,
      open: true,
      onConfirm: onRenewInvite,
      description: "Möchtest du die Einladung wirklich erneuern?",
      isDestructive: false,
    }));
  };

  const onRenewInvite = async () => {
    setConfirmModalSettings((prev) => ({ ...prev, isLoading: true }));
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);
    await putAPI("/api/leader/invite-token", {
      id,
      clubSlug,
      expiresAt,
    });
    setConfirmModalSettings((prev) => ({
      ...prev,
      open: false,
      isLoading: false,
    }));
    toast({ title: "Einladung um zwei Wochen erneuert" });
    router.refresh();
  };

  return (
    <Card
      className={cn(
        "shadow-none p-2 flex gap-2 items-center justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 width-full overflow-hidden">
        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-200 shrink-0">
          <User2Icon size={20} />
        </div>
        <span className="flex flex-col shrink overflow-hidden text-ellipsis">
          <Typography
            variant="p"
            className="leading-0 shrink text-ellipsis overflow-hidden"
          >
            {name}
          </Typography>
          <Typography
            variant="muted"
            className="text-sm leading-0 shrink text-ellipsis overflow-hidden"
          >
            {email}
          </Typography>
        </span>
      </div>
      <div className="flex gap-2 items-center">
        {variant === "pending" && (
          <>
            <Badge className="shrink-0">Ausstehend</Badge>
            <Button
              variant="ghost"
              size="icon-lg"
              className="text-destructive"
              onClick={onRevokeInviteModalOpen}
            >
              <Cancel01Icon strokeWidth={2}/>
            </Button>
          </>
        )}
        {variant === "timeout" && (
          <>
            <Badge className="shrink-0" variant="secondary">
              Abgelaufen
            </Badge>
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={onRenewInviteModalOpen}
            >
              <ArrowReloadHorizontalIcon strokeWidth={2}/>
            </Button>
          </>
        )}
        {variant === "joined" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-lg">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-2">
              <DropdownMenuItem
                onClick={() => {
                  setChangeDetailsModalOpen(true);
                }}
              >
                Daten ändern
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteLeaderDialogOpen(true)}
              >
                Entfernen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <ChangeLeaderDetailsModal
        isOpen={isChangeDetailsModalOpen}
        onClose={() => setChangeDetailsModalOpen(false)}
        onDetailsChange={onChange}
        currentName={nameState}
        currentEmail={emailState}
        clubSlug={clubSlug}
        id={id}
        isAdmin={isAdmin}
      />
      <DeleteLeaderDialog
        open={isDeleteLeaderDialogOpen}
        leaderName={name}
        leaderId={id}
        clubSlug={clubSlug}
        onOpenChange={(bool) => setDeleteLeaderDialogOpen(bool)}
        isAdmin={isAdmin}
      />
      <ConfirmModal
        isDestructive={confirmModalSettings.isDestructive}
        isOpen={confirmModalSettings.open}
        onConfirm={confirmModalSettings.onConfirm}
        onClose={confirmModalSettings.onClose}
        description={confirmModalSettings.description}
        isLoading={confirmModalSettings.isLoading}
      />
    </Card>
  );
};
export default TeamLeaderCard;
