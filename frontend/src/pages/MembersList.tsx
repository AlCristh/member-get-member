import { useEffect, useMemo, useState } from "react";
import { getMembers } from "../api/members";
import type { Member } from "../types/Member";

type LoadState = "idle" | "loading" | "ready" | "error";

export default function MembersList() {
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function load(): Promise<void> {
      setState("loading");
      setError(null);

      try {
        const data = await getMembers();
        if (!mounted) return;
        setMembers(data);
        setState("ready");
      } catch {
        if (!mounted) return;
        setState("error");
        setError(
          "Falha ao carregar membros. Verifique se o backend está rodando.",
        );
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;

    return members.filter((m) => {
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.referralCode.toLowerCase().includes(q)
      );
    });
  }, [members, query]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Members</h2>

        <div style={{ marginLeft: "auto" }}>
          <input
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder="Search by name, email or code..."
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              minWidth: 260,
            }}
          />
        </div>
      </div>

      {state === "loading" && <p>Loading...</p>}

      {state === "error" && (
        <div
          style={{ padding: 12, border: "1px solid #f3c2c2", borderRadius: 10 }}
        >
          <p style={{ margin: 0 }}>❌ {error}</p>
        </div>
      )}

      {state !== "loading" && state !== "error" && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Referral Code</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td style={td}>{m.id}</td>
                  <td style={td}>{m.name}</td>
                  <td style={td}>{m.email}</td>
                  <td style={td}>{m.referralCode}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td style={td} colSpan={4}>
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 8px",
  borderBottom: "1px solid #eee",
  fontWeight: 700,
};

const td: React.CSSProperties = {
  padding: "10px 8px",
  borderBottom: "1px solid #f3f3f3",
};
