"use client";

import { Suspense } from "react";
import LineCallbackContent from "./LineCallbackContent";

export default function LineCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-white">
          <p>ログイン処理中...</p>
        </div>
      }
    >
      <LineCallbackContent />
    </Suspense>
  );
}
