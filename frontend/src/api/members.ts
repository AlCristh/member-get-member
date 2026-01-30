import { apiFetch } from "./http";

export type MemberDTO = {
  id: number;
  name: string;
  email: string;
  referralCode: string;
  credits: number;
};

export type RankingRowDTO = {
  id: number;
  name: string;
  email: string;
  referralCode: string;
  credits: number;
};

export function getMembers(): Promise<MemberDTO[]> {
  return apiFetch<MemberDTO[]>("/members");
}

export function getRanking(): Promise<RankingRowDTO[]> {

  return apiFetch<RankingRowDTO[]>("/members/ranking");

  
}

export function getMe(): Promise<MemberDTO> {
  return apiFetch<MemberDTO>("/members/me");
}

