import { apiFetch } from "./http";

export type AuthResponse = { token: string };

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  referredByCode: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export function register(payload: RegisterPayload) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
