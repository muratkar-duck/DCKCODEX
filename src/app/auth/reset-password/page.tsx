"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { getBrowserClient } from "@/lib/supabase/client";
import { SUPABASE_CONFIG_MISSING_MESSAGE } from "@/lib/supabase/messages";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
});

export default function ResetPasswordPage() {
  const supabase = getBrowserClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!supabase) {
      toast.error(SUPABASE_CONFIG_MISSING_MESSAGE);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/sign-in`,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("E-posta kutunuzu kontrol edin.");
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-6 py-16">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-forest-900">Parolamı sıfırla</h1>
        <p className="text-sm text-forest-700">Hesabınıza giriş yapabilmek için yeni bir bağlantı gönderelim.</p>
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-3xl border border-forest-100 bg-white/90 p-6 shadow-sm"
        data-test-id="reset-password-form"
      >
        <label className="flex flex-col gap-2 text-sm font-medium text-forest-800">
          E-posta
          <input
            {...register("email")}
            className="rounded-xl border border-forest-100 px-4 py-2 focus:border-forest-500 focus:outline-none"
          />
          {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
        </label>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Gönderiliyor..." : "Bağlantı gönder"}
        </Button>
      </form>
    </div>
  );
}
