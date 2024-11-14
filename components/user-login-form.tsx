"use client";

import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Player } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { RadioGroupItem } from "./ui/radio-group";
import { getUserData, setUserData } from "@/lib/localstorageUtils";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Typography from "./typography";
import { Loader2 } from "lucide-react";

interface UserLoginFormProps {
  players: Player[] | undefined;
  teamName: string;
  clubSlug: string;
  teamSlug: string;
}

const UserLoginForm: React.FC<UserLoginFormProps> = ({
  players,
  teamName,
  clubSlug,
  teamSlug,
}) => {
  const playersSchema = players?.map((player) => player.firstName) || [""];

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getUserData();
    const teamData = userData[teamName];
    if (teamData) {
      const { name } = teamData;
      if (name && players?.some((player) => player.firstName === name)) {
        push(`/${clubSlug}/${teamSlug}`);
      } else {
        setUserData({ [teamName]: {} });
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubSlug, players, teamName, teamSlug]);

  const FormSchema = z.object({
    playerName: z.enum(
      playersSchema.length > 0
        ? (playersSchema as [string, ...string[]])
        : ["default"],
      {
        required_error: "Du musst einen Namen auswählen um fortzufahren.",
      }
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { push } = useRouter();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const { playerName } = data;
    setUserData({ [teamName]: { name: playerName } });
    toast({
      title: "Login erfolgreich",
      description: (
        <div className="mt-2 w-[340px]">
          <Typography variant="p-gray" className="leading-1">
            Wilkommen {playerName}! Du wurdest erfolgreich eingeloggt.
          </Typography>
        </div>
      ),
    });
    push(`/${clubSlug}/${teamSlug}`);
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="playerName"
            render={({ field }) => (
              <FormItem className="w-full mb-8 space-y-4">
                <FormLabel>Wähle deinen Namen aus...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-3"
                  >
                    {players?.map((player) => (
                      <FormItem
                        key={player.id}
                        className="flex items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={player.firstName} />
                        </FormControl>
                        <FormLabel className="font-normal inline">
                          {player.firstName}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <>
                <Loader2 className="animate-spin" />
                Laden...
              </>
            )}
            {!isLoading && "Einloggen"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default UserLoginForm;
