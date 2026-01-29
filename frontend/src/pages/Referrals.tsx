import { useEffect, useState } from "react";
import { getReferrals } from "../api/referrals";
import type { Referral } from "../types/Referral";

export default function Referrals() {
  const [items, setItems] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReferrals();
        setItems(data);
      } catch {
        setError("Failed to load referrals.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading referrals...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Referrals</h1>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>ID</th>
            <th style={{ textAlign: "left", padding: 8 }}>Referred</th>
            <th style={{ textAlign: "left", padding: 8 }}>Status</th>
            <th style={{ textAlign: "left", padding: 8 }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: 8 }}>{r.id}</td>
              <td style={{ padding: 8 }}>
                {r.referredName ?? `Member #${r.referredId}`}
                {r.referredEmail ? ` (${r.referredEmail})` : ""}
              </td>
              <td style={{ padding: 8 }}>{r.status}</td>
              <td style={{ padding: 8 }}>
                {new Date(r.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
