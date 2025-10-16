import { render, screen } from "@testing-library/react";
import { AppHeader } from "@/components/layout/app-header";
import { AuthProvider } from "@/components/auth/auth-context";
import type { Session } from "@supabase/supabase-js";
import type { Tables } from "@/types";

jest.mock("@/lib/supabase/client", () => ({
  useSupabase: () => null,
  getBrowserClient: () => null,
}));

jest.mock("lucide-react", () => ({
  Menu: () => <span data-test-id="icon-menu" />,
  ChevronDown: () => <span data-test-id="icon-chevron" />,
  LogOut: () => <span data-test-id="icon-logout" />,
  Settings: () => <span data-test-id="icon-settings" />,
}));

jest.mock(
  "tailwind-merge",
  () => ({ __esModule: true, twMerge: (...inputs: string[]) => inputs.filter(Boolean).join(" ") }),
  { virtual: true }
);

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

function renderHeader(options: { session?: Session | null; profile?: Tables<"users"> | null } = {}) {
  render(
    <AuthProvider initialSession={options.session ?? null} initialProfile={options.profile ?? null}>
      <AppHeader />
    </AuthProvider>
  );
}

describe("AppHeader", () => {
  it("renders marketing links for guests", () => {
    renderHeader();
    expect(screen.getByText("Ana Sayfa")).toBeInTheDocument();
    expect(screen.queryByText("Panel")).not.toBeInTheDocument();
  });

  it("shows producer dashboard links", () => {
    const session = {
      user: {
        id: "1",
        email: "producer@ducktylo.test",
        user_metadata: { role: "producer" },
      },
    } as unknown as Session;

    renderHeader({ session });
    expect(screen.getByText("Panel")).toBeInTheDocument();
  });
});
