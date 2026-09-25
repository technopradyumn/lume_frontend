"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../shared/context/AuthContext";
import { LandingPage } from "../features/auth/pages/LandingPage";

export default function RootPage() {
  const { isAuthenticated, isDemo, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace("/dashboard");
    } else if (isDemo) {
      router.replace("/demo");
    }
  }, [isAuthenticated, isDemo, isLoading, router]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div />
      </div>
    );
  }

  if (isAuthenticated || isDemo) {
    return null;
  }

  return <LandingPage />;
}
