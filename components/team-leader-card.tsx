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
import { ChangeEmailModal } from "./popups/change-leader-mail-modal";
import { useState } from "react";

interface TeamLeaderCardProps {
  email: string;
  className?: string;
  id: string;
  variant?: "joined" | "pending" | "timeout";
  clubSlug: string;
}

const TeamLeaderCard: React.FC<TeamLeaderCardProps> = ({
  email,
  className,
  clubSlug,
  variant = "joined",
  id,
  ...props
}) => {
  const [emailState, setEmailState] = useState(email);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEmailChange = (newEmail: string) => {
    setEmailState(newEmail);
    setIsModalOpen(false);
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
            Juri Völker
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
              {/* <DropdownMenuItem>Umbenennen</DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                E-Mail-Adresse ändern
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Entfernen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <ChangeEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEmailChange={handleEmailChange}
        currentEmail={emailState}
        clubSlug={clubSlug}
        id={id}
      />
    </Card>
  );
};

export default TeamLeaderCard;
