import Cookies from "js-cookie";
import { AuthResponse, User } from "./types";

const AUTH_TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

export const authStorage = {
  getToken(): string | undefined {
    if (typeof window === "undefined") return undefined;
    return Cookies.get(AUTH_TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    Cookies.set(AUTH_TOKEN_KEY, token, {
      expires: 7,
      path: "/",
      sameSite: "strict",
    });
  },

  removeToken(): void {
    if (typeof window === "undefined") return;
    Cookies.remove(AUTH_TOKEN_KEY, { path: "/" });
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const userData = Cookies.get(USER_KEY);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    if (typeof window === "undefined") return;
    Cookies.set(USER_KEY, JSON.stringify(user), {
      expires: 7,
      path: "/",
      sameSite: "strict",
    });
  },

  removeUser(): void {
    if (typeof window === "undefined") return;
    Cookies.remove(USER_KEY, { path: "/" });
  },

  clear(): void {
    this.removeToken();
    this.removeUser();
  },

  persistAuth(authData: AuthResponse): void {
    this.setToken(authData.accessToken);
    this.setUser(authData.user);
  },
};

export function isAuthenticated(): boolean {
  return !!authStorage.getToken();
}

export function isStudent(): boolean {
  const user = authStorage.getUser();
  return user?.role === "STUDENT";
}
