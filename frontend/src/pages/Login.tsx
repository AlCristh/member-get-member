import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { setToken, getToken, clearToken } from "../api/authToken";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Se já tem token válido no storage, manda direto pro app.
  // (Se você preferir sempre forçar login, comente esse bloco)
  useEffect(() => {
    const token = getToken();
    if (token) navigate("/app", { replace: true });
  }, [navigate]);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login({ email, password });
      setToken(res.token);
      navigate("/app", { replace: true });
    } catch {
      setError("Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  }

  function onResetSavedToken() {
    clearToken();
    setError("Token removido. Faça login novamente.");
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ textAlign: "left" }}>
          <h1 style={title}>Member Get Member</h1>
          <p style={sub}>
            Entre com sua conta para ver dashboard, ranking e suas indicações.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          style={{ marginTop: 16, display: "grid", gap: 12 }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <label style={label}>E-mail</label>
            <input
              style={input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="voce@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={label}>Senha</label>
            <input
              style={input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error ? <div style={errorText}>⚠️ {error}</div> : null}

          <button style={primaryBtn} disabled={loading} type="submit">
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div style={dividerRow}>
            <div style={divider} />
            <span style={dividerText}>ou</span>
            <div style={divider} />
          </div>

          <Link to="/register" style={secondaryBtn}>
            Criar conta
          </Link>

          <button type="button" onClick={onResetSavedToken} style={ghostBtn}>
            Limpar token salvo
          </button>
        </form>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 16,
  background:
    "radial-gradient(900px 400px at 20% 10%, rgba(0,0,0,0.06), transparent), radial-gradient(700px 300px at 80% 20%, rgba(0,0,0,0.05), transparent)",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  border: "1px solid #e6e6e6",
  borderRadius: 16,
  background: "#fff",
  padding: 20,
  boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: -0.3,
};

const sub: React.CSSProperties = {
  margin: "8px 0 0",
  color: "#666",
  fontSize: 14,
  lineHeight: 1.4,
};

const label: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#222",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#fff",
  outline: "none",
};

const primaryBtn: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const secondaryBtn: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#fff",
  color: "#111",
  textDecoration: "none",
  fontWeight: 700,
};

const ghostBtn: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px dashed #ddd",
  background: "transparent",
  cursor: "pointer",
  color: "#444",
};

const errorText: React.CSSProperties = {
  fontSize: 13,
  color: "#b42318",
  background: "#fff1f1",
  border: "1px solid #ffd0d0",
  borderRadius: 12,
  padding: "10px 12px",
};

const dividerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 4,
};

const divider: React.CSSProperties = {
  height: 1,
  background: "#eee",
  flex: 1,
};

const dividerText: React.CSSProperties = {
  fontSize: 12,
  color: "#888",
};
