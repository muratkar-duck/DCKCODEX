"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";

export type AuthGuardProps = {
  children: React.ReactNode;
  allowedRoles?: ("writer" | "producer")[];
};

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { session, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.replace("/auth/sign-in");
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const role = profile?.role ?? (session.user.user_metadata.role as string) ?? "producer";
      if (!allowedRoles.includes(role as "writer" | "producer")) {
        router.replace("/browse");
      }
    }
  }, [allowedRoles, profile?.role, router, session?.user]);

  if (!session?.user) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const role = profile?.role ?? (session.user.user_metadata.role as string) ?? "producer";
    if (!allowedRoles.includes(role as "writer" | "producer")) {
      return null;
    }
  }

  return <>{children}</>;
}
