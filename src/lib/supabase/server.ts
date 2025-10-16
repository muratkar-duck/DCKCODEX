import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types";
import { getOptionalServerEnv } from "@/lib/env";

type ServerClient = SupabaseClient<Database>;

type CookieOptions = Parameters<ReturnType<typeof cookies>["set"]>[2];

export function createSupabaseServerClient(): ServerClient | null {
  const env = getOptionalServerEnv();
  if (!env) {
    return null;
  }

  const cookieStore = cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
}
