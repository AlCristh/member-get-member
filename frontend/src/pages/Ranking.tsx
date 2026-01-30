import { useEffect, useMemo, useState } from "react";
import { getRanking } from "../api/members";
import type { Member } from "../types/Member";

type LoadState = "idle" | "loading" | "success" | "error";

function Medal({ pos }: { pos: number }) {
  const label = pos === 1 ? "🥇" : pos === 2 ? "🥈" : "🥉";
  const bg =
    pos === 1
      ? "bg-yellow-50 border-yellow-200 text-yellow-800"
      : pos === 2
        ? "bg-gray-50 border-gray-200 text-gray-700"
        : "bg-orange-50 border-orange-200 text-orange-800";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border ${bg}`}
    >
      <span>{label}</span>
      <span className="font-semibold">Top {pos}</span>
    </span>
  );
}

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
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">Ranking</h2>
        <p className="text-sm text-gray-500">
          Ordenado por créditos (maior primeiro). Empates seguem a regra do
          backend.
        </p>
      </div>

      <div className="rounded-2xl border p-4 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, email ou código..."
            className="w-full md:max-w-md rounded-xl border px-3 py-2 bg-white text-sm"
          />

          <div className="text-sm text-gray-600 md:ml-auto">
            {state === "success" ? (
              <span>
                Mostrando <b>{filtered.length}</b> de <b>{members.length}</b>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {state === "loading" && (
        <p className="text-gray-600">Carregando ranking...</p>
      )}

      {state === "error" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="m-0 text-red-700">{errorMessage}</p>
        </div>
      )}

      {state === "success" && filtered.length === 0 && (
        <p className="text-gray-600">Nenhum membro encontrado.</p>
      )}

      {state === "success" && filtered.length > 0 && (
        <div className="rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Nome
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Código
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                    Créditos
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Destaque
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((m, index) => {
                  const pos = index + 1;
                  const isTop3 = top3Ids.has(m.id);

                  return (
                    <tr
                      key={m.id}
                      className={[
                        "border-b last:border-b-0",
                        isTop3 ? "bg-yellow-50/40" : "",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3 text-gray-700">{pos}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {m.name}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{m.email}</td>
                      <td className="px-4 py-3">
                        <code className="px-2 py-1 rounded-lg border bg-white font-mono text-xs">
                          {m.referralCode}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {m.credits ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        {pos <= 3 ? (
                          <Medal pos={pos} />
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
