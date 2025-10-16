"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 320);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Button
      data-test-id="back-to-top"
      className="fixed bottom-6 right-6 z-40 rounded-full bg-forest-700 text-white shadow-lg hover:bg-forest-600"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      size="icon"
      variant="secondary"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
