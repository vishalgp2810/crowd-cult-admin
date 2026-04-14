// @ts-nocheck
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";

export function ArtistProfileView() {
  const router = useRouter();

  const profile = {
    name: "Nyx Solaris",
    genre: "Electronic / Techno",
    city: "Berlin, DE",
    hourlyRate: 320,
    bio: "Berlin-trained DJ with 10+ years on the underground circuit. Nyx brings a unique blend of dark techno and ethereal synth-wave. I specialize in building hypnotic atmospheres that transport audiences into another dimension. My sets are a journey through the deep, rhythmic pulses of the night, designed for those who seek transcendence on the dancefloor.",
    available: true,
    tags: ["Hypnotic", "Dark Techno", "Vinyl Purist", "Analog Specialist"],
    skills: ["Ableton Live", "Analog Gear", "Modular Synthesis", "Vinyl DJing"],
    equipment: ["Pioneer CDJ-3000 x4", "Allen & Heath Xone:96", "Hologram Microcosm", "Moog Subsequent 37"],
    stats: [
      { label: "Bookings", value: "240+" },
      { label: "Followers", value: "12.8K" },
      { label: "Experience", value: "10 Years" },
      { label: "Rating", value: "5.0" },
    ],
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      
      {/* ━━━ NAVIGATION OVERLAY ━━━ */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 h-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto cursor-pointer group" onClick={() => router.push("/")}>
          <div className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-all duration-300">
            <span className="font-black italic text-xl">G</span>
          </div>
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          <Button 
            onPress={() => router.push("/dashboard/artist")}
            className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white font-black italic uppercase tracking-wider text-[10px] px-6 rounded-xl h-10 transition-all duration-300"
          >
            Edit Profile
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-black italic uppercase tracking-tighter text-xs px-8 rounded-xl h-10 shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all">
            Book Agent
          </Button>
        </div>
      </nav>

      {/* ━━━ HERO SECTION ━━━ */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src="/artist-cover.png" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-20 pb-20 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-5 py-1.5 bg-purple-600 text-[10px] font-black italic uppercase tracking-[0.3em] rounded-full">Pro Network</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
                Available Currently
              </div>
            </div>

            <h1 className="text-7xl md:text-[120px] font-black italic uppercase leading-[0.85] tracking-tighter mb-8 drop-shadow-2xl">
              {profile.name.split(' ')[0]}<br/>
              <span className="text-transparent border-text-stroke text-stroke-white opacity-40">{profile.name.split(' ')[1]}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
              <div className="space-y-1">
                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Core Genre</span>
                <span className="text-xl font-black italic uppercase tracking-tight">{profile.genre}</span>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-12">
                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Current Location</span>
                <span className="text-xl font-black italic uppercase tracking-tight">{profile.city}</span>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-12">
                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Settlement Rate</span>
                <span className="text-xl font-black italic uppercase tracking-tight text-yellow-400">${profile.hourlyRate}<span className="text-xs text-gray-500 ml-1">/hr</span></span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.3em] vertical-text">Scroll</span>
          <div className="w-[1px] h-10 bg-white" />
        </motion.div>
      </section>

      {/* ━━━ STATS BAR ━━━ */}
      <section className="relative z-10 px-6 max-w-[1400px] mx-auto -mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0c0c0c] border border-white/[0.08] rounded-[40px] p-10 flex flex-wrap items-center justify-between gap-10 shadow-2xl backdrop-blur-2xl"
        >
          {profile.stats.map((stat, i) => (
            <div key={i} className="flex-1 min-w-[150px] text-center space-y-2 group">
              <span className="block text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 italic group-hover:text-purple-400 transition-colors">{stat.label}</span>
              <span className="text-4xl font-black italic tracking-tighter">{stat.value}</span>
            </div>
          ))}
          <div className="h-16 w-[1px] bg-white/10 hidden lg:block" />
          <div className="flex-1 min-w-[200px] flex items-center justify-center">
            <Button className="bg-white text-black font-black italic uppercase tracking-wider text-xs px-10 rounded-2xl h-14 hover:bg-purple-600 hover:text-white transition-all duration-500">
              Request Portfolio
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ━━━ BODY ━━━ */}
      <section className="px-6 py-32 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Left Side: Bio & Tags */}
        <div className="lg:col-span-8 space-y-24">
          <div className="space-y-12">
            <div className="flex items-center gap-6">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter underline decoration-purple-600 decoration-[6px] underline-offset-[16px]">The Narrative</h2>
            </div>
            <p className="text-xl md:text-2xl font-medium leading-[1.7] text-gray-300 italic opacity-90 max-w-[800px]">
              "{profile.bio}"
            </p>
          </div>

          <div className="space-y-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 italic">Signature Frequency</h3>
            <div className="flex flex-wrap gap-4">
              {profile.tags.map(tag => (
                <div key={tag} className="px-8 py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-xs font-black italic uppercase tracking-widest hover:border-purple-500/40 hover:bg-purple-500/5 cursor-default transition-all duration-300">
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Media Grid Preview */}
          <div className="space-y-12 pt-12">
            <SectionHeader title="Visual Feed" subtitle="Capturing the energy" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PortfolioCard img="/artist-cover.png" label="Live @ Bassline" />
              <PortfolioCard img="https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2076&auto=format&fit=crop" label="Studio Session IV" />
            </div>
          </div>
        </div>

        {/* Right Side: Rider & Details */}
        <div className="lg:col-span-4 space-y-12">
          
          <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] rounded-[32px] p-8 space-y-10 sticky top-[100px]">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400 italic">Tech Specification</span>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Hardware Rider</h3>
            </div>
            
            <div className="space-y-6">
              {profile.equipment.map(item => (
                <div key={item} className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-purple-600 group-hover:scale-150 transition-transform" />
                  <span className="text-sm font-bold tracking-tight text-white/80 group-hover:text-white transition-colors uppercase">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-white/10 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 italic">Core Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <Chip key={skill} variant="flat" className="bg-white/5 border border-white/5 text-[10px] font-black italic uppercase tracking-widest px-3 h-8">
                    {skill}
                  </Chip>
                ))}
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-black italic uppercase tracking-widest text-xs h-16 rounded-2xl shadow-xl shadow-purple-600/20 active:scale-[0.98] transition-all">
              Initiate Booking
            </Button>
            <p className="text-[9px] text-gray-500 text-center uppercase tracking-[0.2em] italic font-black">Escrow Protected Settlements</p>
          </div>

        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="px-6 py-32 border-t border-white/[0.04] text-center space-y-8">
        <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter opacity-5">NYX SOLARIS</h2>
        <p className="text-[8px] font-black uppercase tracking-[0.6em] text-gray-800 italic">GigPay Talent Network · Verified Artist Profile</p>
      </footer>

      <style jsx global>{`
        .border-text-stroke {
          -webkit-text-stroke: 1px rgba(255,255,255,0.8);
          color: transparent !important;
        }
        .vertical-text {
          writing-mode: vertical-rl;
        }
      `}</style>
    </div>
  );
}

function SectionHeader({ title, subtitle }: any) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400 italic">{subtitle}</span>
      <h3 className="text-4xl font-black italic uppercase tracking-tighter">{title}</h3>
    </div>
  );
}

function PortfolioCard({ img, label }: any) {
  return (
    <div className="relative aspect-video rounded-[32px] overflow-hidden group cursor-pointer border border-white/10">
      <img src={img} alt={label} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-8 left-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <span className="text-xs font-black italic uppercase tracking-[0.3em]">{label}</span>
      </div>
    </div>
  );
}
