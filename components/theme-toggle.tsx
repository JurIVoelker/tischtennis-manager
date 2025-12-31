"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { umami } from "@/lib/umami";

export type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme() as {
    setTheme: (theme: Theme) => void;
    theme: Theme;
  };

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      umami()?.track("theme-toggle", { theme: "light" });
    } else if (theme === "light") {
      setTheme("system");
      umami()?.track("theme-toggle", { theme: "system" });
    } else {
      setTheme("dark");
      umami()?.track("theme-toggle", { theme: "dark" });
    }
  };

  const labels: Record<Theme, string> = {
    light: "Hell",
    dark: "Dunkel",
    system: "System",
  };

  return (
    <div>
      <Button
        onClick={toggleTheme}
        variant="ghost"
        className="relative w-full flex justify-between"
      >
        <span className="left-11 absolute">
          Design: {theme && labels[theme]}
        </span>
        <MoonIcon
          size={16}
          className={`absolute transition-all left-4 ${
            theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
        <SunIcon
          size={16}
          className={`absolute transition-all left-4 ${
            theme === "light" ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
        <MonitorIcon
          size={16}
          className={`absolute transition-all left-4 ${
            theme === "system" ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
      </Button>
    </div>
  );
}
