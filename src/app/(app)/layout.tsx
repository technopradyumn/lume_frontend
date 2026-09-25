"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/shared/components/Navbar";
import { Sidebar } from "@/shared/components/Sidebar";
import { BottomNav } from "@/shared/components/BottomNav";
import { PullToRefresh } from "@/shared/components/PullToRefresh";
import { clearApiCache } from "@/shared/services/api";
import { useAuth } from "@/shared/context/AuthContext";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isDemo, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isDemo) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, isDemo, router]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div />
      </div>
    );
  }

  if (!isAuthenticated && !isDemo) {
    return null;
  }

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setMobileMenuOpen((open) => !open);
    } else {
      setSidebarCollapsed((collapsed) => !collapsed);
    }
  };

  return (
    <div className="app">
      <Navbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onNavigate={() => setMobileMenuOpen(false)}
      />
      {mobileMenuOpen && (
        <div
          className="app__mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <main
        className={`main-content ${sidebarCollapsed ? "main-content--sidebar-collapsed" : ""}`}
      >
        <PullToRefresh
          onRefresh={async () => {
            clearApiCache();
          }}
        >
          {children}
        </PullToRefresh>
      </main>
      <BottomNav />
    </div>
  );
}
