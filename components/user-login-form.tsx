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
import React from "react";
import { RadioGroupItem } from "./ui/radio-group";

interface UserLoginFormProps {
  players: Player[] | undefined;
}

const UserLoginForm: React.FC<UserLoginFormProps> = ({ players }) => {
  const playersSchema = players?.map((player) => player.firstName) || [""];

  const FormSchema = z.object({
    playerName: z.enum(
      playersSchema.length > 0
        ? (playersSchema as [string, ...string[]])
        : ["default"],
      {
        required_error: "Du musst einen Namen auswälen um fortzufahren.",
      }
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="playerName"
            render={({ field }) => (
              <FormItem className="w-full mb-4">
                <FormLabel>Wähle deinen Namen aus...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {players?.map((player) => (
                      <FormItem
                        key={player.id}
                        className="flex items-center space-x-3 space-y-2"
                      >
                        <FormControl>
                          <RadioGroupItem value={player.firstName} />
                        </FormControl>
                        <FormLabel className="font-normal">
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
          <Button type="submit" className="w-full">
            Fortfahren
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default UserLoginForm;
