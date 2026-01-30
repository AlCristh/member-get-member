import { useEffect, useMemo, useState } from "react";
import { getMe } from "../api/members";

type Me = {
  id: number;
  name: string;
  email: string;
  referralCode: string;
  credits: number;
};

export default function Dashboard() {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  const referralLink = useMemo(() => {
    if (!me) return "";
    return `${window.location.origin}/register?ref=${me.referralCode}`;
  }, [me]);

  useEffect(() => {
    getMe()
      .then(setMe)
      .catch(() => setError("Não foi possível carregar o dashboard."));
  }, []);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copiado!");
    } catch {
      alert("Não foi possível copiar.");
    }
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (!me) return <p className="text-gray-600">Carregando...</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-gray-500">
          Veja seu código, link e saldo de créditos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-4 bg-gray-50">
          <div className="text-sm text-gray-500">Usuário</div>
          <div className="font-semibold">{me.name}</div>
          <div className="text-sm text-gray-600">{me.email}</div>
        </div>

        <div className="rounded-2xl border p-4 bg-gray-50">
          <div className="text-sm text-gray-500">Créditos</div>
          <div className="text-3xl font-bold leading-tight">{me.credits}</div>
          <div className="text-sm text-gray-600">Saldo atual</div>
        </div>

        <div className="rounded-2xl border p-4 bg-gray-50">
          <div className="text-sm text-gray-500">Seu código</div>
          <div className="mt-2 flex items-center gap-2">
            <code className="px-3 py-2 rounded-xl border bg-white font-mono text-sm">
              {me.referralCode}
            </code>
            <button
              onClick={() => copy(me.referralCode)}
              className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm"
            >
              Copiar
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-4">
        <div className="text-sm text-gray-500">Link de indicação</div>
        <div className="mt-2 flex flex-col md:flex-row gap-2">
          <input
            readOnly
            value={referralLink}
            className="w-full rounded-xl border px-3 py-2 bg-white text-sm"
            onClick={(e) => e.currentTarget.select()}
          />
          <button
            onClick={() => copy(referralLink)}
            className="px-3 py-2 rounded-xl bg-black text-white hover:opacity-90 text-sm"
          >
            Copiar link
          </button>
        </div>
      </div>
    </div>
  );
}
