const KEY = "auth_token";

export function setToken(token: string) {
  sessionStorage.setItem(KEY, token);
}
export function getToken() {
  return sessionStorage.getItem(KEY);
}
export function clearToken() {
  sessionStorage.removeItem(KEY);
}
