import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { clearToken, setToken } from "../api/authToken";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // garante que sempre começa DESLOGADO ao entrar na tela de login
  useEffect(() => {
    clearToken();
  }, []);

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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border p-6 bg-white">
        <h1 className="text-xl font-semibold">Entrar</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acesse sua conta para ver dashboard e indicações.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">E-mail</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Senha</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button
            className="w-full rounded-md bg-black text-white py-2 disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          Não tem conta?{" "}
          <Link className="underline" to="/register">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
