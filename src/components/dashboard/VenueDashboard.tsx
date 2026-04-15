// @ts-nocheck
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Chip,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_ARTISTS = [
  {
    id: "artist-001",
    slug: "nyx-solaris",
    name: "Nyx Solaris",
    genre: "Electronic / Techno",
    city: "Berlin, DE",
    hourlyRate: 320,
    rating: 4.9,
    reviewCount: 142,
    available: true,
    trending: true,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1033f69f3-1768739059863.png",
    tags: ["Vinyl Set", "Dark Synth"],
    completedGigs: 142
  },
  {
    id: "artist-002",
    slug: "the-amber-riots",
    name: "The Amber Riots",
    genre: "Indie Rock",
    city: "Austin, TX",
    hourlyRate: 480,
    rating: 4.7,
    reviewCount: 53,
    available: true,
    trending: false,
    image: "https://images.unsplash.com/photo-1722505776109-b20d532f6853",
    tags: ["5-Piece", "Originals"],
    completedGigs: 89
  },
  {
    id: "artist-003",
    slug: "kai-okafor",
    name: "Kai Okafor",
    genre: "Afrobeats / R&B",
    city: "New York, NY",
    hourlyRate: 550,
    rating: 5.0,
    reviewCount: 31,
    available: false,
    trending: true,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16d808b58-1772286198607.png",
    tags: ["Live Vocals", "High Energy"],
    completedGigs: 67
  },
  {
    id: "artist-004",
    slug: "solene-voss",
    name: "Solène Voss",
    genre: "Jazz / Neo-Soul",
    city: "Chicago, IL",
    hourlyRate: 290,
    rating: 4.8,
    reviewCount: 119,
    available: true,
    trending: false,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15f49a67d-1773081495142.png",
    tags: ["Piano", "Vocals"],
    completedGigs: 203
  },
];

const GENRES = ["All Genres", "Electronic", "Rock", "Afrobeats", "Jazz", "Hip-Hop", "Folk", "Classical"];

