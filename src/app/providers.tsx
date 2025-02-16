"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { nextEnv } from "@/nextEnv";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { Provider as JotaiProvider } from "jotai";

const convex = new ConvexReactClient(nextEnv.NEXT_PUBLIC_CONVEX_URL);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <JotaiProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </JotaiProvider>
    </ConvexAuthNextjsProvider>
  );
};
