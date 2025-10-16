"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Tables } from "@/types";
import { AuthProvider } from "@/components/auth/auth-context";
import { Toaster } from "react-hot-toast";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

type ProvidersProps = {
  initialSession: Session | null;
  initialProfile: Tables<"users"> | null;
  children: React.ReactNode;
};

export function Providers({ initialSession, initialProfile, children }: ProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialSession={initialSession} initialProfile={initialProfile}>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
      {process.env.NODE_ENV === "development" ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
