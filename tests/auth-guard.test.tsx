import { render, screen } from "@testing-library/react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AuthProvider } from "@/components/auth/auth-context";
import type { Session } from "@supabase/supabase-js";

jest.mock("@/lib/supabase/client", () => ({
  useSupabase: () => null,
  getBrowserClient: () => null,
}));

jest.mock("lucide-react", () => ({
  ChevronDown: () => <span />, 
  LogOut: () => <span />, 
  Settings: () => <span />, 
  Menu: () => <span />,
}));

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    mockReplace.mockReset();
  });

  it("redirects guests to sign-in", () => {
    render(
      <AuthProvider initialSession={null} initialProfile={null}>
        <AuthGuard>
          <div>private</div>
        </AuthGuard>
      </AuthProvider>
    );

    expect(mockReplace).toHaveBeenCalledWith("/auth/sign-in");
    expect(screen.queryByText("private")).not.toBeInTheDocument();
  });

  it("renders content for allowed roles", () => {
    const session = {
      user: { id: "1", email: "writer@test", user_metadata: { role: "writer" } },
    } as unknown as Session;

    render(
      <AuthProvider
        initialSession={session}
        initialProfile={{ id: "1", email: "writer@test", role: "writer", created_at: "", updated_at: "" }}
      >
        <AuthGuard allowedRoles={["writer"]}>
          <div>writer</div>
        </AuthGuard>
      </AuthProvider>
    );

    expect(screen.getByText("writer")).toBeInTheDocument();
  });
});
