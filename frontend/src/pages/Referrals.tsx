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

  if (state === "loading")
    return <div className="text-gray-600">Carregando indicações...</div>;
  if (state === "error") return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">Indicações</h2>
        <p className="text-sm text-gray-500">
          Convide por e-mail, acompanhe status e reenvie quando necessário.
        </p>
      </div>

      <div className="rounded-2xl border p-4 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Email do convidado (ex: pessoa@email.com)"
            className="w-full md:max-w-md rounded-xl border px-3 py-2 bg-white text-sm"
          />
          <button
            onClick={onInvite}
            disabled={inviteLoading}
            className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 disabled:opacity-60 text-sm"
          >
            {inviteLoading ? "Convidando..." : "Convidar"}
          </button>
        </div>
      </div>

      {ordered.length === 0 ? (
        <p className="text-gray-600">Nenhuma indicação ainda.</p>
      ) : (
        <div className="rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Convidado
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Data convite
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Data cadastro
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Reenvios
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordered.map((r) => {
                  const who =
                    r.referredEmail ??
                    r.invitedEmail ??
                    (r.referredId ? `Member #${r.referredId}` : "-");

                  const badge =
                    r.status === "CADASTRADO"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-800 border-yellow-200";

                  return (
                    <tr key={r.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 text-gray-700">{r.id}</td>
                      <td className="px-4 py-3 text-gray-900">{who}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-lg border ${badge}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {r.invitedAt
                          ? new Date(r.invitedAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {r.registeredAt
                          ? new Date(r.registeredAt).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {r.resendCount ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        {r.status === "CONVIDADO" ? (
                          <button
                            onClick={() => onResend(r.id)}
                            className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm"
                          >
                            Reenviar
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
