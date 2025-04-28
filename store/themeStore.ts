import { Theme } from "@/components/theme-toggle";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  theme: Theme;
  toggleTheme: () => void;
};

export const useThemeStore = create<Store>()(
  persist(
    (set) => ({
      theme: "system",
      toggleTheme: () => {
        set((state) => {
          if (state.theme === "dark") {
            return { theme: "light" };
          }
          if (state.theme === "light") {
            return { theme: "system" };
          }
          return { theme: "dark" };
        });
      },
    }),
    {
      name: "theme-store",
    }
  )
);
