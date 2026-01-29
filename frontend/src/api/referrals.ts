import { api } from "./http";
import type { Referral } from "../types/Referral";

export async function getReferrals(): Promise<Referral[]> {
  const { data } = await api.get<Referral[]>("/api/referrals");
  return data;
}
