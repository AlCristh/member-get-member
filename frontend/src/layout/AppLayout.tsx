import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../api/authToken";

export default function AppLayout() {
  const navigate = useNavigate();

  function onLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div>
      <header style={{ padding: 16, borderBottom: "1px solid #e6e6e6" }}>
        <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link to="/app" style={{ fontWeight: 700 }}>
            Member Get Member
          </Link>

          <Link to="/app/members">Members</Link>
          <Link to="/app/referrals">Referrals</Link>
          <Link to="/app/ranking">Ranking</Link>

          <div style={{ flex: 1 }} />

          <button
            onClick={onLogout}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
