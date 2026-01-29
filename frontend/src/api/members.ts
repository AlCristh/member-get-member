import { api } from "./http";
import type { Member } from "../types/Member";

export async function getMembers(): Promise<Member[]> {
  const response = await api.get<Member[]>("/members");
  return response.data;
}

export async function getRanking(): Promise<Member[]> {
  const response = await api.get<Member[]>("/members/ranking");
  return response.data;
}
