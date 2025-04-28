"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { Button } from "./ui/button";
import { useThemeStore } from "@/store/themeStore";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  const labels: Record<Theme, string> = {
    light: "Hell",
    dark: "Dunkel",
    system: "System",
  };

  return (
    <div>
      <Button
        onClick={toggleTheme}
        variant="secondary"
        className="relative w-full flex justify-between"
      >
        Design: {labels[theme]}
        <MoonIcon
          size={16}
          className={`absolute transition-all right-3 ${
            theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
        <SunIcon
          size={16}
          className={`absolute transition-all right-3 ${
            theme === "light" ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
        <MonitorIcon
          size={16}
          className={`absolute transition-all right-3 ${
            theme === "system" ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
      </Button>
    </div>
  );
}
