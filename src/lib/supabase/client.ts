"use client";

import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import type { Database } from "@/types";
import { getOptionalClientEnv } from "@/lib/env";

let browserClient: SupabaseClient<Database> | null = null;

export function getBrowserClient(): SupabaseClient<Database> | null {
  if (browserClient) {
    return browserClient;
  }

  const env = getOptionalClientEnv();
  if (!env) {
    return null;
  }

  browserClient = createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return browserClient;
}

export function useSupabase(): SupabaseClient<Database> | null {
  return useMemo(() => getBrowserClient(), []);
}
