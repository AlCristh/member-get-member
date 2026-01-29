import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

type Props = { children: ReactNode };

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border bg-background p-4">
          <Link to="/" className="block text-lg font-semibold">
            Member Get Member
          </Link>

          <Separator className="my-4" />

          <nav className="flex flex-col gap-1">
            <NavLink
              to="/members"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-muted font-medium" : "hover:bg-muted/60"
                }`
              }
            >
              Members
            </NavLink>

            <NavLink
              to="/ranking"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-muted font-medium" : "hover:bg-muted/60"
                }`
              }
            >
              Ranking
            </NavLink>

            <NavLink
              to="/referrals"
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${
                  isActive ? "bg-muted font-medium" : "hover:bg-muted/60"
                }`
              }
            >
              Referrals
            </NavLink>
          </nav>
        </aside>

        <main className="rounded-xl border bg-background p-4">{children}</main>
      </div>
    </div>
  );
}
