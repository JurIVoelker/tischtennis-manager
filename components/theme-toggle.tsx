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
        variant="ghost"
        className="relative w-full flex justify-between"
      >
        <span className="left-11 absolute"> Design: {labels[theme]}</span>
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
