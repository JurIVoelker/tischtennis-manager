"use client";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "../ui/date-picker";
import { Skeleton } from "../ui/skeleton";
import TimeInput from "../ui/time-input";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Typography from "../typography";
import { Card } from "../ui/card";
import { Button, buttonVariants } from "../ui/button";
import { Cancel01Icon, Tick01Icon } from "hugeicons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type Time = {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
};

const EditMatchForm = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const FormSchema = z.object({
    date: z.date(),
    time: z
      .object({
        hour: z.number(),
        minute: z.number(),
        second: z.number(),
        millisecond: z.number(),
      })
      .passthrough(),
    hallName: z.string(),
    streetAdress: z.string(),
    city: z.string(),
    isHomeGame: z.boolean(),
  });

  const locationOptions = ["Heimspiel", "Auswährts"];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="p-4 space-y-4">
          <Typography variant="p-gray">Spielort</Typography>
          <FormField
            name="date"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker
                    onValueChange={field.onChange}
                    value={field.value}
                    className={"w-full"}
                    label="Spieldatum auswählen"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="time"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {isLoading ? (
                    <Skeleton className="h-10" />
                  ) : (
                    <TimeInput
                      onChange={field.onChange}
                      value={field.value as Time}
                      label="Spieluhrzeit eingeben"
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
        <Card className="p-4 space-y-4">
          <Typography variant="p-gray">Datum und Uhrzeit</Typography>
          <FormField
            name="hallName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Hallenname..."
                    value={field.value}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="streetAdress"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Straße und Nummer..."
                    value={field.value}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="city"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Ort und PLZ..."
                    value={field.value}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isHomeGame"
            render={({ field }) => (
              <FormItem className="w-full mb-8 space-y-4">
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) =>
                      field.onChange(value === locationOptions[0])
                    }
                    defaultValue={
                      typeof field.value === "boolean"
                        ? locationOptions[field.value ? 0 : 1]
                        : undefined
                    }
                    className="flex gap-2"
                  >
                    {locationOptions?.map((option, id) => (
                      <Card
                        className="flex gap-2 h-10 w-full items-center px-3 justify-center shadow-none"
                        key={option}
                      >
                        <FormItem
                          key={id}
                          className="flex items-center space-x-2 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={option} id={option} />
                          </FormControl>
                          <FormLabel
                            className="font-normal inline"
                            htmlFor={option}
                          >
                            {option}
                          </FormLabel>
                        </FormItem>
                      </Card>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
        <div className="flex gap-2 w-full bottom-0 left-0 | bg-gradient-to-t from-white to-white/0 p-6 fixed | md:static md:p-0 | md:bg-transparent">
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            href={"../../"}
          >
            <Cancel01Icon />
            Abbrechen
          </Link>
          <Button type="submit" className="w-full">
            <Tick01Icon />
            Speichern
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditMatchForm;