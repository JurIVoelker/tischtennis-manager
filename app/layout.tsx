import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider } from "@/components/next-auth-provider";
import Refresher from "@/components/refresher";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tischtennis Manager",
  description:
    "Verwalte deine Tischtennis-Mannschaft und bleibe immer auf dem Laufenden.",
  generator: "Next.js",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", url: "/icons/ttm-sm.png" },
    { rel: "icon", url: "/icons/ttm-sm.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.className}>
      <body>
        <div>
          <NextAuthProvider>
            <SidebarProvider>
              <Toaster />
              <AppSidebar />
              <Refresher />
              {children}
            </SidebarProvider>
          </NextAuthProvider>
        </div>
      </body>
    </html>
  );
}
