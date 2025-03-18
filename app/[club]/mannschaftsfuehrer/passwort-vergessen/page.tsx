"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Mail01Icon } from "hugeicons-react";
import { postAPI } from "@/lib/APIUtils";
import { useUserStore } from "@/store/store";
import {
  TOO_MANY_EMAILS_SENT_ERROR,
  UNKNOWN_ERROR,
} from "@/constants/APIError";

// Zod-Schema für die Formularvalidierung
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Bitte geben eine gültige E-Mail-Adresse ein" }),
});

export default function PasswortVergessen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { clubSlug } = useUserStore();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Zurücksetzen der Statusmeldungen
    setError(null);
    setSuccess(null);
    setValidationError(null);

    // Validierung mit Zod
    const result = formSchema.safeParse({ email });

    if (!result.success) {
      setValidationError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    const res = await postAPI("/api/leader/password-reset", {
      email,
      clubSlug,
    });
    if (res.ok) {
      setSuccess(
        "Falls die E-Mail-Adresse in unserer Datenbank existiert, haben wir dir einen Link zum Zurücksetzen deines Passworts zugesendet."
      );
    } else if (!res.ok) {
      // @ts-expect-error error property is not defined on Response
      if (res?.error?.error === TOO_MANY_EMAILS_SENT_ERROR) {
        setError(TOO_MANY_EMAILS_SENT_ERROR);
      } else {
        setError(UNKNOWN_ERROR);
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 p6 w-full">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Passwort vergessen
          </CardTitle>
          <CardDescription>
            Geben deine E-Mail-Adresse ein. Du bekommst per E-Mail einen Link
            zum Zurücksetzen deines Passworts.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@beispiel.de"
                  className={
                    validationError ? "border-destructive pr-10" : "pr-10"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!validationError}
                />
                <Mail01Icon
                  strokeWidth={2}
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
              </div>
              {validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
              )}
            </div>

            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/50 dark:text-green-300">
                {success}
              </div>
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
                {isLoading
                  ? "Wird gesendet..."
                  : "Link zum Zurücksetzen senden"}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
}
