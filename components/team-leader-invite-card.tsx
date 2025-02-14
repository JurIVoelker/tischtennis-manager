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

interface TeamLeaderInviteCardProps {
  email: string;
  className?: string;
  id: string;
  variant?: "joined" | "pending" | "timeout";
  clubSlug: string;
  name: string;
}

const TeamLeaderInviteCard: React.FC<TeamLeaderInviteCardProps> = ({
  email,
  name,
  className,
  clubSlug,
  variant = "joined",
  id,
  ...props
}) => {
  const [emailState, setEmailState] = useState(email);
  const [nameState, setNameState] = useState(name);
  const [isChangeDetailsModalOpen, setChangeDetailsModalOpen] = useState(false);
  const [isDeleteLeaderDialogOpen, setDeleteLeaderDialogOpen] = useState(false);

  const onChange = (newEmail: string, newName: string) => {
    setEmailState(newEmail);
    setNameState(newName);
    setChangeDetailsModalOpen(false);
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
            <Button variant="ghost" size="icon-lg" className="text-destructive">
              <Cancel01Icon />
            </Button>
          </>
        )}
        {variant === "timeout" && (
          <>
            <Badge className="shrink-0" variant="secondary">
              Abgelaufen
            </Badge>
            <Button variant="ghost" size="icon-lg">
              <ArrowReloadHorizontalIcon />
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
      />
      <DeleteLeaderDialog
        open={isDeleteLeaderDialogOpen}
        leaderName={name}
        leaderId={id}
        clubSlug={clubSlug}
        onOpenChange={(bool) => setDeleteLeaderDialogOpen(bool)}
      />
    </Card>
  );
};

export default TeamLeaderInviteCard;
