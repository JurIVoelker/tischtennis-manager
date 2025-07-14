"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { postAPI } from "@/lib/APIUtils";
import { useUserStore } from "@/store/store";
import {
  LEADER_IS_NOT_EXISTING as LEADER_IS_NOT_EXISTING_ERROR,
  TEAM_LEADER_ALREADY_EXISTS_ERROR,
  UNKNOWN_ERROR,
} from "@/constants/APIError";
import Typography from "./typography";
import LoginButton from "./nextauth-login-button";
import { useRouter } from "next/navigation";

// Define the form validation schema
const formSchema = z
  .object({
    email: z.string().email({ message: "Ungültige E-Mail-Adresse" }),
    password: z
      .string()
      .min(8, { message: "Passwort muss mindestens 8 Zeichen lang sein" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export const RegisterCard = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { push } = useRouter();

  const clubSlug = useUserStore((state) => state.clubSlug);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await postAPI("/api/leader/register", {
      ...data,
      clubSlug,
    });

    if (res?.error?.error === LEADER_IS_NOT_EXISTING_ERROR) {
      setError(
        "Deine E-Mail-Adresse ist keinem Mannschaftsführer zugewiesen. \
        Bitte einen Admin darum, dich als Mannschaftsführer in einer \
        Mannschaft aufzunehmen und versuche es erneut ."
      );
    } else if (res?.error?.error === TEAM_LEADER_ALREADY_EXISTS_ERROR) {
      setError(TEAM_LEADER_ALREADY_EXISTS_ERROR);
    } else if (res?.error || !res.ok) {
      setError(UNKNOWN_ERROR);
    } else {
      push("./login");
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="w-[90%] max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Registrieren</CardTitle>
        <CardDescription>
          Wenn du Mannschaftsführer bist, kannst du dich hier registrieren.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail-Adresse</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="mail@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort wiederholen</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Wird registriert..." : "Registrieren"}
            </Button>

            <Typography variant="error">{error}</Typography>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Oder fortfahren mit
                </span>
              </div>
            </div>
            <LoginButton variant="google" />
          </CardContent>
        </form>
      </Form>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {"Du hast bereits einen Account? "}
          <Link href="./login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterCard;
