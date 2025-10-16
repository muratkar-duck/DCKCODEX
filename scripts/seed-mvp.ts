import { createClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/types";
import "dotenv/config";

const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!serviceRole || !url) {
  throw new Error("Seed script çalıştırılmadan önce Supabase ortam değişkenleri ayarlanmalıdır.");
}

const supabase = createClient<Database>(url, serviceRole, {
  auth: { persistSession: false },
});

async function upsertUser(email: string, role: "writer" | "producer") {
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (data) {
    await supabase.from("users").update({ role }).eq("id", data.id);
    return data.id;
  }

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: "password",
    email_confirm: true,
    user_metadata: { role },
  });

  if (authError || !authUser.user) {
    throw authError ?? new Error("Kullanıcı oluşturulamadı");
  }

  const profile: TablesInsert<"users"> = {
    id: authUser.user.id,
    email,
    role,
  };
  await supabase.from("users").upsert(profile);
  return authUser.user.id;
}

async function main() {
  const writerId = await upsertUser("writer@ducktylo.test", "writer");
  const producerId = await upsertUser("producer@ducktylo.test", "producer");

  const scripts: TablesInsert<"scripts">[] = [
    {
      title: "Göbeklitepe Günlükleri",
      genre: "Drama",
      synopsis: "Göbeklitepe kazılarında geçen gerilimli bir yolculuk.",
      description: "Anadolu'nun mistik tarihini günümüze taşıyan karakter odaklı hikaye.",
      price_cents: 320000,
      owner_id: writerId,
      length: 110,
    },
    {
      title: "Sahildeki Düşler",
      genre: "Romantik",
      synopsis: "Ege kasabasında yolları kesişen iki yabancının hikayesi.",
      description: "Yaz mevsiminde geçen, umut dolu bir romantik dram.",
      price_cents: 270000,
      owner_id: writerId,
      length: 98,
    },
  ];

  for (const script of scripts) {
    await supabase.from("scripts").upsert(script, { onConflict: "title" });
  }

  const listings: TablesInsert<"producer_listings">[] = [
    {
      owner_id: producerId,
      title: "Festival İçin Duygusal Uzun Metraj Aranıyor",
      description: "Uluslararası festival seçkisine uygun, karakter odaklı bir senaryo arıyoruz.",
      genre: "Drama",
      budget_cents: 4500000,
    },
    {
      owner_id: producerId,
      title: "Belgesel Ortak Yapım İlanı",
      description: "Doğa ve arkeoloji temalı, ortak yapım fırsatlarına açık belgesel projesi.",
      genre: "Belgesel",
      budget_cents: 2200000,
    },
  ];

  for (const listing of listings) {
    await supabase.from("producer_listings").upsert(listing, { onConflict: "title" });
  }

  const { data: scriptData } = await supabase
    .from("scripts")
    .select("id, title")
    .eq("owner_id", writerId);
  const gobeklitepe = scriptData?.find((item) => item.title === "Göbeklitepe Günlükleri");
  const sahil = scriptData?.find((item) => item.title === "Sahildeki Düşler");

  if (gobeklitepe) {
    await supabase
      .from("orders")
      .upsert({ script_id: gobeklitepe.id, buyer_id: producerId, amount_cents: 350000 }, { onConflict: "script_id" });
  }

  let applicationId: string | undefined;
  if (sahil) {
    const { data } = await supabase
      .from("applications")
      .upsert(
        {
          writer_id: writerId,
          script_id: sahil.id,
          producer_id: producerId,
          owner_id: writerId,
          status: "accepted",
        },
        { onConflict: "script_id" }
      )
      .select("id")
      .maybeSingle();
    applicationId = data?.id ?? undefined;
  }

  if (applicationId) {
    const { data: conversation } = await supabase
      .rpc("ensure_conversation_with_participants", {
        application_id: applicationId,
        acting_user_id: producerId,
      })
      .maybeSingle();

    if (conversation) {
      await supabase.from("messages").upsert(
        [
          {
            conversation_id: conversation.id,
            sender_id: producerId,
            body: "Merhaba, projenizi beğendik ve birlikte çalışmak istiyoruz!",
          },
          {
            conversation_id: conversation.id,
            sender_id: writerId,
            body: "Harika! Detayları konuşmak için sabırsızlanıyorum.",
          },
        ],
        { onConflict: "id" }
      );
    }
  }

  await supabase.from("notification_queue").insert({
    recipient_id: writerId,
    template: "interest",
    payload: { script: "Göbeklitepe Günlükleri" },
  });

  console.log("Seed işlemi tamamlandı.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
