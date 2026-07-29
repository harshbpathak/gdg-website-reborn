"use client";
import { all_themes } from "@/app/constants/theme";
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Next13ProgressBar } from "next13-progressbar";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type React from "react";
import { Toaster as HotToaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnReconnect: true,
    },
  },
});

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Next13ProgressBar
        height="4px"
        color="#2563EB"
        options={{ showSpinner: true, trickle: true }}
        showOnShallow={true}
      />
      <NextThemesProvider
        themes={all_themes as unknown as string[]}
        defaultTheme="light"
        enableSystem={false}
        attribute="class"
      >
        <div 
  className="absolute inset-0 overflow-hidden max-w-full -z-1" 
  aria-hidden="true"
>
  <div
    className="grid grid-cols-2 -space-x-52 pattern_feed h-full w-full"
  >
    <div className="blur-[106px] h-56 bg-gradient-to-br from-secondary via-emerald-500 to-primary" />
    <div className="blur-[106px] h-32 bg-gradient-to-r from-primary via-violet-500 to-pink-500" />
  </div>
</div>
        <div className={cn("min-h-screen w-full h-full")}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </div>
      </NextThemesProvider>
      <HotToaster
        position="top-center"
        toastOptions={{
          duration: 2500,
        }}
      />
    </QueryClientProvider>
  );
}
