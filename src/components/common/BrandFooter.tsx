"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ContactUsModal } from "./ContactUsModal";

export function BrandFooter({ className = "" }: { className?: string }) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer
      className={`relative pt-16 pb-8 px-6 border-t border-white/10 overflow-hidden text-center flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-[#02000A] to-[#02000A] ${className}`}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-[10vw] md:text-[6vw] font-black tracking-tighter leading-[0.8] mb-6 text-white drop-shadow-2xl"
        >
          Thank You
        </motion.h2>
        <p className="text-xs md:text-base font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-cyan-400 mb-12 max-w-4xl mx-auto leading-loose text-center">
          Join Us in Revolutionizing India&apos;s Live Entertainment Economy
        </p>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-12 items-start justify-between text-left mb-16">
          <div className="flex flex-col items-center md:items-start space-y-5">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-1.5 rounded-lg shadow-lg shadow-cyan-500/10">
                <span className="text-white text-lg font-black italic">C</span>
              </div>
              <span className="text-2xl font-black tracking-tighter italic text-white">
                cROWD&CULT
              </span>
            </div>
            <p className="text-gray-500 text-[11px] max-w-[220px] text-center md:text-left leading-relaxed">
              The Operating System for India&apos;s Live Entertainment Economy.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
              Navigation
            </span>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
              <button onClick={() => setIsContactOpen(true)} className="text-[11px] font-black uppercase tracking-widest text-white/70 hover:text-cyan-400 hover:tracking-[0.2em] transition-all">Contact Us</button>
              <Link href="/terms" className="text-[11px] font-black uppercase tracking-widest text-white/70 hover:text-purple-400 hover:tracking-[0.2em] transition-all">Terms</Link>
              <Link href="/privacy" className="text-[11px] font-black uppercase tracking-widest text-white/70 hover:text-purple-400 hover:tracking-[0.2em] transition-all">Privacy</Link>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
              Inquiries
            </span>
            <div className="flex flex-col items-center md:items-end gap-5">
              <a
                href="mailto:invest@crowdandcult.in"
                className="text-white hover:text-cyan-400 transition-colors flex items-center gap-2 text-[11px] font-bold tracking-tight"
              >
                <svg className="w-3.5 h-3.5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                invest@crowdandcult.in
              </a>
              <div className="flex gap-3">
                {/* X (Twitter) */}
                <a href="#" className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/40 transition-all group">
                  <svg className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/crowdandcult?igsh=MWF3c3BwYXhwM210OA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Crowd&Cult on Instagram"
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-purple-500/40 transition-all group"
                >
                  <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/18sA8Gp5Zr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Crowd&Cult on Facebook"
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-blue-500/40 transition-all group"
                >
                  <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-2 border-t border-white/10 pt-6 mt-4">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest bg-white/5 py-1.5 px-4 rounded-full border border-white/10 shadow-lg relative">
            Powered with <span className="text-red-500 animate-pulse inline-block mx-1">❤️</span> by Founder
          </span>
          <span className="text-[9px] text-gray-600 mt-2 tracking-widest">
            © 2026 cROWD&CULT. ALL RIGHTS RESERVED.
          </span>
          <div className="h-4" />
        </div>
      </div>

      <ContactUsModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </footer>
  );
}
