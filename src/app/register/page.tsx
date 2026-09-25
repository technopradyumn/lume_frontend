"use client";

import { Suspense } from "react";
import { AuthPage } from "@/features/auth/pages/AuthPage";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="app-loading"><div /></div>}>
      <AuthPage />
    </Suspense>
  );
}
