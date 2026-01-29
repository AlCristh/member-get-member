import { NavLink, Outlet } from "react-router-dom";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: "block",
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  color: "inherit",
  background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
});

export default function DashboardLayout() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        minHeight: "100vh",
      }}
    >
      <aside
        style={{ padding: 16, borderRight: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div style={{ fontWeight: 700, marginBottom: 12 }}>
          Member Get Member
        </div>

        <nav style={{ display: "grid", gap: 8 }}>
          <NavLink to="/members" style={linkStyle}>
            Members
          </NavLink>
          <NavLink to="/referrals" style={linkStyle}>
            Referrals
          </NavLink>
          <NavLink to="/ranking" style={linkStyle}>
            Ranking
          </NavLink>
        </nav>
      </aside>

      <main style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: 600 }}>Dashboard</div>
          <div style={{ opacity: 0.8 }}>Frontend (React + TS)</div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
