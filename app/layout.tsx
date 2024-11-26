import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider } from "@/components/next-auth-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PWA NextJS",
  description: "It's a simple progressive web application made with NextJS",
  generator: "Next.js",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", url: "icons/ttm-lg.png" },
    { rel: "icon", url: "icons/ttm-lg.png" },
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
              {children}
            </SidebarProvider>
          </NextAuthProvider>
        </div>
      </body>
    </html>
  );
}
