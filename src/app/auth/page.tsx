import { Suspense } from "react";
import LoginPage from "@/components/auth/LoginPage";

export default function AdminAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/30 text-xs font-black uppercase">
          Loading…
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
