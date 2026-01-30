import { apiFetch } from "./http";

export type ReferralDTO = {
  id: number;

  referrerId: number;
  referredId: number | null;

  referredName: string | null;
  referredEmail: string | null;

  invitedEmail: string | null;

  status: "CONVIDADO" | "CADASTRADO";

  createdAt: string;
  invitedAt: string | null;
  registeredAt: string | null;

  resendCount: number;
  lastResentAt: string | null;

  creditedAt: string | null;
};

export function getReferrals(): Promise<ReferralDTO[]> {
  return apiFetch<ReferralDTO[]>("/referrals/my");
}

export function inviteReferral(invitedEmail: string): Promise<ReferralDTO> {
  return apiFetch<ReferralDTO>("/referrals/invite", {
    method: "POST",
    body: JSON.stringify({ invitedEmail }),
  });
}

export function resendReferral(id: number): Promise<ReferralDTO> {
  return apiFetch<ReferralDTO>(`/referrals/${id}/resend`, {
    method: "POST",
  });
}
