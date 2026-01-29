export type Referral = {
  id: number;
  referrerId: number;
  referredId: number;
  referredName?: string;
  referredEmail?: string;
  status: string;
  createdAt: string;
};
