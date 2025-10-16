"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
  "/": "ducktylo | Senaryo Pazaryeri",
  "/about": "Hakkımızda | ducktylo",
  "/how-it-works": "Nasıl Çalışır | ducktylo",
  "/plans": "Planlar | ducktylo",
  "/contact": "İletişim | ducktylo",
  "/browse": "Keşfet | ducktylo",
};

export function TabTitleHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const defaultTitle = "ducktylo | Senaryo Pazaryeri";
    document.title = titleMap[pathname] ?? defaultTitle;
  }, [pathname]);

  return null;
}
