import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/types";

type UserProfile = Tables<"users">;

async function getProfile(): Promise<UserProfile | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return null;
  }

  const { data } = await supabase.from("users").select("*").eq("id", session.user.id).maybeSingle();
  return (data as UserProfile | null) ?? null;
}

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <AuthGuard>
      <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-16">
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Profil Bilgileri</CardTitle>
            <CardDescription>Supabase auth ve public.users tablosu ile senkronize edilir.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-forest-700">
            <p>
              <strong>E-posta:</strong> {profile?.email ?? "Tanımlı değil"}
            </p>
            <p>
              <strong>Rol:</strong> {profile?.role ?? "Belirtilmedi"}
            </p>
            <p>
              Parolanızı sıfırlamak için <a className="text-forest-700 underline" href="/auth/reset-password">buraya</a> tıklayın.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
