"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* eslint-disable @next/next/no-img-element */

/* ─── Shared Glass Card Component ─── */
function GlassCard({ children, className = "", glowing = false }: { children: React.ReactNode, className?: string, glowing?: boolean }) {
  return (
    <div className={`relative rounded-3xl md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.15)] group/card ${className}`}>
      {glowing && (
        <>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-40 group-hover/card:opacity-100 transition-opacity duration-700" />
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none group-hover/card:bg-purple-500/30 transition-colors duration-700" />
        </>
      )}
      <div className="relative z-10 p-8 md:p-12 w-full flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}

/* ─── Scroll-Fade Wrapper Component ─── */
function FadeSection({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 1.0, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const [activeWord, setActiveWord] = useState("NIGHTS");
  const words = ["NIGHTS", "PAYOUTS", "TOUR", "ARTISTS", "CROWD"];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveWord((prev) => words[(words.indexOf(prev) + 1) % words.length]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#02000A]" />;

  return (
    <div className="min-h-screen bg-[#02000A] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      
      {/* ─── GLOBAL BACKGROUND EFFECTS ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/40 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-900/30 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] left-[20%] w-[60vw] h-[20vw] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen transform -rotate-12" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
      </div>

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 w-full z-[100] px-6 md:px-12 py-6 flex justify-between items-center bg-[#02000A]/50 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
          <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <span className="text-white text-xl md:text-2xl font-black italic shadow-lg shadow-cyan-500/20">C</span>
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter italic">cROWD&CULT</span>
        </div>
        
        <div className="hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
           {["Problem", "Solution", "Product", "Market"].map(item => (
             <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white hover:tracking-[0.4em] transition-all duration-300">{item}</a>
           ))}
        </div>

        <button 
          onClick={() => router.push("/auth")}
          className="relative group overflow-hidden bg-purple-600/20 border border-purple-500/30 hover:border-purple-400/50 px-6 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl backdrop-blur-md transition-all"
        >
           <span className="relative z-10 text-white text-[10px] font-black uppercase tracking-widest group-hover:text-black transition-colors delay-75">Launch OS</span>
           <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </button>
      </nav>

      {/* ─── PHASE 1: HERO (Restored Scale & Animated Word) ─── */}
      <motion.section style={{ scale: heroScale, opacity: heroOpacity }} className="relative pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center min-h-[90vh] text-center z-20">
        <div className="absolute top-32 right-6 md:right-12 text-[10px] md:text-xs font-black tracking-widest text-white/40 uppercase">Founded 2026</div>

        {/* Hero Badge */}
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="px-4 py-2 mt-8 md:mt-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-10 text-xs font-bold uppercase tracking-widest text-purple-300 backdrop-blur-sm relative"
        >
          <span className="absolute -inset-1 bg-purple-500/20 rounded-full blur-md opacity-0 hover:opacity-100 transition-opacity" />
          Secure Escrow Protocol v1.0
        </motion.div>
        
        {/* Massive Main Headline focusing on "SECURE THE [ANIMATED_WORD]" */}
        <h1 className="text-[3rem] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[8rem] font-bold text-white leading-[1.05] tracking-tight mb-8 flex flex-col items-center drop-shadow-2xl">
           <span className="mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
              SECURE THE
           </span>
           <span className="inline-block relative h-[1.1em] overflow-hidden w-full max-w-[800px]">
              <AnimatePresence mode="popLayout">
                 <motion.span 
                    key={activeWord}
                    initial={{ y: 80, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -80, opacity: 0, filter: "blur(10px)" }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute inset-x-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 font-black italic"
                 >
                    {activeWord}.
                 </motion.span>
              </AnimatePresence>
           </span>
        </h1>

        <motion.p 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="text-lg md:text-2xl text-purple-200/80 font-medium max-w-2xl mx-auto leading-relaxed px-4 mb-16"
        >
          The Operating System for India&apos;s Live Entertainment Economy. <br className="hidden md:block"/> The &apos;OTT&apos; for Live Music.
        </motion.p>

      </motion.section>

      {/* ─── STRIP: THE ASK (Pre-Seed Strip) ─── */}
      <section className="border-y border-white/[0.05] bg-gradient-to-r from-transparent via-purple-900/10 to-transparent py-10 md:py-16 backdrop-blur-md relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16 text-center">
            <div className="flex flex-col items-center gap-2">
               <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-gray-500">Stage</span>
               <span className="text-white/80 font-medium tracking-widest uppercase text-sm">Pre-Seed 2026</span>
            </div>
            <div className="h-px w-12 md:w-px md:h-12 bg-white/10" />
            <div className="flex flex-col items-center gap-2 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
               <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-cyan-500/80">The Ask</span>
               <span className="text-2xl md:text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">₹3 Crore</span>
            </div>
            <div className="h-px w-12 md:w-px md:h-12 bg-white/10" />
            <div className="flex flex-col items-center gap-2">
               <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-gray-500">Target</span>
               <span className="text-white/80 font-medium tracking-widest uppercase text-sm">₹100 Cr Valuation</span>
            </div>
         </div>
      </section>

      {/* ─── PHASE 2: THE PROBLEM ─── */}
      <section id="problem" className="py-24 md:py-40 px-6 md:px-12 max-w-[1400px] mx-auto z-20 relative">
        
        {/* The Gig Economy is Broken */}
        <FadeSection className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center mb-32 md:mb-52">
           <div>
              <h2 className="text-[10vw] md:text-[6vw] font-black tracking-tighter leading-none mb-8">
                The Gig <br/> Economy is <br/> <span className="text-red-500/80">Broken.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-6 font-medium">
                Artists starve waiting 30-90 days for payouts while middlemen take 30%+ cuts. Independent musicians struggle to survive in a system designed against them.
              </p>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-medium">
                Venues lose lakhs from last-minute cancellations. Managers waste 10+ hours/week on WhatsApp chaos.
              </p>
           </div>
           {/* Visual Container */}
           <div className="w-full aspect-[4/5] md:aspect-square rounded-[3rem] border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-all duration-700" />
              <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="Stressed Artist" />
           </div>
        </FadeSection>

        {/* Artists Starve & Venues Bleed */}
        <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
           {/* Left Stacked Realities */}
           <div className="lg:col-span-5 flex flex-col gap-8 md:gap-12 lg:-mt-20">
              <GlassCard className="translate-y-0 lg:translate-y-12">
                 <div className="flex justify-between items-start mb-6">
                   <h3 className="text-2xl md:text-3xl font-black tracking-tighter">The Artist&apos;s Reality</h3>
                   <span className="text-4xl text-white/20">&quot;</span>
                 </div>
                 <p className="text-sm md:text-base text-gray-400 italic leading-relaxed">
                   For indie artists, performing isn&apos;t just passion—it&apos;s survival. Yet most wait months for payment, juggling multiple gigs just to make rent. The talent is there; the financial security isn&apos;t.
                 </p>
              </GlassCard>
              <GlassCard className="translate-y-0 lg:translate-y-12">
                 <div className="flex justify-between items-start mb-6">
                   <h3 className="text-2xl md:text-3xl font-black tracking-tighter">The Venue&apos;s Nightmare</h3>
                   <span className="text-4xl text-white/20">&quot;</span>
                 </div>
                 <p className="text-sm md:text-base text-gray-400 italic leading-relaxed">
                   Venue managers spend 10+ hours weekly on WhatsApp chaos—coordinating artists, handling cancellations, chasing payments. Every no-show costs lakhs in lost revenue and disappointed crowds.
                 </p>
              </GlassCard>
           </div>
           
           {/* Right Header & Image */}
           <FadeSection className="lg:col-span-7 flex flex-col justify-end">
              <h2 className="text-[11vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] mb-12 text-right lg:text-left">
                Artists Starve <br/> & Venues Bleed.
              </h2>
              <div className="w-full h-64 md:h-80 rounded-[3rem] border border-white/10 overflow-hidden relative group">
                 <div className="absolute inset-0 bg-purple-500/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-all duration-700" />
                 <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Live Performance Club" />
              </div>
           </FadeSection>
        </div>

        {/* 0 / ZERO Disconnection */}
        <FadeSection className="mt-32 md:mt-52">
           <h2 className="text-[12vw] md:text-[9vw] font-black tracking-tighter leading-[0.8] mb-16 text-center mix-blend-screen opacity-80 pb-6">
             The Crowd is <br/> Disconnected.
           </h2>
           <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <GlassCard>
                 <div className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10">0</div>
                 <h4 className="text-xl md:text-2xl font-black mb-4">The Problem</h4>
                 <p className="text-gray-400 text-sm md:text-base">Fans have no frictionless method to support artists they love. No digital bridge exists between the crowd and the talent performing for them.</p>
              </GlassCard>
              <GlassCard>
                 <div className="text-[80px] md:text-[120px] font-black leading-none tracking-tighter mt-10 md:mt-10 mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10">ZERO</div>
                 <h4 className="text-xl md:text-2xl font-black mb-4">The Lost Opportunity</h4>
                 <p className="text-gray-400 text-sm md:text-base">Artists perform to packed rooms but leave with zero audience data, zero direct fan relationships, and zero additional revenue from engaged crowds.</p>
              </GlassCard>
           </div>
        </FadeSection>
      </section>

      {/* ─── PHASE 3: OUR SOLUTION ─── */}
      <section id="solution" className="py-24 md:py-40 relative z-20 overflow-hidden">
         <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <FadeSection className="grid lg:grid-cols-2 gap-16 md:gap-24 mb-32 items-center">
               <div>
                  <h2 className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none mb-8">Our <br className="hidden md:block"/> Solution</h2>
                  <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                    Escrow & Frictionless Transacting: We eliminate the chaos with instant payouts via venue-funded escrow and UPI, 30-second bookings through a curated artist grid with upfront pricing, and guaranteed last-minute replacements.
                  </p>
               </div>
               <GlassCard glowing className="flex flex-col gap-12">
                  <div>
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 text-2xl mb-6">💸</div>
                    <h3 className="text-2xl font-black tracking-tighter mb-4">Instant Payouts</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Artists get paid immediately after performing through venue-funded escrow accounts. No more 30-90 day waits. UPI-powered instant settlement means artists can focus on their craft, not chasing payments.</p>
                  </div>
                  <div className="w-full h-px bg-white/10 my-8 flex-shrink-0 block" />
                  <div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 text-2xl mb-6">🚨</div>
                    <h3 className="text-2xl font-black tracking-tighter mb-4">SOS Panic Booking</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Artist cancelled last minute? Our algorithm guarantees a vetted replacement within 30 minutes. 30-second bookings via curated artist grid with standardized, upfront pricing. No more WhatsApp chaos.</p>
                  </div>
               </GlassCard>
            </FadeSection>

            {/* SOS Booking */}
            <div className="space-y-40">
               <FadeSection className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
                 <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-6">
                    <GlassCard>
                       <h3 className="text-xl font-black tracking-tighter mb-3">The Crisis</h3>
                       <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 italic">30-Minute Guarantee</p>
                       <p className="text-sm text-gray-400">Our SOS system guarantees a vetted replacement artist arrives within 30 minutes of any last-minute cancellation. Venues never face empty stages or refund chaos again.</p>
                    </GlassCard>
                    <GlassCard>
                       <h3 className="text-xl font-black tracking-tighter mb-3">The Solution</h3>
                       <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 italic">Zero Downtime Promise</p>
                       <p className="text-sm text-gray-400">Algorithm-backed matching ensures the replacement artist fits the venue&apos;s vibe and audience expectations. Automated contracts and instant escrow activation mean zero paperwork delays.</p>
                    </GlassCard>
                 </div>
                 <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-end">
                    <h2 className="text-[10vw] md:text-[6vw] font-black tracking-tighter leading-[0.8] mb-8 text-right text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                      SOS Panic <br/> Booking in Action
                    </h2>
                    <p className="text-gray-400 text-right max-w-lg mb-12">When a venue&apos;s headliner cancels 45 minutes before showtime, our algorithm instantly matches them with a verified replacement artist. The DJ arrives, plugs in, and the crowd never knows there was a crisis.</p>
                    <div className="w-full h-48 md:h-64 rounded-[3rem] border border-white/10 overflow-hidden relative group bg-[#050011] flex flex-col items-center justify-center cursor-pointer shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
                       {/* Background radar pulse rings */}
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-24 h-24 md:w-32 md:h-32 border border-red-500/30 rounded-full animate-ping group-hover:border-cyan-500/40 transition-colors duration-700" style={{ animationDuration: '3s' }} />
                         <div className="absolute w-40 h-40 md:w-48 md:h-48 border border-red-500/10 rounded-full animate-ping group-hover:border-cyan-500/20 transition-colors duration-700" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                       </div>
                       
                       {/* Center UI */}
                       <div className="relative z-10 flex flex-col items-center gap-4 transition-transform duration-700 group-hover:scale-110">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-red-600/20 to-red-900/40 flex items-center justify-center border border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.4)] group-hover:from-cyan-500/20 group-hover:to-cyan-900/60 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-all duration-700 overflow-hidden backdrop-blur-md">
                             <span className="text-3xl md:text-4xl absolute group-hover:opacity-0 transition-opacity duration-300">🚨</span>
                             <div className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-500 delay-200">
                                <svg className="w-8 h-8 md:w-10 md:h-10 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                             </div>
                          </div>
                          
                          <div className="text-center overflow-hidden h-6 md:h-8">
                             <div className="group-hover:-translate-y-1/2 transition-transform duration-700 flex flex-col">
                                <span className="text-red-400 font-black tracking-[0.3em] text-[8px] md:text-[10px] uppercase h-6 md:h-8 flex items-center justify-center">Headliner Cancelled</span>
                                <span className="text-cyan-400 font-black tracking-[0.3em] text-[8px] md:text-[10px] uppercase h-6 md:h-8 flex items-center justify-center">Match Found: DJ Arjun</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               </FadeSection>
            </div>
         </div>
      </section>

      {/* ─── PHASE 4: THE PRODUCT ─── */}
      <section id="product" className="py-16 md:py-32 bg-[#0A0612] relative z-20">
         <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            
            <FadeSection viewport={{ amount: 0.1 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12 border-b border-white/10 pb-12 mb-20">
               <div>
                  <h4 className="text-cyan-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">The Underlying Magic</h4>
                  <h2 className="text-[12vw] md:text-[9vw] font-black tracking-tighter leading-none">The Product</h2>
               </div>
               <p className="text-gray-400 max-w-xl text-lg md:text-xl font-medium text-left">
                 Three powerful interfaces designed for every stakeholder in the live entertainment ecosystem. Artist Dashboard, Venue Grid, and Crowd Interface.
               </p>
            </FadeSection>

            <div className="space-y-12">
               {/* Artist Dashboard */}
               <FadeSection viewport={{ amount: 0.1 }} className="relative overflow-hidden rounded-[3rem] md:rounded-[4rem] border border-white/10 bg-white/[0.02] backdrop-blur-md p-10 md:p-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent pointer-events-none" />
                  <div className="relative z-10 grid md:grid-cols-2 gap-12 md:gap-20">
                     <div className="flex flex-col justify-center">
                        <h3 className="text-[9vw] md:text-[5vw] font-black tracking-tighter leading-[0.8] mb-12">Automated <br/> Contracts</h3>
                     </div>
                     <div className="flex flex-col justify-center border-l border-white/10 pl-8 md:pl-12">
                        <p className="text-gray-400 text-lg mb-8">Smart contracts auto-generate when bookings confirm. Artists digitally sign in seconds with clear terms.</p>
                     </div>
                  </div>
                  <div className="w-full h-px bg-white/10 my-16 md:my-20" />
                  <div className="relative z-10 grid md:grid-cols-2 gap-12 md:gap-20">
                     <div className="flex flex-col justify-center">
                        <h3 className="text-[9vw] md:text-[5vw] font-black tracking-tighter leading-[0.8] mb-12">Instant <br/> Settlements</h3>
                     </div>
                     <div className="flex flex-col justify-center border-l border-white/10 pl-8 md:pl-12">
                        <p className="text-gray-400 text-lg mb-8">Zero payout delays. Artists see funds hit their UPI-linked accounts within minutes of performance completion.</p>
                     </div>
                  </div>
               </FadeSection>

               {/* Venue Grid */}
               <FadeSection viewport={{ amount: 0.1 }} className="relative overflow-hidden rounded-[3rem] md:rounded-[4rem] border border-white/10 bg-white/[0.02] backdrop-blur-md p-10 md:p-20">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 to-transparent pointer-events-none" />
                  <div className="relative z-10 grid md:grid-cols-2 gap-12 md:gap-20">
                     <div className="flex flex-col justify-center">
                        <h3 className="text-[9vw] md:text-[5vw] font-black tracking-tighter leading-[0.8] mb-12">OTT-Style <br/> Discovery</h3>
                     </div>
                     <div className="flex flex-col justify-center border-l border-white/10 pl-8 md:pl-12">
                        <p className="text-gray-400 text-lg mb-8">Browse curated local talent through an intuitive grid interface. Swipe through vetted DJs, bands, and solo artists.</p>
                     </div>
                  </div>
               </FadeSection>

               {/* Crowd Interface (Outside glass) */}
               <FadeSection viewport={{ amount: 0.1 }} className="p-10 md:p-20 relative">
                  <div className="absolute right-0 top-0 w-1/2 h-full bg-purple-900/10 blur-[100px] z-[-1] pointer-events-none" />
                  <div className="grid md:grid-cols-2 gap-12 md:gap-20">
                     <div className="flex flex-col justify-center">
                        <h3 className="text-[10vw] md:text-[6vw] font-black tracking-tighter leading-[0.8] mb-12">Zero Friction <br/> Tipping</h3>
                     </div>
                     <div className="flex flex-col justify-center lg:pl-12">
                        <p className="text-gray-400 text-lg mb-8">No app download required. Audiences simply scan a QR code at the venue to instantly tip their favorite artists via UPI.</p>
                     </div>
                  </div>
                </FadeSection>
            </div>
         </div>
      </section>

      {/* ─── NEW PHASE: THE PROMISE (Inspirational split) ─── */}
      <section className="py-20 md:py-32 bg-[#02000A] relative z-20 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center mb-16">
           <FadeSection viewport={{ amount: 0.1 }}>
             <h4 className="text-purple-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">The Revolution</h4>
             <h2 className="text-[10vw] md:text-[6vw] font-black tracking-tighter leading-none mb-6">The Promise</h2>
             <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">We are re-engineering the culture of live entertainment. No more middlemen, no more delayed payments, no more empty rooms.</p>
           </FadeSection>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6 min-h-[400px] md:min-h-[500px]">
           {/* Artist Block */}
           <FadeSection viewport={{ amount: 0.1 }} className="relative group rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0A0612] flex flex-col justify-end p-8 md:p-12 transition-all duration-700 hover:border-purple-500/50 hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-10 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" />
              <div className="relative z-10 translate-y-6 md:translate-y-12 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                 <h3 className="text-4xl md:text-5xl font-black mb-4">For Artists.</h3>
                 <p className="text-gray-300 md:text-lg max-w-sm opacity-50 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700 md:delay-100 leading-relaxed text-sm">Never chase an invoice again. Play your set, pack your gear, and watch your UPI balance update instantly before you even leave the green room. Focus on the art, we handle the math.</p>
              </div>
           </FadeSection>

           {/* Venue Block */}
           <FadeSection viewport={{ amount: 0.1 }} delay={0.2} className="relative group rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0A0612] flex flex-col justify-end p-8 md:p-12 transition-all duration-700 hover:border-cyan-500/50 hover:shadow-[0_0_50px_rgba(34,211,238,0.2)] cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571266028243-cb40fcece596?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-10 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" />
              <div className="relative z-10 translate-y-6 md:translate-y-12 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                 <h3 className="text-4xl md:text-5xl font-black mb-4">For Venues.</h3>
                 <p className="text-gray-300 md:text-lg max-w-sm opacity-50 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700 md:delay-100 leading-relaxed text-sm">Stop gambling on your nights. Discover vetted local talent, guarantee your headcount, and automate your programming calendar without the WhatsApp chaos. Sell culture, not just drinks.</p>
              </div>
           </FadeSection>
        </div>
      </section>

      {/* ─── PHASE 5: BUSINESS & MARKET ─── */}
      <section id="market" className="py-16 md:py-40 bg-[#02000A] z-20 relative border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
           
           <FadeSection viewport={{ amount: 0.1 }} className="mb-40">
              <div className="grid lg:grid-cols-2 gap-16 mb-20">
                 <h2 className="text-[10vw] md:text-[7vw] font-black tracking-tighter leading-[0.8]">Escrow Tech <br/> Unlocked</h2>
                 <p className="text-gray-400 text-lg md:text-xl font-medium pt-4 lg:pl-12 border-t lg:border-t-0 lg:border-l border-white/10">
                   Modern payment APIs have revolutionized how money moves in India. We leverage Razorpay Route to enable instant, automated split payments.
                 </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                 <GlassCard className="text-center md:text-left py-20 px-12 md:px-16" glowing>
                   <h3 className="text-[100px] md:text-[140px] font-black leading-[0.8] tracking-tighter mb-6 text-white drop-shadow-2xl">{"<"}1s</h3>
                   <h4 className="text-2xl font-black mb-4">Instant Split Payments</h4>
                   <p className="text-gray-400">Razorpay Route APIs enable automated split payments with instant settlement to artists.</p>
                 </GlassCard>
                 <GlassCard className="text-center md:text-left py-20 px-12 md:px-16 border-white/20">
                   <h3 className="text-[100px] md:text-[140px] font-black leading-[0.8] tracking-tighter mb-6 text-white drop-shadow-2xl">100%</h3>
                   <h4 className="text-2xl font-black mb-4">Regulatory Compliance</h4>
                   <p className="text-gray-400">Every escrow transaction meets Reserve Bank of India guidelines.</p>
                 </GlassCard>
              </div>
           </FadeSection>

           <FadeSection viewport={{ amount: 0.1 }} className="grid lg:grid-cols-12 gap-16 md:gap-24 items-center mb-40">
              <div className="lg:col-span-7">
                 <h2 className="text-[10vw] md:text-[7vw] font-black tracking-tighter leading-[0.8] mb-12">Monetizing <br/> Every Layer</h2>
                 <p className="text-gray-400 text-lg md:text-xl max-w-xl">
                   Revenue scales linearly with artist rates and venue growth. Zero extra operational costs as platform handles all transactions automatically.
                 </p>
              </div>
              <div className="lg:col-span-5">
                 <GlassCard className="flex flex-col gap-12 p-10 md:p-14">
                    <div>
                      <h4 className="text-xl font-black mb-4">B2B Venue SaaS</h4>
                      <p className="text-sm text-gray-400 italic">₹2,999/month base subscription for venue dashboard access, artist discovery, and booking management.</p>
                    </div>
                    <div className="w-full h-px bg-white/10 my-8 flex-shrink-0 block" />
                    <div>
                      <h4 className="text-xl font-black mb-4">B2B + B2C Commissions</h4>
                      <p className="text-sm text-gray-400 italic">15% commission on all escrow bookings—automated, instant, and frictionless.</p>
                    </div>
                 </GlassCard>
              </div>
           </FadeSection>
        </div>
      </section>

      {/* ─── PHASE 6: TEAM & FINAL ASK ─── */}
      <section className="py-16 md:py-32 bg-[#02000A] z-20 relative border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          {/* TEAM */}
          <FadeSection viewport={{ amount: 0.1 }} className="mb-40">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-12 mb-16">
                <h2 className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none">The Team</h2>
                <p className="text-gray-400 max-w-lg text-left">Built for execution. Our founder brings deep expertise in scaling high-ticket B2B marketing, driving ROI, and building sales infrastructure.</p>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Shashank V Khatri", role: "Founder & CEO", glow: "border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" },
                  { name: "Coming Soon", role: "Advisor", glow: "border-white/10 shadow-none", img: "" },
                  { name: "Coming Soon", role: "Advisor", glow: "border-white/10 shadow-none", img: "" },
                  { name: "Coming Soon", role: "Advisor", glow: "border-white/10 shadow-none", img: "" },
                ].map((member, i) => (
                  <div key={i} className="flex flex-col gap-4">
                     <div className={`w-full aspect-square bg-[#111] rounded-3xl md:rounded-[2rem] border overflow-hidden ${member.glow}`}>
                        {member.img ? <img src={member.img} className="w-full h-full object-cover opacity-80" alt={member.name} /> : <div className="w-full h-full flex items-center justify-center text-white/5 font-black text-6xl">?</div>}
                     </div>
                     <div className="text-center bg-white/[0.03] rounded-2xl py-3 border border-white/[0.05]">
                        <h5 className="font-bold text-sm tracking-tight">{member.name}</h5>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{member.role}</p>
                     </div>
                  </div>
                ))}
             </div>
          </FadeSection>

          {/* THE ASK */}
          <FadeSection>
             <div className="grid lg:grid-cols-2 gap-16 mb-20">
                <h2 className="text-[12vw] md:text-[9vw] font-black tracking-tighter leading-none text-purple-400">The Ask</h2>
                <div className="space-y-6 lg:pl-12 border-t lg:border-t-0 lg:border-l border-white/10 pt-6">
                   <p className="text-xl text-white font-medium">We&apos;re raising ₹3 Crore in pre-seed funding to build the operating system for India&apos;s live entertainment economy. Our target: ₹100 Crore valuation by 2026.</p>
                </div>
             </div>
             <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                 <GlassCard className="py-16 md:py-24">
                   <h3 className="text-[100px] md:text-[140px] font-black leading-[0.8] tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">40%</h3>
                   <h4 className="text-2xl font-black mb-4">Engineering & Product</h4>
                   <p className="text-gray-400 text-sm">Building core platform apps, hiring engineering talent.</p>
                 </GlassCard>
                 <GlassCard className="py-16 md:py-24">
                   <h3 className="text-[100px] md:text-[140px] font-black leading-[0.8] tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">40%</h3>
                   <h4 className="text-2xl font-black mb-4">Growth & Sales</h4>
                   <p className="text-gray-400 text-sm">Scaling Pune pilot to 100+ venues, expanding artist network.</p>
                 </GlassCard>
              </div>
          </FadeSection>

        </div>
      </section>

      {/* ─── PHASE 7: FOOTER ─── */}
      <footer className="relative pt-16 pb-8 px-6 border-t border-white/10 overflow-hidden text-center flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-[#02000A] to-[#02000A]">
         <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
            {/* The Main Connect Component */}
            <motion.h2 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="text-[10vw] md:text-[6vw] font-black tracking-tighter leading-[0.8] mb-6 text-white drop-shadow-2xl"
            >
               Thank You
            </motion.h2>
            <p className="text-xs md:text-base font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-cyan-400 mb-12 max-w-4xl mx-auto leading-loose text-center">
               Join Us in Revolutionizing India&apos;s Live Entertainment Economy
            </p>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12" />

            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-8 md:gap-8 items-center justify-between text-left mb-12">
               <div className="flex flex-col items-center md:items-start space-y-4">
                  <div className="flex items-center gap-2">
                     <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-1.5 rounded-lg">
                       <span className="text-white text-lg font-black italic">C</span>
                     </div>
                     <span className="text-2xl font-black tracking-tighter italic text-white">cROWD&CULT</span>
                  </div>
                  <p className="text-gray-500 text-sm max-w-[250px] text-center md:text-left">
                     The Operating System for India&apos;s Live Entertainment Economy.
                  </p>
               </div>

               <div className="flex flex-col items-center space-y-4">
                  <span className="text-xs font-black uppercase tracking-widest text-white/40">Connect</span>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 transition-all">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-purple-500/50 transition-all">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-indigo-500/50 transition-all">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                  </div>
               </div>

               <div className="flex flex-col items-center md:items-end space-y-4">
                  <span className="text-xs font-black uppercase tracking-widest text-white/40">Inquiries</span>
                  <a href="mailto:invest@crowdandcult.in" className="text-white hover:text-cyan-400 transition-colors flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                     invest@crowdandcult.in
                  </a>
                  <a href="https://www.crowdandcult.in" className="text-white hover:text-purple-400 transition-colors flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                     www.crowdandcult.in
                  </a>
               </div>
            </div>

            <div className="w-full flex flex-col items-center gap-2 border-t border-white/10 pt-6 mt-4">
               <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest bg-white/5 py-1.5 px-4 rounded-full border border-white/10 shadow-lg relative">
                  Powered by <span className="text-red-500 animate-pulse inline-block mx-1">❤️</span> by Founder
               </span>
               <span className="text-[9px] text-gray-600 mt-2 tracking-widest">
                  © 2026 cROWD&CULT. ALL RIGHTS RESERVED.
               </span>
               <div className="h-4"></div>
            </div>
         </div>
      </footer>

    </div>
  );
}
