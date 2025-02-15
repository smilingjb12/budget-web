import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "./footer";
import "./globals.css";
import { Header } from "./header";
import { Providers } from "./providers";
import ScrollToTop from "@/components/scroll-to-top";
import { Constants } from "@/constants";
import NextTopLoader from "nextjs-toploader";
import { Authenticated } from "convex/react";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

export const metadata: Metadata = {
  title: Constants.APP_NAME,
  description: Constants.APP_DESCRIPTION_META,
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
          <Providers>
            <NextTopLoader
              showSpinner={false}
              color={Constants.TOP_LOADER_COLOR}
            />
            <ScrollToTop />
            <div className="flex min-h-screen w-full flex-col py-12 px-6">
              {children}
            </div>
            <Toaster />
          </Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
