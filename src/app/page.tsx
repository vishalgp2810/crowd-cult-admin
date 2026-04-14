// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

// --- Components ---

function TiltCard({ children, className, onClick }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: isMobile ? 0 : rotateX, rotateY: isMobile ? 0 : rotateY, transformStyle: "preserve-3d" }}
      onClick={onClick}
      className={className}
    >
      <div style={{ transform: isMobile ? "none" : "translateZ(30px)" }}>{children}</div>
    </motion.button>
  );
}

// A mini-dashboard preview component
function DashboardMockup() {
  return (
    <div className="relative w-full h-full bg-[#1A1A1A] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl p-6">
       <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500/20" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
             <div className="w-3 h-3 rounded-full bg-green-500/20" />
          </div>
          <div className="w-32 h-2 bg-white/5 rounded-full" />
       </div>
       <div className="grid grid-cols-3 gap-4 h-full">
          <div className="col-span-2 space-y-4">
             <div className="h-32 bg-purple-600/10 rounded-2xl border border-purple-500/10 p-4">
                <div className="w-12 h-2 bg-purple-500/40 rounded-full mb-4" />
                <div className="flex items-end gap-1">
                   <div className="w-2 h-10 bg-purple-600 rounded-t-lg" />
                   <div className="w-2 h-16 bg-purple-500 rounded-t-lg" />
                   <div className="w-2 h-12 bg-purple-400 rounded-t-lg" />
                   <div className="w-2 h-20 bg-purple-600 rounded-t-lg" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-white/5 rounded-2xl" />
                <div className="h-20 bg-white/5 rounded-2xl" />
             </div>
          </div>
          <div className="space-y-4">
             <div className="h-full bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center pt-6 gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 border border-yellow-500/20" />
                <div className="w-10 h-2 bg-white/10 rounded-full" />
                <div className="w-16 h-2 bg-white/5 rounded-full" />
             </div>
          </div>
       </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  const [activeWord, setActiveWord] = useState("STAGE");
  const words = ["STAGE", "VIBE", "TOUR", "FUNDS", "GIGS"];

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveWord((prev) => {
        const nextIdx = (words.indexOf(prev) + 1) % words.length;
        return words[nextIdx];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0A0A0A]" />;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden selection:bg-purple-600" suppressHydrationWarning>
      
      {/* 1. Global Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#3b0764_0%,transparent_50%)] opacity-30" />
         <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      {/* 2. Floating 3D Assets */}
      <motion.img 
        src="/glass-vinyl.png"
        className="fixed top-40 right-[10%] w-64 h-64 z-10 opacity-60 mix-blend-screen pointer-events-none hidden lg:block"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 3. Navbar */}
      <nav className="fixed top-0 w-full z-[100] px-6 md:px-10 py-6 md:py-8 flex justify-between items-center bg-[#0A0A0A]/40 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
          <div className="bg-purple-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <span className="text-white text-xl md:text-2xl font-black italic">GP</span>
          </div>
          <span className="text-2xl md:text-3xl font-black tracking-tighter italic">GIG<span className="text-purple-500">PAY</span></span>
        </div>
        
        <div className="hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
           {["Process", "Marketplace", "Security", "Vision"].map(item => (
             <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white hover:tracking-[0.4em] transition-all duration-300">{item}</a>
           ))}
        </div>

        <button 
          onClick={() => router.push("/auth")}
          className="relative group overflow-hidden bg-white px-5 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl"
        >
           <span className="relative z-10 text-black text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">Start</span>
           <div className="absolute inset-0 bg-purple-600 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </nav>


      {/* 4. Cinematic Hero Section */}
      <motion.section style={{ scale }} className="relative pt-40 md:pt-52 pb-20 md:pb-32 px-6 md:px-10 flex flex-col items-center text-center z-20">
        <motion.div 
           initial={{ opacity: 0, scale: 0.8 }} 
           animate={{ opacity: 1, scale: 1 }} 
           transition={{ duration: 1 }}
           className="space-y-8 md:space-y-12 max-w-6xl"
        >
          <div className="flex items-center justify-center gap-4 text-purple-400">
             <div className="h-px w-6 md:w-8 bg-purple-600" />
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">Secure Escrow Protocol v1.0</span>
             <div className="h-px w-6 md:w-8 bg-purple-600" />
          </div>

          <h1 className="text-[14vw] md:text-[13vw] lg:text-[11vw] font-black tracking-tighter leading-[0.8] italic uppercase">
            SECURE THE <br/>
            <AnimatePresence mode="wait">
              <motion.span 
                key={activeWord}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-800"
              >
                {activeWord}.
              </motion.span>
            </AnimatePresence>
          </h1>

          <p className="text-base md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed px-4">
            The world's premium infrastructure for the global live performance market.
          </p>

          {/* 3D Interactive Path Options */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center pt-8 md:pt-10 w-full">
            <TiltCard 
              onClick={() => router.push("/auth")}
              className="group relative flex flex-col items-start bg-purple-600 p-8 md:p-10 rounded-[40px] md:rounded-[50px] w-full md:w-96 text-left shadow-[0_40px_100px_-20px_rgba(147,51,234,0.5)] overflow-hidden"
            >
               <h3 className="text-xs md:text-sm font-black uppercase tracking-widest mb-2 opacity-60">Path One</h3>
               <h2 className="text-3xl md:text-4xl font-black italic leading-none mb-8 md:mb-10">I MANAGE <br className="hidden md:block" /> A VENUE</h2>
               <div className="mt-auto flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-white/10 p-3 rounded-2xl px-5 md:px-6 group-hover:bg-black group-hover:text-white transition-all transform group-hover:translate-x-4">
                 Access Talent Hub →
               </div>
               
               {/* ── Dynamic Background Asset ── */}
               <div className="absolute inset-0 z-[-1] overflow-hidden">
                 <img 
                   src="/modern_premium_venue_bg_1776156322750.png" 
                   className="absolute top-0 left-0 w-full h-full object-cover opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700 pointer-events-none"
                   style={{ maskImage: 'radial-gradient(circle at center, black, transparent 80%)' }}
                 />
               </div>
            </TiltCard>

            <TiltCard 
              onClick={() => router.push("/auth")}
              className="group relative flex flex-col items-start bg-[#121212] border border-white/10 p-8 md:p-10 rounded-[40px] md:rounded-[50px] w-full md:w-96 text-left hover:border-purple-600/40 transition-all shadow-2xl overflow-hidden"
            >
               <h3 className="text-xs md:text-sm font-black uppercase tracking-widest mb-2 opacity-60">Path Two</h3>
               <h2 className="text-3xl md:text-4xl font-black italic leading-none mb-8 md:mb-10">I AM AN <br className="hidden md:block" /> ARTIST</h2>
               <div className="mt-auto flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-white/5 p-3 rounded-2xl px-5 md:px-6 group-hover:bg-purple-600 group-hover:text-white transition-all transform group-hover:translate-x-4">
                 Create Profile →
               </div>

               {/* ── Dynamic Background Asset ── */}
               <div className="absolute inset-0 z-[-1] overflow-hidden">
                 <img 
                   src="/futuristic_electric_guitar_bg_1776156461774.png" 
                   className="absolute top-0 left-0 w-full h-full object-cover opacity-10 group-hover:scale-110 group-hover:opacity-30 transition-all duration-700 pointer-events-none"
                   style={{ maskImage: 'radial-gradient(circle at center, black, transparent 80%)' }}
                 />
               </div>
            </TiltCard>
          </div>
        </motion.div>
      </motion.section>


      {/* 5. Luxury Stat Strip */}
      <section className="relative py-20 md:py-32 border-y border-white/5 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap justify-center md:justify-between gap-12 md:gap-20 items-center">
             {[
               { val: "$1.4M", label: "Volume Secured", color: "text-purple-500" },
               { val: "2,850", label: "Artists Joined", color: "text-white" },
               { val: "520+", label: "Venues Verified", color: "text-white" },
               { val: "100%", label: "Pay Guard", color: "text-green-500" }
             ].map((stat, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 30 }} 
                 whileInView={{ opacity: 1, y: 0 }} 
                 transition={{ delay: i * 0.1 }}
                 className="flex flex-col items-center md:items-start text-center md:text-left"
               >
                  <span className="text-4xl md:text-6xl font-black tracking-tighter transition-all">{stat.val}</span>
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mt-2">{stat.label}</span>
               </motion.div>
             ))}
          </div>
      </section>


      {/* 6. High-Fidelity Process Section */}
      <section id="process" className="py-24 md:py-40 px-6 md:px-10 max-w-7xl mx-auto space-y-32 md:space-y-60">
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
           <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} className="text-center lg:text-left">
              <span className="text-purple-500 font-black text-4xl md:text-6xl italic opacity-20 mb-4 block">01</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 md:mb-8 leading-[0.9]">AGENTIC <br className="hidden md:block" />MARKETPLACE</h2>
              <p className="text-base md:text-lg text-gray-500 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                Our secure marketplace identifies the best talent for your venue. From techno DJs in Berlin to indie bands in Austin, GigPay handles the logistics.
              </p>
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }} 
             whileInView={{ opacity: 1, scale: 1 }}
             className="aspect-video w-full max-w-2xl mx-auto"
           >
              <DashboardMockup />
           </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
           <div className="relative group lg:order-1 order-2">
              <motion.img 
                whileInView={{ rotate: 360 }} 
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                src="/vault-lock.png" 
                className="w-full h-auto drop-shadow-[0_0_80px_rgba(147,51,234,0.3)] max-w-md mx-auto"
              />
           </div>
           <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="lg:order-2 order-1 text-center lg:text-left">
              <span className="text-yellow-500 font-black text-4xl md:text-6xl italic opacity-20 mb-4 block">02</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 md:mb-8 leading-[0.9]">THE ESCROW <br className="hidden md:block" />GUARANTEE</h2>
              <p className="text-base md:text-lg text-gray-500 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                Funds are locked instantly upon booking. We protect the artist from cancellations and the venue from no-shows. Security is baked into every note.
              </p>
           </motion.div>
        </div>
      </section>


      {/* 7. Final Footer — Redesigned for Pixel-Perfect Alignment */}
      <footer className="py-20 px-6 md:px-10 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-20">
           <div className="md:col-span-5 flex flex-col items-center md:items-start">
              <span className="text-3xl md:text-5xl font-black italic tracking-tighter mb-8 block underline decoration-purple-600 decoration-4">GIGPAY.</span>
              <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                 {["𝕏", "📸", "🔗", "🎧"].map(icon => (
                   <span key={icon} className="text-xl md:text-2xl cursor-pointer hover:scale-110 transition-transform">{icon}</span>
                 ))}
              </div>
           </div>
           
           <div className="md:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { title: "Platform", links: ["Marketplace", "Vault", "Verification"] },
                { title: "Legal", links: ["Privacy", "Policy", "Escrow"] },
                { title: "Support", links: ["Docs", "Status", "Contact"] }
              ].map(col => (
                <div key={col.title}>
                  <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">{col.title}</h5>
                  <ul className="space-y-4">
                     {col.links.map(link => (
                       <li key={link} className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-purple-400 cursor-pointer transition-colors">
                         {link}
                       </li>
                     ))}
                  </ul>
                </div>
              ))}
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
               © 2026 CROWD & CULT.
             </span>
             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">
               POWERED BY CROWD & CULT
             </span>
           </div>
           
           <div className="flex items-center gap-10">
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
               EXCELLENCE ONLY
             </span>
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
               NO LIMITS
             </span>
           </div>
        </div>
      </footer>
    </div>
  );
}

