// @ts-nocheck
"use client";

import React, { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  Chip,
} from "@heroui/react";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { EscrowModal } from "./EscrowModal";

const MOCK_ARTISTS = [
  {
    id: "artist-001",
    name: "Nyx Solaris",
    genre: "Electronic / Techno",
    city: "Berlin, DE",
    hourlyRate: 320,
    available: true,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1033f69f3-1768739059863.png",
    rating: 4.9,
    completedGigs: 142,
    bio: "Berlin-trained DJ with 10+ years on the underground circuit. Nyx brings a unique blend of dark techno and ethereal synth-wave that turns any room into a hypnotic experience.",
    tags: ["Hypnotic", "Dark Techno", "Vinyl Purist"],
    skills: ["Propellerhead Reason", "Ableton Live", "Analog Gear"],
    equipment: ["Pioneer CDJ-3000", "Allen & Heath Xone:96", "Custom Moog Synth"],
    reliability: "100%",
    responseTime: "< 15 mins"
  },
  {
    id: "artist-004",
    name: "Solène Voss",
    genre: "Jazz / Neo-Soul",
    city: "Chicago, IL",
    hourlyRate: 290,
    available: true,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15f49a67d-1773081495142.png",
    rating: 4.8,
    completedGigs: 203,
    bio: "Award-winning jazz pianist and vocalist blending classical training with modern soul. Headlining over 50 festivals across the US and Europe.",
    tags: ["Classic Jazz", "Neo-Soul", "Vocalist"],
    skills: ["Grand Piano", "Live Vocals", "Composition"],
    equipment: ["Steinway D-274", "Neumann U87", "Rhodes MK8"],
    reliability: "99%",
    responseTime: "< 2 hrs"
  }
];

const REVIEWS_DATA = [
  { id: 1, venue: "THE VAULT", city: "BERLIN", rating: 5, text: "Nyx is a true technician. The transition between tracks was seamless and the energy in the room was electric all night. Payout was instant via Crowd & Cult.", date: "Feb 2026" },
  { id: 2, venue: "ECHO CLUB", city: "CHICAGO", rating: 4, text: "Incredible keyboard work. The neo-soul vibes were exactly what our VIP lounge needed. Total professional.", date: "Jan 2026" },
  { id: 3, venue: "SKYLINE STAGE", city: "NYC", rating: 5, text: "Arrived early for soundcheck and stayed late to greet fans. The best response time in the network. Will book again next month.", date: "Dec 2025" }
];

