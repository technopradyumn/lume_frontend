import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser as apiLogin,
  logoutUser as apiLogout,
  registerUser as apiRegister,
} from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("lume_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("lume_user");
  });
  const [isLoading, setIsLoading] = useState(
    () => !!localStorage.getItem("lume_token"),
  );
  const [isDemo, setIsDemo] = useState(
    () => sessionStorage.getItem("lume-demo") === "true",
  );

  useEffect(() => {
    if (localStorage.getItem("lume_token")) {
      checkAuth();
    } else {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("lume_user");
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

  const login = async (credentials) => {
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

  const register = async (formData) => {
    const data = await apiRegister(formData);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
