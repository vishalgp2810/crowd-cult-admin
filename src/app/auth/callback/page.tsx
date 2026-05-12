import { Suspense } from "react";
import { AuthCallbackClient } from "./AuthCallbackClient";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6">
          <p className="text-sm text-gray-400">Loading…</p>
        </main>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
