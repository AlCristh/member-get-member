import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearToken } from "../api/authToken";

function NavLink({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={[
        "text-sm font-medium px-3 py-2 rounded-xl transition",
        active
          ? "bg-gray-900 text-white"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function AppLayout() {
  const navigate = useNavigate();

  function onLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="app-container py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Brand */}
            <Link to="/app" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-gray-900 text-white grid place-items-center font-bold">
                M
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-gray-900">
                  Member Get Member
                </div>
                <div className="text-xs text-gray-500">
                  Indicações e créditos
                </div>
              </div>
            </Link>

            {/* Nav */}
            <nav className="flex flex-wrap gap-2 md:ml-6">
              <NavLink to="/app" label="Dashboard" />
              <NavLink to="/app/members" label="Members" />
              <NavLink to="/app/referrals" label="Referrals" />
              <NavLink to="/app/ranking" label="Ranking" />
            </nav>

            <div className="md:ml-auto" />

            {/* Logout */}
            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 active:scale-[0.99]"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="app-container">
        <Outlet />
      </main>
    </div>
  );
}
