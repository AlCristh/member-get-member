import { useEffect, useState } from "react";
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

  useEffect(() => {
    let cancelled = false;

    getMe()
      .then((data) => {
        if (cancelled) return;
        setMe(data);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Não foi possível carregar o dashboard.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p style={{ padding: 16 }}>{error}</p>;
  if (!me) return <p style={{ padding: 16 }}>Carregando...</p>;

  const referralLink = `${window.location.origin}/register?ref=${me.referralCode}`;

  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard</h2>

      <div style={{ marginTop: 16 }}>
        <p>
          <b>Nome:</b> {me.name}
        </p>
        <p>
          <b>Email:</b> {me.email}
        </p>
        <p>
          <b>Créditos:</b> {me.credits}
        </p>

        <p>
          <b>Seu código de indicação:</b>
        </p>
        <code>{me.referralCode}</code>

        <p style={{ marginTop: 12 }}>
          <b>Link de indicação:</b>
        </p>
        <input
          readOnly
          value={referralLink}
          style={{ width: "100%", padding: 8 }}
          onClick={(e) => e.currentTarget.select()}
        />
      </div>
    </div>
  );
}
