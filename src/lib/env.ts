import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_URL: z.string().url().optional(),
});

type ClientEnv = z.infer<typeof clientEnvSchema>;
type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedClientEnv: ClientEnv | null = null;
let cachedServerEnv: ServerEnv | null = null;

function readEnvValue(key: string) {
  return process.env[key];
}

export function getOptionalClientEnv(): ClientEnv | null {
  if (cachedClientEnv) {
    return cachedClientEnv;
  }

  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: readEnvValue("NEXT_PUBLIC_SUPABASE_URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: readEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  });

  if (!result.success) {
    return null;
  }

  cachedClientEnv = result.data;
  return cachedClientEnv;
}

export function getOptionalServerEnv(): ServerEnv | null {
  if (cachedServerEnv) {
    return cachedServerEnv;
  }

  const result = serverEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: readEnvValue("NEXT_PUBLIC_SUPABASE_URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: readEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: readEnvValue("SUPABASE_SERVICE_ROLE_KEY"),
    SUPABASE_URL: readEnvValue("SUPABASE_URL"),
  });

  if (!result.success) {
    return null;
  }

  cachedServerEnv = result.data;
  return cachedServerEnv;
}