const MEDIA_ITEMS = [
  { id: 1, type: "audio", title: "Midnight Solstice", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "6:42", label: "Original Mix" },
  { id: 2, type: "audio", title: "Neon Horizon", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "8:15", label: "Live Set" },
  { id: 3, type: "video", title: "Live at Boiler Room", venue: "Berlin", embedId: "5qap5aO4i9A", label: "Performance" },
  { id: 4, type: "image", title: "The Deep Set", url: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?q=80&w=800", label: "Live Shot" },
  { id: 5, type: "image", title: "Basement Vibes", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800", label: "Live Shot" },
  { id: 6, type: "image", title: "Crowd Energy", url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800", label: "Atmosphere" },
];

const TABS = [
  { id: "about", label: "About Artist" },
  { id: "media", label: "Media Portfolio" },
  { id: "reviews", label: "Reviews Dashboard" },
];

export function ArtistProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams?.get("id") || "artist-001";
  const artist = MOCK_ARTISTS.find((a) => a.id === idParam) || MOCK_ARTISTS[0];

  const [activeTab, setActiveTab] = useState("reviews");
  const [activeMediaCat, setActiveMediaCat] = useState("All");
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationHours, setDurationHours] = useState(2);
  const [isOpen, setIsOpen] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const totalCost = artist.hourlyRate * durationHours;

  const toggleAudio = (item: any) => {
    if (isPlaying === item.id) {
       audioRef.current?.pause();
       setIsPlaying(null);
    } else {
       setIsPlaying(item.id);
       if (audioRef.current) {
         audioRef.current.src = item.url;
         audioRef.current.play();
       }
    }
  };

  const filteredMedia = MEDIA_ITEMS.filter(item => 
    activeMediaCat === "All" || item.type === activeMediaCat.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Toaster position="top-center" richColors />
      <audio ref={audioRef} onEnded={() => setIsPlaying(null)} />
      
      <nav className="bg-[#121212]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 h-18 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors shrink-0">
          <span className="text-lg">←</span> <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer mx-4 shrink-0" onClick={() => router.push("/")}>
          <span className="text-sm md:text-lg font-black tracking-tighter italic uppercase underline decoration-purple-600 decoration-4">
            CROWD & CULT
          </span>
        </div>
        <div className="flex items-center gap-3 md:gap-4 text-right shrink-0">
           <div className="bg-yellow-500/10 px-3 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-yellow-500/20">
              <p className="hidden sm:block text-[7px] md:text-[8px] font-black uppercase text-yellow-500/60 leading-none mb-1">Vault</p>
              <span className="text-yellow-500 font-bold text-xs md:text-sm leading-none">${isBooked ? "0" : "2.5k"}</span>
           </div>
           <Avatar size="sm" className="w-8 md:w-10 h-8 md:h-10 rounded-xl md:rounded-2xl border border-white/10" />
        </div>
      </nav>


      <main className="max-w-[1240px] mx-auto px-6 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          
          <div className="lg:col-span-7 space-y-10 md:space-y-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-start text-center md:text-left">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-yellow-500 rounded-[28px] md:rounded-[32px] blur opacity-25" />
                <img src={artist.image} alt={artist.name} className="relative w-32 md:w-48 h-32 md:h-48 aspect-square object-cover rounded-[28px] md:rounded-[32px] shadow-2xl" />
              </div>
              <div className="flex-1 pt-2">
                <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                   <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none italic uppercase">{artist.name}</h1>
                   <div className="bg-purple-600/20 border border-purple-500/30 text-purple-400 font-black uppercase text-[7px] md:text-[8px] px-2 py-0.5 rounded-md italic">PRO VETTED</div>
                </div>
                <p className="text-lg md:text-xl text-gray-400 font-medium mb-6 md:mb-8">
                   {artist.genre} <span className="mx-2 opacity-20 sm:inline">•</span> <br className="md:hidden" /> {artist.city}
                </p>
                <div className="flex gap-8 md:gap-10 justify-center md:justify-start">
                   <div><span className="text-xl md:text-2xl font-black text-white leading-none">⭐ {artist.rating}</span><p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-600 tracking-[0.2em] mt-2">Network Score</p></div>
                   <div className="w-px h-10 bg-white/5" /><div><span className="text-xl md:text-2xl font-black text-white leading-none">{artist.completedGigs}</span><p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-600 tracking-[0.2em] mt-2">Bookings</p></div>
                </div>
              </div>
            </motion.div>


            <div className="space-y-12">
              <div className="flex gap-6 md:gap-8 border-b border-white/5 relative overflow-x-auto no-scrollbar whitespace-nowrap">
                 {TABS.map((tab) => (
                   <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-gray-600 hover:text-white'}`}>
                     {tab.label}
                     {activeTab === tab.id && <motion.div layoutId="activeTabIndicator" className="absolute bottom-[-1px] left-0 right-0 h-1 bg-purple-600 shadow-[0_0_20px_#9333ea]" />}
                   </button>
                 ))}
              </div>


              <AnimatePresence mode="wait">
                 {activeTab === "reviews" && (
                    <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10 md:space-y-12 py-2">
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {[
                          { val: "98%", label: "Re-book", color: "text-green-500" },
                          { val: "Top 1%", label: "Rank", color: "text-purple-500" },
                          { val: "4.9", label: "Energy", color: "text-yellow-500" }
                        ].map((s, i) => (
                          <div key={i} className="bg-[#111] border border-white/5 p-6 md:p-8 rounded-[28px] md:rounded-[32px] text-center">
                             <span className={`text-3xl md:text-4xl font-black italic tracking-tighter ${s.color}`}>{s.val}</span>
                             <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-700 mt-2">{s.label}</p>
                          </div>
                        ))}
                     </div>


                     <div className="space-y-8">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 italic">RECENT FEEDBACK</h3>
                           <div className="h-px flex-1 bg-white/5 mx-10 hidden md:block" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Verified Gigs</span>
                        </div>
                        
                        <div className="space-y-6">
                           {REVIEWS_DATA.map((rev) => (
                             <div key={rev.id} className="group bg-[#111] border border-white/5 rounded-[40px] p-10 hover:border-purple-600/30 transition-all relative overflow-hidden flex flex-col justify-center min-h-[280px]">
                                {/* Corrected Watermark Placement */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                   <span className="text-[120px] font-black opacity-[0.03] italic group-hover:opacity-[0.07] transition-opacity tracking-tighter uppercase whitespace-nowrap">
                                      {rev.venue}
                                   </span>
                                </div>

                                <div className="relative z-10">
                                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                      <div className="flex items-center gap-5">
                                         <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 text-xs font-black">V</div>
                                         <div>
                                            <h4 className="text-sm font-black tracking-[0.1em] uppercase">{rev.venue} <span className="text-purple-600 mx-2">•</span> {rev.city}</h4>
                                            <div className="flex gap-1 mt-1 text-yellow-500 text-xs">
                                               {[...Array(5)].map((_, i) => <span key={i} className={i < rev.rating ? "opacity-100" : "opacity-20"}>★</span>)}
                                            </div>
                                         </div>
                                      </div>
                                      <div className="bg-white/5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-600">
                                         VERIFIED <span className="text-purple-500 ml-2">✓</span>
                                      </div>
                                   </div>
                                   <p className="text-gray-300 text-2xl font-medium leading-relaxed italic border-l-4 border-purple-600 pl-10">"{rev.text}"</p>
                                   <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest mt-8 ml-10 italic">{rev.date}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                   </motion.div>
                 )}

                 {activeTab === "media" && (
                   <motion.div key="media" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {filteredMedia.map((item) => (
                           <div key={item.id} className={`bg-[#111] border border-white/5 rounded-[32px] md:rounded-[40px] overflow-hidden ${item.type === 'video' ? 'md:col-span-2 aspect-video md:aspect-[16/8]' : 'aspect-square p-6 md:p-8 flex flex-col items-center justify-center'}`}>
                             {item.type === 'audio' ? (
                                <div className="text-center">
                                   <button onClick={() => toggleAudio(item)} className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-white text-black flex items-center justify-center mb-4 md:mb-6 shadow-3xl transform hover:scale-110 transition-transform shrink-0 mx-auto"><span className="text-2xl md:text-3xl">{isPlaying === item.id ? "⏸" : "▶"}</span></button>
                                   <h4 className="text-lg md:text-xl font-black italic">{item.title}</h4>
                                   <div className="flex gap-1 md:gap-1.5 h-8 md:h-10 items-end justify-center mt-4 md:mt-6">
                                      {[...Array(12)].map((_, i) => <motion.div key={i} animate={isPlaying === item.id ? { height: [4, 40, 10, 30, 4] } : { height: 4 }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }} className={`w-0.5 md:w-1 rounded-full ${isPlaying === item.id ? 'bg-purple-500 shadow-glow' : 'bg-white/5'}`} />)}
                                   </div>
                                </div>
                             ) : item.type === 'video' ? (
                                <iframe className="w-full h-full opacity-60 border-none" src={`https://www.youtube.com/embed/${item.embedId}`} />
                             ) : (
                                <img src={item.url} className="w-full h-full object-cover" />
                             )}
                          </div>
                        ))}
                     </div>
                   </motion.div>
                 )}

                 {activeTab === "about" && (
                   <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                     <p className="text-gray-300 text-lg md:text-2xl font-light italic leading-relaxed border-l-4 md:border-l-8 border-purple-600 pl-6 md:pl-10 uppercase tracking-tighter">"{artist.bio}"</p>
                   </motion.div>
                 )}

              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <motion.div className="lg:sticky lg:top-32 bg-[#111] border border-white/5 rounded-[40px] md:rounded-[50px] p-8 md:p-12 shadow-3xl">
               <div className="flex items-center justify-between mb-8 md:mb-12">
                  <h3 className="text-2xl md:text-3xl font-black italic uppercase underline decoration-purple-600 decoration-[6px]">Booking</h3>
                  <div className="text-right">
                    <span className="text-3xl md:text-4xl font-black text-yellow-500 italic tracking-tighter">${artist.hourlyRate}</span>
                    <span className="block text-[8px] md:text-[10px] font-black text-gray-700 uppercase tracking-widest mt-1">/ hour</span>
                  </div>
               </div>
               <div className="space-y-8 md:space-y-10">
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-3">
                       <label className="text-[9px] md:text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Date</label>
                       <input type="date" className="w-full bg-[#0A0A0A] border-none rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[10px] md:text-sm font-black text-white outline-none" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[9px] md:text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Time</label>
                       <input type="time" className="w-full bg-[#0A0A0A] border-none rounded-xl md:rounded-2xl px-4 md:px-6 py-4 md:py-5 text-[10px] md:text-sm font-black text-white outline-none" value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                  </div>
                  <div className="bg-[#0A0A0A] rounded-[28px] md:rounded-[32px] p-6 md:p-8 border border-white/5 space-y-4">
                     <div className="flex justify-between items-center text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest italic">
                        <span>Gig Total</span>
                        <span className="text-yellow-500 text-lg md:text-xl font-black">${(totalCost * 1.05).toFixed(2)}</span>
                     </div>
                  </div>
                  <button onClick={() => setIsOpen(true)} disabled={isBooked} className={`w-full py-5 md:py-7 rounded-[28px] md:rounded-[32px] text-white font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs transition-all ${isBooked ? "bg-green-600 shadow-none cursor-default" : "bg-purple-600 shadow-[0_30px_60px_-15px_rgba(147,51,234,0.4)] hover:scale-102 active:scale-98"}`}>
                    {isBooked ? "✓ VAULT SECURED" : "Lock Funds in Escrow"}
                  </button>
               </div>
            </motion.div>
          </div>

        </div>
      </main>

      <EscrowModal isOpen={isOpen} onOpenChange={setIsOpen} artistName={artist.name} totalCost={totalCost} onSuccess={() => setIsBooked(true)} />
    </div>
  );
}
