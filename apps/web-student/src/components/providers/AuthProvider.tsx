"use client";

import {
  useContext,
  useEffect,
  useState,
  createContext,
  useCallback,
} from "react";
import { User } from "@/lib/types";
import { authStorage, isAuthenticated } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuth: boolean;
  login: (authData: { accessToken: string; user: User }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedUser = authStorage.getUser();
    if (storedUser && isAuthenticated()) {
      setUser(storedUser);
    }
    setIsLoading(false);
    setMounted(true);
  }, []);

  const login = useCallback((authData: { accessToken: string; user: User }) => {
    authStorage.persistAuth(authData);
    setUser(authData.user);
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading: !mounted || isLoading,
    isAuth: mounted && !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
