"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { nextEnv } from "@/nextEnv";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

const convex = new ConvexReactClient(nextEnv.NEXT_PUBLIC_CONVEX_URL);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ConvexAuthNextjsProvider>
  );
};
