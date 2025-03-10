"use client";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

interface AddCustomPlayerFormProps {
  className?: string;
  handleAddCustomPlayer: (data: {
    lastName: string;
    firstName: string;
  }) => void;
}

const AddCustomPlayerForm: React.FC<AddCustomPlayerFormProps> = ({
  className = "",
  handleAddCustomPlayer,
}) => {
  const FormSchema = z.object({
    lastName: z.string().min(1),
    firstName: z.string().min(1),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleSubmit = form.handleSubmit((data) => {
    handleAddCustomPlayer(data);
    form.setValue("lastName", "");
    form.setValue("firstName", "");
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className={cn(className, "space-y-3")}>
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Vorname..."
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
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Nachname..."
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
          <Button className="w-full">Hinzufügen</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddCustomPlayerForm;
