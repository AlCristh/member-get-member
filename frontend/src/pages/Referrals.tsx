import { useEffect, useMemo, useState } from "react";
import {
  getReferrals,
  inviteReferral,
  resendReferral,
  type ReferralDTO,
} from "../api/referrals";

type LoadState = "loading" | "ready" | "error";

export default function Referrals() {
  const [state, setState] = useState<LoadState>("loading");
  const [items, setItems] = useState<ReferralDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  async function load(): Promise<void> {
    try {
      setState("loading");
      setError(null);
      const data = await getReferrals();
      setItems(data ?? []);
      setState("ready");
    } catch {
      setError("Falha ao carregar indicações.");
      setState("error");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const ordered = useMemo(() => {
    // CADASTRADO primeiro, depois CONVIDADO, e mais recente no topo
    return [...items].sort((a, b) => {
      if (a.status !== b.status) return a.status === "CADASTRADO" ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [items]);

  async function onInvite(): Promise<void> {
    const email = inviteEmail.trim();
    if (!email) return;

    try {
      setInviteLoading(true);
      await inviteReferral(email);
      setInviteEmail("");
      await load();
    } catch {
      alert(
        "Não foi possível criar o convite. Verifique o e-mail e tente novamente.",
      );
    } finally {
      setInviteLoading(false);
    }
  }

  async function onResend(id: number): Promise<void> {
    try {
      await resendReferral(id);
      await load();
    } catch {
      alert("Não foi possível reenviar.");
    }
  }

  if (state === "loading") return <div>Carregando indicações...</div>;
  if (state === "error") return <div>{error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Indicações</h2>

      {/* criar convite */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          margin: "12px 0",
        }}
      >
        <input
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Email do convidado (ex: pessoa@email.com)"
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #ddd",
            width: 360,
            maxWidth: "100%",
          }}
        />
        <button
          onClick={onInvite}
          disabled={inviteLoading}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          {inviteLoading ? "Convidando..." : "Convidar"}
        </button>
      </div>

      {ordered.length === 0 ? (
        <p>Nenhuma indicação ainda.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Convidado</th>
                <th style={th}>Status</th>
                <th style={th}>Data convite</th>
                <th style={th}>Data cadastro</th>
                <th style={th}>Reenvios</th>
                <th style={th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((r) => {
                const who =
                  r.referredEmail ??
                  r.invitedEmail ??
                  (r.referredId ? `Member #${r.referredId}` : "-");

                return (
                  <tr key={r.id}>
                    <td style={td}>{r.id}</td>
                    <td style={td}>{who}</td>
                    <td style={td}>{r.status}</td>
                    <td style={td}>
                      {r.invitedAt
                        ? new Date(r.invitedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td style={td}>
                      {r.registeredAt
                        ? new Date(r.registeredAt).toLocaleString()
                        : "-"}
                    </td>
                    <td style={td}>{r.resendCount ?? 0}</td>
                    <td style={td}>
                      {r.status === "CONVIDADO" ? (
                        <button
                          onClick={() => onResend(r.id)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            cursor: "pointer",
                          }}
                        >
                          Reenviar
                        </button>
                      ) : (
                        <span style={{ color: "#666" }}>—</span>
                      )}
                    </td>
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
