import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types";
import { getOptionalServerEnv } from "@/lib/env";

type ServerClient = SupabaseClient<Database>;

export function createSupabaseServerClient(): ServerClient | null {
  const env = getOptionalServerEnv();
  if (!env) {
    return null;
  }

  return createServerComponentClient<Database>(
    { cookies },
    {
      supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  );
}
