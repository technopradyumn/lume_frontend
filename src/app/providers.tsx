"use client";

import React, { ReactNode } from "react";
import { ThemeProvider } from "../shared/context/ThemeContext";
import { AuthProvider } from "../shared/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
