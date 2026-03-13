import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("vireon_admin_token"));
  const [, setLocation] = useLocation();

  const login = (newToken: string) => {
    localStorage.setItem("vireon_admin_token", newToken);
    setToken(newToken);
    setLocation("/admin/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("vireon_admin_token");
    setToken(null);
    setLocation("/admin");
  };

  return { token, isAuthenticated: !!token, login, logout };
}

export function useUserAuth() {
  const [key, setKey] = useState<string | null>(localStorage.getItem("vireon_user_key"));
  const [, setLocation] = useLocation();

  const login = (newKey: string) => {
    localStorage.setItem("vireon_user_key", newKey);
    setKey(newKey);
    setLocation("/dashboard/home");
  };

  const logout = () => {
    localStorage.removeItem("vireon_user_key");
    setKey(null);
    setLocation("/dashboard");
  };

  // Pre-configured headers object for Orval generated hooks
  const authHeaders = {
    headers: {
      "x-user-key": key || "",
    },
  };

  return { key, isAuthenticated: !!key, login, logout, authHeaders };
}
