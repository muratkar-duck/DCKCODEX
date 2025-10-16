import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppHeader } from "@/components/layout/app-header";
import { BackToTop } from "@/components/common/back-to-top";
import { TabTitleHandler } from "@/components/common/tab-title-handler";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ducktylo Senaryo Pazaryeri",
  description:
    "Yazarlar ve yapımcılar için güvenli, şeffaf ve hızlı senaryo pazaryeri. Senaryoları keşfedin, ilan açın, başvurularınızı yönetin.",
};

type InitialSessionResult = {
  session: Parameters<typeof Providers>[0]["initialSession"];
  profile: Tables<"users"> | null;
};

async function resolveInitialSession(): Promise<InitialSessionResult> {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return { session: null, profile: null };
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return { session: null, profile: null };
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    return { session, profile: profile ?? null };
  } catch (error) {
    console.error("Failed to resolve initial Supabase session", error);
    return { session: null, profile: null };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, profile } = await resolveInitialSession();

  return (
    <html lang="tr" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-krem text-forest-900 antialiased`}
      >
        <Providers initialSession={session} initialProfile={profile}>
          <TabTitleHandler />
          <AppHeader />
          <main className="min-h-[70vh] bg-gradient-to-b from-forest-50/60 via-krem to-krem">
            {children}
          </main>
          <footer className="border-t border-forest-100 bg-forest-900/95 py-10 text-krem">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-sm md:flex-row md:items-center md:justify-between">
              <p className="font-semibold">ducktylo • hikayeler hak ettiği yapımcısıyla buluşsun.</p>
              <p className="text-forest-200">Destek: support@ducktylo.test</p>
            </div>
          </footer>
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
