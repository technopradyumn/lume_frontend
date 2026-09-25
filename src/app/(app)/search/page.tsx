"use client";

import { Suspense } from "react";
import { SearchResultsPage } from "@/features/videos/pages/SearchResultsPage";

export default function SearchRoute() {
  return (
    <Suspense fallback={<div className="app-loading"><div /></div>}>
      <SearchResultsPage />
    </Suspense>
  );
}
