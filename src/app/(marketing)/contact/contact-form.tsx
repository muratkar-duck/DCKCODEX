"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { getBrowserClient } from "@/lib/supabase/client";
import { SUPABASE_CONFIG_MISSING_MESSAGE } from "@/lib/supabase/messages";
import type { TablesInsert } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Adınız en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta girin"),
  subject: z.string().min(3, "Konu gerekli"),
  message: z.string().min(10, "Mesajınızı detaylandırın"),
});

export function ContactForm() {
  const supabase = getBrowserClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!supabase) {
      toast.error(SUPABASE_CONFIG_MISSING_MESSAGE);
      return;
    }

    const payload: TablesInsert<"support_messages"> = values;
    const { error } = await supabase
      .from("support_messages")
      // Cast required until Supabase's helpers expose an updated client with typed upsert generics.
      .upsert(payload as never);
    if (error) {
      toast.error("Mesajınız iletilirken bir hata oluştu");
      return;
    }

    toast.success("Mesajınız alındı, en kısa sürede dönüş yapacağız.");
    setSubmitted(true);
    reset();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-forest-950">İletişim</h1>
        <p className="text-forest-700">
          İş ortaklıkları, destek ve önerileriniz için bize yazın. 24 saat içinde dönüş yapmayı hedefliyoruz.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-3xl border border-forest-100 bg-white/90 p-6 shadow-sm"
        data-test-id="contact-form"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-forest-800">
            Ad Soyad
            <input
              {...register("name")}
              className="rounded-xl border border-forest-100 px-4 py-2 text-sm focus:border-forest-500 focus:outline-none"
              placeholder="Adınız"
            />
            {errors.name ? <span className="text-xs text-rose-600">{errors.name.message}</span> : null}
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-forest-800">
            E-posta
            <input
              {...register("email")}
              className="rounded-xl border border-forest-100 px-4 py-2 text-sm focus:border-forest-500 focus:outline-none"
              placeholder="ornek@ducktylo.test"
            />
            {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-forest-800">
          Konu
          <input
            {...register("subject")}
            className="rounded-xl border border-forest-100 px-4 py-2 text-sm focus:border-forest-500 focus:outline-none"
            placeholder="Örn. Ortak prodüksiyon"
          />
          {errors.subject ? <span className="text-xs text-rose-600">{errors.subject.message}</span> : null}
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-forest-800">
          Mesaj
          <textarea
            {...register("message")}
            className="min-h-[160px] rounded-xl border border-forest-100 px-4 py-2 text-sm focus:border-forest-500 focus:outline-none"
            placeholder="Bize detayları iletin"
          />
          {errors.message ? <span className="text-xs text-rose-600">{errors.message.message}</span> : null}
        </label>
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Gönderiliyor..." : "Mesajı Gönder"}
        </Button>
        {submitted ? <p className="text-xs text-forest-600">Teşekkürler! En kısa sürede döneceğiz.</p> : null}
      </form>
    </div>
  );
}

export default ContactForm;
