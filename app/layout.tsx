import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PWA NextJS",
  description: "It's a simple progressive web application made with NextJS",
  generator: "Next.js",
  manifest: "/manifest.json",
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
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
    <html lang="en" className={inter.className}>
      <body>
        <div>
          <SidebarProvider>
            <Toaster />
            <AppSidebar />
            {children}
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
