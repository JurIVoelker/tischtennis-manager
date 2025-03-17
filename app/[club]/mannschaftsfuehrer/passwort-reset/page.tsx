"use client";

import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { postAPI } from "@/lib/APIUtils";
import { UNKNOWN_ERROR } from "@/constants/APIError";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Zod-Schema für die Formularvalidierung
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Bitte geben eine gültige E-Mail-Adresse ein" }),
  password: z.string().min(8, {
    message: "Das Passwort muss mindestens 8 Zeichen lang sein",
  }),
  passwordRepeat: z.string().min(8, {
    message: "Das Passwort muss mindestens 8 Zeichen lang sein",
  }),
});

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      setEmail(email);
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Zurücksetzen der Statusmeldungen
    setError(null);
    setSuccess(null);
    setValidationError(null);

    // Validierung mit Zod
    const result = formSchema.safeParse({ email, password, passwordRepeat });

    if (!result.success) {
      setValidationError(result.error.errors[0].message);
      return;
    }

    if (password !== passwordRepeat) {
      setValidationError("Die Passwörter stimmen nicht überein");
      return;
    }

    setIsLoading(true);

    const res = await postAPI("/api/leader/password-reset/validate", {
      email,
      password,
      token: searchParams.get("token"),
    });

    if (!res.ok) {
      // @ts-expect-error error property is not defined on Response
      const errorMessage = res.error?.error || UNKNOWN_ERROR;
      setError(errorMessage);
    } else {
      setSuccess("Das Passwort wurde erfolgreich zurückgesetzt");
    }

    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 p6 w-full">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Passwort Zurücksetzen
          </CardTitle>
          <CardDescription>
            {`Wähle ein neues Passwort für deine E-Mail-Adresse ${email || "unknown"} aus.`}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={
                    validationError ? "border-destructive pr-10" : "pr-10"
                  }
                  aria-invalid={!!validationError}
                />
              </div>
              {validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-repeat">Passwort Bestätigen</Label>
              <div className="relative">
                <Input
                  id="password-repeat"
                  type="password"
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                  className={
                    validationError ? "border-destructive pr-10" : "pr-10"
                  }
                  aria-invalid={!!validationError}
                />
              </div>
              {validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
              )}
            </div>

            {success && (
              <>
                <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/50 dark:text-green-300">
                  {success}
                </div>
                <Link
                  href={"./login"}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full"
                  )}
                >
                  Zum Login
                </Link>
              </>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/50 dark:text-red-300">
                {error}
              </div>
            )}
          </CardContent>
          {!success && !error && (
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Wird zurückgesetzt..." : "Passwort zurücksetzen"}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
}
