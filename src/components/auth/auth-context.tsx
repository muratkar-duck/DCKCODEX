"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Roles, Tables } from "@/types";
import { useSupabase } from "@/lib/supabase/client";

type UserProfile = Tables<"users">;

type AuthContextValue = {
  session: Session | null;
  profile: UserProfile | null;
  role: Roles | null;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  initialSession: Session | null;
  initialProfile: UserProfile | null;
  children: React.ReactNode;
};

export function AuthProvider({
  initialSession,
  initialProfile,
  children,
}: AuthProviderProps) {
  const supabase = useSupabase();
  const [session, setSession] = useState<Session | null>(initialSession);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const role = useMemo<Roles | null>(() => {
    const metadataRole = session?.user?.user_metadata?.role as Roles | undefined;
    return profile?.role ?? metadataRole ?? null;
  }, [profile?.role, session?.user?.user_metadata?.role]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!supabase) {
      return;
    }

    const currentSession = session ?? (await supabase.auth.getSession()).data.session;
    if (!currentSession?.user) {
      setProfile(null);
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", currentSession.user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  }, [session, supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      role,
      refreshProfile,
    }),
    [profile, refreshProfile, role, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return value;
}
