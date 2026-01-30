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
        setMembers(data ?? []);
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
        (m.name ?? "").toLowerCase().includes(q) ||
        (m.email ?? "").toLowerCase().includes(q) ||
        (m.referralCode ?? "").toLowerCase().includes(q)
      );
    });
  }, [members, query]);

  return (
    <div style={page}>
      <div style={headerRow}>
        <div>
          <h2 style={{ margin: 0 }}>Members</h2>
          <p style={subtitle}>Lista de usuários cadastrados no sistema.</p>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <input
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder="Buscar por nome, email ou código..."
            style={input}
          />
        </div>
      </div>

      {state === "loading" && <p style={{ margin: 0 }}>Carregando...</p>}

      {state === "error" && (
        <div style={errorBox}>
          <p style={{ margin: 0 }}>❌ {error}</p>
        </div>
      )}

      {state !== "loading" && state !== "error" && (
        <div style={card}>
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>ID</th>
                  <th style={th}>Nome</th>
                  <th style={th}>Email</th>
                  <th style={th}>Código</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((m, idx) => (
                  <tr
                    key={m.id}
                    style={{
                      background:
                        idx % 2 === 0 ? "rgba(0,0,0,0.02)" : "transparent",
                    }}
                  >
                    <td style={td}>{m.id}</td>
                    <td style={tdStrong}>{m.name}</td>
                    <td style={td}>{m.email}</td>
                    <td style={tdMono}>{m.referralCode}</td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td style={{ ...td, padding: "14px 10px" }} colSpan={4}>
                      Nenhum resultado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const page: React.CSSProperties = {
  display: "grid",
  gap: 12,
  padding: 16,
};

const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  flexWrap: "wrap",
};

const subtitle: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#666",
  fontSize: 14,
};

const card: React.CSSProperties = {
  border: "1px solid #e6e6e6",
  borderRadius: 14,
  background: "#fff",
  padding: 8,
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 10px",
  borderBottom: "1px solid #e6e6e6",
  fontWeight: 700,
  whiteSpace: "nowrap",
  background: "rgba(0,0,0,0.04)",
};

const td: React.CSSProperties = {
  padding: "12px 10px",
  borderBottom: "1px solid #f0f0f0",
  whiteSpace: "nowrap",
};

const tdStrong: React.CSSProperties = {
  ...td,
  fontWeight: 600,
};

const tdMono: React.CSSProperties = {
  ...td,
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
};

const input: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #ddd",
  width: 320,
  maxWidth: "100%",
  background: "#fff",
};

const errorBox: React.CSSProperties = {
  padding: 12,
  border: "1px solid #f3c2c2",
  borderRadius: 12,
  background: "#fff5f5",
};
