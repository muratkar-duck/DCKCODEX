import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SignOutPage() {
  const supabase = createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/");
}
