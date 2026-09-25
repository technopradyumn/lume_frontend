"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser as apiLogin,
  logoutUser as apiLogout,
  registerUser as apiRegister,
  UserSummary,
} from "../services/api";

interface AuthContextType {
  user: UserSummary | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemo: boolean;
  login: (credentials: any) => Promise<any>;
  register: (formData: FormData | Record<string, any>) => Promise<any>;
  logout: () => Promise<void>;
  startDemo: () => void;
  endDemo: () => void;
  updateUserContext: (updates: Partial<UserSummary>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("lume_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
      const demoVal = sessionStorage.getItem("lume-demo") === "true";
      setIsDemo(demoVal);
    } catch {
      // Ignored
    }

    if (typeof window !== "undefined" && localStorage.getItem("lume_token")) {
      checkAuth();
    } else {
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("lume_user");
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const clearExpiredSession = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("lume_user");
      localStorage.removeItem("lume_token");
    };
    window.addEventListener("lume:session-expired", clearExpiredSession);
    return () => window.removeEventListener("lume:session-expired", clearExpiredSession);
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("lume_user", JSON.stringify(userData));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("lume_user");
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("lume_user");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: any) => {
    const data = await apiLogin(credentials);
    const loggedUser = data.user || data;
    const token = data.accessToken;
    setUser(loggedUser);
    setIsAuthenticated(true);
    localStorage.setItem("lume_user", JSON.stringify(loggedUser));
    if (token) localStorage.setItem("lume_token", token);
    sessionStorage.removeItem("lume-demo");
    setIsDemo(false);
    return data;
  };

  const register = async (formData: FormData | Record<string, any>) => {
    let body: FormData;
    if (formData instanceof FormData) {
      body = formData;
    } else {
      body = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) body.append(k, String(v));
      });
    }
    const data = await apiRegister(body);
    const registeredUser = data?.user || data;
    const token = data?.accessToken;
    setUser(registeredUser);
    setIsAuthenticated(true);
    localStorage.setItem("lume_user", JSON.stringify(registeredUser));
    if (token) localStorage.setItem("lume_token", token);
    sessionStorage.removeItem("lume-demo");
    setIsDemo(false);
    return data;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.warn("Server sign-out failed; local session cleared.", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsDemo(false);
      localStorage.removeItem("lume_user");
      localStorage.removeItem("lume_token");
      sessionStorage.removeItem("lume-demo");
    }
  };

  const startDemo = () => {
    sessionStorage.setItem("lume-demo", "true");
    setIsDemo(true);
  };

  const endDemo = () => {
    sessionStorage.removeItem("lume-demo");
    setIsDemo(false);
  };

  const updateUserContext = (updates: Partial<UserSummary>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem("lume_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isDemo,
        login,
        register,
        logout,
        startDemo,
        endDemo,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
