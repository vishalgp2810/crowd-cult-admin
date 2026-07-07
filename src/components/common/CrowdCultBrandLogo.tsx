"use client";

import Link from "next/link";
import { cn } from "@/components/admin/cn";

const LOGO_SRC = "/SHORT-LOGO.png";

type CrowdCultBrandLogoProps = {
  href?: string;
  onClick?: () => void;
  /** sm = login, md = sidebar, lg = marketing */
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  /** sidebar = small label + subtitle; login = large CROWD&CULT only */
  wordmarkStyle?: "sidebar" | "login";
  subtitle?: string;
  className?: string;
  collapsed?: boolean;
};

const sizeMap = {
  sm: "w-20 h-20 sm:w-24 sm:h-24",
  md: "w-10 h-10",
  lg: "w-12 h-12 md:w-16 md:h-16",
};

export function CrowdCultBrandLogo({
  href,
  onClick,
  size = "md",
  showWordmark = true,
  wordmarkStyle = "sidebar",
  subtitle,
  className,
  collapsed = false,
}: CrowdCultBrandLogoProps) {
  const inner = (
    <>
      <span
        className={cn(
          "flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
          sizeMap[size]
        )}
      >
        <img
          src={LOGO_SRC}
          alt="Crowd&Cult"
          className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(168,85,247,0.25)]"
        />
      </span>
      {showWordmark && !collapsed && (
        <div className="min-w-0">
          {wordmarkStyle === "sidebar" ? (
            <>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/40 leading-none mb-0.5">
                Crowd&Cult
              </p>
              <p className="text-[15px] font-black text-white leading-none tracking-tight">
                {subtitle || "Admin Console"}
              </p>
            </>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter italic text-center leading-none text-white">
              CROWD<span className="text-yellow-500">&</span>CULT
            </h1>
          )}
        </div>
      )}
    </>
  );

  const wrapCls = cn("flex items-center group", collapsed ? "gap-0 justify-center" : "gap-3", className);

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={wrapCls}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={wrapCls} onClick={onClick} role={onClick ? "button" : undefined}>
      {inner}
    </div>
  );
}
