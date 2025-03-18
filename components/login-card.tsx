"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";

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
import LoginButton from "./nextauth-login-button";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { Mail01Icon } from "hugeicons-react";
import { useRouter } from "next/navigation";

export default function LoginCard() {
  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for validation errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const { push } = useRouter();

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors = {
      email: "",
      password: "",
    };

    // Validate email
    if (!email) {
      newErrors.email = "E-Mail-Adresse ist erforderlich";
    } else if (!validateEmail(email)) {
      newErrors.email = "Bitte gib eine gültige E-Mail-Adresse ein";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Passwort ist erforderlich";
    }

    // If no errors, proceed with login
    if (!newErrors.email && !newErrors.password) {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.status === 401) {
        newErrors.password = "Ungültige E-Mail-Adresse oder Passwort";
      } else if (res?.status === 200) {
        push("./login/validieren");
      }
      setErrors(newErrors);
    }
  };

  return (
    <Card className="w-[90%] max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Wenn du Mannschaftsführer bist, kannst du dich hier anmelden.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Passwort</Label>
              <Link
                href="./passwort-vergessen"
                className="text-sm text-primary hover:underline"
              >
                Passwort vergessen?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            <Mail01Icon /> Login
          </Button>
        </form>

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
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {"Du hast keinen Account? "}
          <Link href="./registrieren" className="text-primary hover:underline">
            Registrieren
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
