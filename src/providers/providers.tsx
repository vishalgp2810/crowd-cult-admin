// @ts-nocheck
"use client";

import { RouterProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { fetchMeThunk } from "@/features/auth/authThunks";

export interface ProvidersProps {
  children: ReactNode;
}

/**
 * Custom Theme Manager to fix React 19 / Next.js 16 script-tag errors.
 * This completely replaces the buggy next-themes injection logic.
 */
export function Providers({ children }: ProvidersProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Mark as mounted on client
    setMounted(true);
    
    // 2. Force dark mode class on html element manually
    // This avoids the script injection that next-themes 0.4.x does.
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';

    // Restore session from HttpOnly cookie on app boot.
    store.dispatch(fetchMeThunk());
  }, []);

  return (
    <Provider store={store}>
      <RouterProvider navigate={router.push}>
        <div className={mounted ? "opacity-100 transition-opacity duration-300" : "opacity-0"}>
          {children}
        </div>
      </RouterProvider>
    </Provider>
  );
}
