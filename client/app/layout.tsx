import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { arSA, faIR } from "@clerk/localizations";
import { sfBold, sfLight, sfMed, sfProBold } from "@/config/fonts";
import GradualBlurMemo from "@/components/gradualBlur";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={faIR}>
      <html lang="fa" dir="rtl">
        <head />
        <body
          className={clsx(
            sfLight.variable,
            sfMed.variable,
            sfBold.variable,
            sfProBold.variable,
            "min-h-screen font-sf-med text-foreground bg-background antialiased"
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                {children}
              </main>
            </div>
            <GradualBlurMemo
              target="page"
              position="bottom"
              height="6rem"
              strength={2}
              divCount={5}
              curve="bezier"
              exponential={true}
              opacity={1}
            />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
