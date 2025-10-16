"use client";

import { useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
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

  browserClient = createClientComponentClient<Database>({
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  return browserClient;
}

export function useSupabase(): SupabaseClient<Database> | null {
  return useMemo(() => getBrowserClient(), []);
}
