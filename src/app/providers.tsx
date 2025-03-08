"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { useState } from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            // Set stale time to Infinity to prevent automatic refetching
            staleTime: Infinity,
            // Cache data forever until explicitly invalidated
            gcTime: Infinity,
            // Don't retry failed queries automatically
            retry: false,
          },
        },
      })
  );

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};