export function VenueDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All Genres");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...MOCK_ARTISTS];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q));
    }
    if (activeGenre !== "All Genres") {
      list = list.filter(a => a.genre.toLowerCase().includes(activeGenre.toLowerCase()));
    }
    if (availableOnly) {
      list = list.filter(a => a.available);
    }
    return list;
  }, [search, activeGenre, availableOnly]);

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* CONSTANT HEADER SECTION (NAV + STATS ONLY) */}
      <div className="sticky top-0 z-50 w-full bg-[#070707]">
         {/* 1. Elite Top Navigation */}
         <nav className="h-20 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-10 flex-1">
               <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => router.push("/")}>
                  <div className="bg-purple-600 p-2 rounded-xl">
                     <span className="text-white font-black italic text-sm md:text-lg">C&C</span>
                  </div>
                  <span className="hidden sm:block text-lg md:text-xl font-black italic tracking-tighter uppercase underline decoration-purple-600 decoration-4">
                    CROWD & CULT
                  </span>
               </div>

               <div className="relative w-full max-w-xs md:max-w-lg group">
                  <input 
                    type="text" 
                    placeholder="Search Artists..." 
                    className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-3 text-[10px] md:text-xs font-black tracking-widest focus:border-purple-600 transition-all outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity hidden md:block">🔍</span>
               </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6 ml-4">
               <button className="opacity-40 hover:opacity-100 transition-opacity hidden sm:block">🔔</button>
               <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl flex items-center gap-2">
                  <span className="text-yellow-500 font-black text-xs md:text-sm">$2.5k</span>
               </div>
               <div className="bg-[#111] border border-white/5 pl-3 md:pl-4 pr-1 md:pr-1.5 py-1 md:py-1.5 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
                  <span className="hidden md:block text-[10px] font-black text-gray-500 uppercase tracking-widest">NV</span>
                  <Avatar className="w-8 h-8 rounded-xl border border-white/10" />
               </div>
            </div>
         </nav>

         {/* 2. Professional Stats Strip */}
         <div className="bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-10 flex flex-wrap items-center gap-x-10 gap-y-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
            <div className="flex items-center gap-2 whitespace-nowrap">
               <span className="text-purple-600">👤</span> Artists: <span className="text-white">284</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
               <span className="text-purple-600">🗓️</span> Gigs: <span className="text-white">12</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
               <span className="text-purple-600">📉</span> Vault: <span className="text-yellow-500 font-black">$4.8k</span>
            </div>
            <div className="ml-auto hidden md:flex items-center gap-2 italic lowercase opacity-40">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               Live Network Data
            </div>
         </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 md:px-10 py-8 md:py-12">
         {/* 3. Filtering & Heading */}
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-10 md:mb-12">
            <div>
               <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-2 leading-none">Discover Artists</h1>
               <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">{filtered.length} Elite Performers Matched</p>
            </div>

            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto overflow-hidden">
               <button 
                 onClick={() => setAvailableOnly(!availableOnly)}
                 className={`px-6 md:px-8 py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${availableOnly ? 'bg-green-600 border-green-600 text-white' : 'bg-[#111] border border-white/5 text-gray-500'}`}
               >
                 {availableOnly ? "● Available" : "Show All"}
               </button>
               <button className="bg-[#111] border border-white/5 px-6 md:px-8 py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-300 whitespace-nowrap">
                 Recommended ↓
               </button>
            </div>
         </div>

         {/* 4. Enhanced Genre Bar */}
         <div className="flex flex-wrap gap-2.5 md:gap-3 pb-8 md:pb-10 border-b border-white/5 mb-10 md:mb-12">
            {GENRES.map(g => (
              <button 
                key={g} 
                onClick={() => setActiveGenre(g)}
                className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeGenre === g ? 'bg-white text-black shadow-2xl' : 'bg-[#111] text-gray-600 hover:text-white'}`}
              >
                {g}
              </button>
            ))}
         </div>

         {/* 5. World-Class Grid Section */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
               {filtered.map((a) => (
                 <motion.div 
                   key={a.id} 
                   layout 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   whileHover={{ y: -8 }}
                   onClick={() => router.push(`/artist/${a.slug}`)}
                   className="group bg-[#0D0D0D] border border-white/5 rounded-[40px] overflow-hidden hover:border-purple-600/30 transition-all cursor-pointer shadow-3xl"
                 >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                       <img src={a.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" />
                       <div className="absolute top-6 left-6 flex gap-2">
                          {a.trending && <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-[8px] font-black uppercase italic">Trending</div>}
                       </div>
                       <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/5 px-3 py-1 rounded-full shadow-2xl">
                          <div className={`w-2 h-2 rounded-full ${a.available ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                          <span className="text-[8px] font-black text-white uppercase tracking-widest">{a.available ? 'Available' : 'Booked'}</span>
                       </div>
                       <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md border border-white/5 px-3 py-1 rounded-xl flex items-center gap-1.5">
                          <span className="text-yellow-500 text-xs">★</span>
                          <span className="text-xs font-black text-white leading-none">{a.rating}</span>
                       </div>
                    </div>

                    <div className="p-8 space-y-8">
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-2">{a.name}</h4>
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 italic">{a.genre} • {a.city}</p>
                          </div>
                          <div className="text-right">
                             <span className="text-2xl font-black text-yellow-500 italic leading-none">${a.hourlyRate}</span>
                             <span className="block text-[8px] font-black text-gray-700 uppercase tracking-widest mt-1">/ hr</span>
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-2">
                          {a.tags.map(t => <span key={t} className="text-[8px] font-black uppercase tracking-widest p-1.5 px-3 bg-[#151515] rounded-lg text-gray-500 border border-white/5">{t}</span>)}
                       </div>

                       <div className="grid grid-cols-3 gap-1 border-t border-white/5 pt-8">
                          <div className="text-center">
                             <span className="block text-xl font-black italic text-white leading-none">{a.completedGigs}</span>
                             <span className="text-[8px] font-black uppercase tracking-widest text-gray-700 mt-2 block">Gigs</span>
                          </div>
                          <div className="text-center border-x border-white/5">
                             <span className="block text-xl font-black italic text-white leading-none">{a.rating}</span>
                             <span className="text-[8px] font-black uppercase tracking-widest text-gray-700 mt-2 block">Rating</span>
                          </div>
                          <div className="text-center">
                             <span className="block text-xl font-black italic text-white leading-none">{a.reviewCount}</span>
                             <span className="text-[8px] font-black uppercase tracking-widest text-gray-700 mt-2 block">Reviews</span>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </main>
    </div>
  );
}
