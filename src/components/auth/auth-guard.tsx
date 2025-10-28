"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";

export type AuthGuardProps = {
  children: React.ReactNode;
  allowedRoles?: ("writer" | "producer")[];
};

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { session, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.replace("/auth/sign-in");
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!role || !allowedRoles.includes(role)) {
        router.replace("/browse");
      }
    }
  }, [allowedRoles, role, router, session?.user]);

  if (!session?.user) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return null;
    }
  }

  return <>{children}</>;
}
