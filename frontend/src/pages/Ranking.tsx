import { useEffect, useMemo, useState } from "react";
import { getRanking } from "../api/members";
import type { Member } from "../types/Member";

type LoadState = "idle" | "loading" | "success" | "error";

export default function Ranking() {
  const [state, setState] = useState<LoadState>("idle");
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async (): Promise<void> => {
      setState("loading");
      setErrorMessage(null);

      try {
        const data = await getRanking();
        if (cancelled) return;

        setMembers(data ?? []);
        setState("success");
      } catch {
        if (cancelled) return;

        setErrorMessage("Não foi possível carregar o ranking.");
        setState("error");
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;

    return members.filter((m) => {
      const name = (m.name ?? "").toLowerCase();
      const email = (m.email ?? "").toLowerCase();
      const code = (m.referralCode ?? "").toLowerCase();
      return name.includes(q) || email.includes(q) || code.includes(q);
    });
  }, [members, query]);

  const top3Ids = useMemo(
    () => new Set(filtered.slice(0, 3).map((m) => m.id)),
    [filtered],
  );

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Ranking</h2>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, email ou código..."
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #ddd",
            width: 320,
            maxWidth: "100%",
          }}
        />
      </div>

      {state === "loading" && <p>Carregando ranking...</p>}

      {state === "error" && (
        <div
          style={{ padding: 12, border: "1px solid #f3c0c0", borderRadius: 8 }}
        >
          <p style={{ margin: 0 }}>{errorMessage}</p>
        </div>
      )}

      {state === "success" && filtered.length === 0 && (
        <p>Nenhum membro encontrado.</p>
      )}

      {state === "success" && filtered.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>#</th>
                <th style={th}>Nome</th>
                <th style={th}>Email</th>
                <th style={th}>Código</th>
                <th style={th}>Créditos</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m, index) => {
                const isTop3 = top3Ids.has(m.id);
                return (
                  <tr
                    key={m.id}
                    style={{
                      background: isTop3 ? "#fff7d6" : "transparent",
                    }}
                  >
                    <td style={td}>{index + 1}</td>
                    <td style={tdStrong}>{m.name}</td>
                    <td style={td}>{m.email}</td>
                    <td style={tdMono}>{m.referralCode}</td>
                    <td style={tdRight}>{m.credits ?? 0}</td>
                  </tr>
                );
              })}
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
  borderBottom: "1px solid #e6e6e6",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "10px 8px",
  borderBottom: "1px solid #f0f0f0",
  whiteSpace: "nowrap",
};

const tdRight: React.CSSProperties = {
  ...td,
  textAlign: "right",
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
