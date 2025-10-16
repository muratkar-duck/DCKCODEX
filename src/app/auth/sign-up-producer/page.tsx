"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { getBrowserClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(6, "Parola en az 6 karakter"),
});

export default function SignUpProducerPage() {
  const router = useRouter();
  const supabase = getBrowserClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!supabase) {
      toast.error("Supabase yapılandırması eksik.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { role: "producer" } },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Hesabınızı doğrulamak için e-posta kutunuzu kontrol edin.");
    router.push("/browse");
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-6 py-16">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-forest-900">Yapımcı olarak katıl</h1>
        <p className="text-sm text-forest-700">Senaryo kataloğuna eriş, ilgi bildir, satın al.</p>
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-3xl border border-forest-100 bg-white/90 p-6 shadow-sm"
        data-test-id="sign-up-producer-form"
      >
        <label className="flex flex-col gap-2 text-sm font-medium text-forest-800">
          E-posta
          <input
            {...register("email")}
            className="rounded-xl border border-forest-100 px-4 py-2 focus:border-forest-500 focus:outline-none"
          />
          {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-forest-800">
          Parola
          <input
            type="password"
            {...register("password")}
            className="rounded-xl border border-forest-100 px-4 py-2 focus:border-forest-500 focus:outline-none"
          />
          {errors.password ? <span className="text-xs text-rose-600">{errors.password.message}</span> : null}
        </label>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Kaydediliyor..." : "Kayıt Ol"}
        </Button>
      </form>
    </div>
  );
}
