"use client";

import { usePathname } from "next/navigation";
import { getPageMeta } from "./adminNavConfig";
import { IconMenu, IconBell, IconSearch } from "./AdminIcons";

type AdminTopHeaderProps = {
  onOpenMobileMenu: () => void;
};

export function AdminTopHeader({ onOpenMobileMenu }: AdminTopHeaderProps) {
  const pathname = usePathname() || "/";
  getPageMeta(pathname);

  return (
    <header
      className="shrink-0 sticky top-0 z-30"
      style={{
        background: "rgba(9,9,15,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="px-4 sm:px-6 flex items-center justify-between gap-4 h-[60px]">

        {/* Left: Hamburger */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden shrink-0 h-9 w-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
          >
            <IconMenu className="w-5 h-5" />
          </button>

        </div>

        {/* Right: icon actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-150"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            aria-label="Search"
          >
            <IconSearch className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-150"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            aria-label="Notifications"
          >
            <IconBell className="w-4 h-4" />
          </button>
        </div>
      </div>

    </header>
  );
}
