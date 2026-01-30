import { useMemo, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { register } from "../api/auth";
import { setToken } from "../api/authToken";

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const referralFromUrl = useMemo(() => {
    const v = params.get("ref") || params.get("code") || "";
    return v.trim().toUpperCase();
  }, [params]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referredByCode, setReferredByCode] = useState(referralFromUrl);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const codeLocked = Boolean(referralFromUrl);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const code = referredByCode.trim().toUpperCase();

      const res = await register({
        name,
        email,
        password,
        // se vazio, manda null (se seu backend aceitar null) — se não aceitar, manda "".
        referredByCode: code ? code : null,
      });

      setToken(res.token);
      navigate("/", { replace: true });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao cadastrar.";
      setError(
        msg ||
          "Não foi possível cadastrar. Verifique e-mail e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border p-6 bg-white">
        <h1 className="text-xl font-semibold">Criar conta</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Se tiver um código de indicação, ele entra automaticamente pelo link.
        </p>

        {codeLocked ? (
          <div className="mt-3 text-xs rounded-md border px-3 py-2 bg-gray-50">
            Código aplicado pelo link: <b>{referralFromUrl}</b>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Nome</label>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              minLength={6}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              Código de indicação (opcional)
            </label>
            <input
              className="w-full rounded-md border px-3 py-2"
              value={referredByCode}
              onChange={(e) => setReferredByCode(e.target.value)}
              placeholder="Ex.: ABC12345"
              readOnly={codeLocked}
            />
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button
            className="w-full rounded-md bg-black text-white py-2 disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          Já tem conta?{" "}
          <Link className="underline" to="/login">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
