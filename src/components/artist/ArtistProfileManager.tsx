// @ts-nocheck
"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Switch, Chip } from "@heroui/react";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: "general", label: "Identity", icon: "👤" },
  { id: "media", label: "Media", icon: "🎬" },
  { id: "gear", label: "Tech Rider", icon: "🎹" },
  { id: "vault", label: "Vault", icon: "💰" },
];

export function ArtistProfileManager() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isManagingGrid, setIsManagingGrid] = useState(false);

  const [profile, setProfile] = useState({
    name: "Nyx Solaris",
    genre: "Electronic / Techno",
    city: "Berlin, DE",
    hourlyRate: 320,
    bio: "Berlin-trained DJ with 10+ years on the underground circuit. Nyx brings a unique blend of dark techno and ethereal synth-wave. I specialize in building hypnotic atmospheres that transport audiences into another dimension.",
    available: true,
    tags: ["Hypnotic", "Dark Techno", "Vinyl Purist"],
    skills: ["Ableton Live", "Analog Gear"],
    equipment: ["Pioneer CDJ-3000", "Allen & Heath Xone:96"],
    albums: [
      { id: "a1", name: "Live at Berghain", type: "Visuals", count: 12, cover: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800" },
      { id: "a2", name: "Studio Sessions", type: "Archive", count: 8, cover: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800" },
      { id: "a3", name: "Promo Highlights", type: "Promo", count: 15, cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800" },
    ],
    vault: {
      balance: "12,450",
      currency: "INR",
      status: "Verified",
      razorpayId: "rzp_live_Nyx882",
      bank: "HDFC BANK •••• 4592"
    }
  });

  const [isSaving, setIsSaving] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const savedProfile = useRef(JSON.parse(JSON.stringify(profile)));

  // ── iOS Scroll Stability Hack ──
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activeTab]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDirty = useCallback((keys) => {
    return keys.some(k => JSON.stringify(profile[k]) !== JSON.stringify(savedProfile.current[k]));
  }, [profile]);

  const handleSave = (section, keys) => {
    setIsSaving(section);
    setTimeout(() => {
      keys.forEach(k => { savedProfile.current[k] = JSON.parse(JSON.stringify(profile[k])); });
      setIsSaving(null);
      toast.success("Changes saved successfully.");
    }, 800);
  };

  const addTag = (key) => {
    const val = prompt(`Add new item`);
    if (val && val.trim()) setProfile({ ...profile, [key]: [...profile[key], val.trim()] });
  };

  const removeFrom = (key, item) => {
    setProfile({ ...profile, [key]: profile[key].filter((x) => x !== item) });
  };

  const update = (key, val) => setProfile({ ...profile, [key]: val });

  const startUpload = () => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowUpload(false);
            setUploadProgress(0);
            toast.success("Media archived successfully.");
          }, 500);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  /* ─── Premium Field ─── */
  const Field = ({ label, value, onChange, type = "text", prefix }) => (
    <div className="space-y-3">
      <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 italic ml-1">
        {label}
      </label>
      <div className="flex items-center h-14 bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 focus-within:border-purple-500/50 focus-within:shadow-[0_0_20px_rgba(147,51,234,0.08)] hover:border-white/10 transition-all duration-300">
        {prefix && <span className="text-purple-400/60 text-sm font-black mr-3">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`flex-1 bg-transparent outline-none font-bold text-[15px] tracking-tight ${type === "number" ? "text-yellow-400 italic" : "text-white/90"}`}
        />
      </div>
    </div>
  );

  /* ─── Section Title ─── */
  const SectionTitle = ({ children, badge, dirty, saving, onSave }) => (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-black italic uppercase tracking-tight text-white/90 underline decoration-purple-600 decoration-[3px] underline-offset-8">
          {children}
        </h3>
        {badge && !dirty && (
          <span className="text-[8px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full bg-purple-600/15 text-purple-400 border border-purple-500/20 italic mt-0.5">
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {dirty && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onSave}
            disabled={saving}
            className="text-[9px] font-black uppercase italic tracking-[0.15em] py-2.5 px-6 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-600/20 active:scale-95 transition-all duration-200 disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : "Save Changes"}
          </motion.button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#050505] text-white selection:bg-purple-600/30">
      <Toaster position="top-center" richColors />

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-[100] h-20 bg-[#050505]/95 backdrop-blur-3xl border-b border-white/[0.06] flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-900 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/20">
              <span className="text-white font-black text-xl italic">G</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-black tracking-tighter uppercase italic leading-none">Artist Hub</h1>
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-600 mt-1 italic">Configuration Terminal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onPress={() => router.push("/artist/nyx-solaris")}
              variant="flat"
              className="flex bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-white font-black uppercase tracking-[0.15em] text-[10px] sm:text-[9px] px-3 sm:px-6 rounded-2xl h-11 transition-all duration-300 italic"
            >
              <span className="sm:hidden text-lg mr-1">👁️</span>
              <span className="hidden sm:inline">View Public Profile</span>
              <span className="sm:hidden">View</span>
            </Button>
            <div className="hidden md:flex items-center gap-2.5 mr-2 bg-white/[0.03] pl-3 pr-4 py-2 rounded-full border border-white/[0.04]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/40" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 italic">Live</span>
            </div>
            <Avatar src="https://i.pravatar.cc/150?u=artist" className="w-10 h-10 border border-white/[0.08] hidden xs:flex" />
          </div>
        </div>
      </header>

      {/* ━━━ MAIN LAYOUT — Re-Zeroed ━━━ */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 pt-20 pb-32">
        <div className="flex flex-col lg:flex-row gap-8 pt-4">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-[260px] shrink-0 sticky top-28 self-start gap-5">
            <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] rounded-3xl p-3 space-y-1 backdrop-blur-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-200 italic ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-xl shadow-purple-600/15"
                      : "text-gray-500 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="text-[16px] not-italic">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] rounded-3xl p-6 space-y-5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/30" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-400/80 italic">Discoverability</span>
              </div>
              <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04]">
                <span className="text-[10px] font-bold text-gray-500 italic">Open to Book</span>
                <Switch isSelected={profile.available} onValueChange={(val) => update("available", val)} color="success" size="sm" />
              </div>
              <p className="text-[9px] text-gray-700 leading-[1.7] italic">When enabled, your profile is visible in the premium talent pool.</p>
            </div>
          </aside>

          <main className="flex-1 min-h-[600px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full"
              >
                {/* ═══ IDENTITY ═══ */}
                {activeTab === "general" && (
                  <div className="space-y-5">
                    <div className="bg-gradient-to-b from-white/[0.025] to-transparent border border-white/[0.05] rounded-3xl p-7 md:p-10 backdrop-blur-sm">
                      <SectionTitle badge="Primary" dirty={isDirty(["name","genre","city","hourlyRate"])} saving={isSaving === "identity"} onSave={() => handleSave("identity", ["name","genre","city","hourlyRate"])}>Artist Identity</SectionTitle>
                      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className="relative shrink-0 group">
                          <Avatar
                            src="https://img.rocket.new/generatedImages/rocket_gen_img_1033f69f3-1768739059863.png"
                            className="w-28 h-28 md:w-36 md:h-36 rounded-[24px] border-[3px] border-white/[0.06] shadow-2xl relative z-10"
                          />
                        </div>
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field label="Artist Name" value={profile.name} onChange={(e) => update("name", e.target.value)} />
                          <Field label="Genre" value={profile.genre} onChange={(e) => update("genre", e.target.value)} />
                          <Field label="City" value={profile.city} onChange={(e) => update("city", e.target.value)} />
                          <Field label="Hourly Rate" value={profile.hourlyRate} onChange={(e) => update("hourlyRate", Number(e.target.value))} type="number" prefix="$" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-b from-white/[0.025] to-transparent border border-white/[0.05] rounded-3xl p-7 md:p-10 backdrop-blur-sm">
                      <SectionTitle badge="Verified" dirty={isDirty(["bio"])} saving={isSaving === "bio"} onSave={() => handleSave("bio", ["bio"])}>Sonic Narrative</SectionTitle>
                      <textarea
                        className="w-full bg-white/[0.02] rounded-2xl p-6 text-[15px] leading-[1.8] text-white/85 outline-none border border-white/[0.05] focus:border-purple-500/30 transition-all duration-300 min-h-[150px] resize-y placeholder:text-gray-700 italic"
                        value={profile.bio}
                        onChange={(e) => update("bio", e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="bg-gradient-to-b from-white/[0.025] to-transparent border border-white/[0.05] rounded-3xl p-7 md:p-10 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black italic uppercase tracking-tight text-white/90 underline decoration-purple-600 decoration-[3px] underline-offset-8">Signal Tags</h3>
                        <div className="flex items-center gap-3">
                          {isDirty(["tags"]) && (
                            <Button size="sm" onClick={() => handleSave("tags", ["tags"])} className="bg-purple-600 text-white font-black italic uppercase tracking-widest text-[8px] rounded-full">Save Tags</Button>
                          )}
                          <Button size="sm" onClick={() => addTag("tags")} variant="flat" className="text-purple-400 font-black italic uppercase tracking-widest text-[8px] rounded-full">+ Add Tag</Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {profile.tags.map((tag) => (
                          <Chip key={tag} onClose={() => removeFrom("tags", tag)} className="bg-white/[0.03] text-gray-300 font-bold italic uppercase tracking-wider px-4 h-10 border border-white/[0.06] text-[10px]" variant="flat">{tag}</Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ MEDIA: Instagram-Elite Flow ═══ */}
                {activeTab === "media" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/[0.05]">
                      <div>
                        <SectionTitle badge="Portfolio">Media Archive</SectionTitle>
                        <p className="text-gray-500 text-xs italic mt-1">45 Total Assets · 3 Collections</p>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => setIsManagingGrid(!isManagingGrid)}
                          className={`font-black italic uppercase tracking-widest text-[9px] rounded-xl px-6 border transition-all ${
                            isManagingGrid 
                              ? "bg-red-500/10 border-red-500/30 text-red-500" 
                              : "bg-white/5 hover:bg-white/10 text-white border-white/10"
                          }`}
                        >
                          {isManagingGrid ? "Exit Management" : "Manage Grid"}
                        </Button>
                        <Button 
                          onClick={() => setShowUpload(true)}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-black italic uppercase tracking-widest text-[9px] rounded-xl px-8 shadow-lg shadow-purple-600/20"
                        >
                          + Unified Upload
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* ── Collection Cards ── */}
                      {profile.albums.map((album) => (
                        <div key={album.id} className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer bg-[#121212] border border-white/[0.05] transition-all duration-500 hover:border-purple-600/30">
                          <img 
                            src={album.cover} 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                          
                          {isManagingGrid && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); toast.error("Collection deletion locked in demo mode."); }}
                              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-red-600/20 border border-red-500/50 backdrop-blur-md flex items-center justify-center text-red-500 z-20 hover:bg-red-600 hover:text-white transition-all animate-in zoom-in-50"
                            >
                              ✕
                            </button>
                          )}

                          <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="bg-purple-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{album.type}</span>
                              <span className="text-white/40 text-[8px] font-black uppercase tracking-widest">{album.count} Files</span>
                            </div>
                            <h3 className="text-2xl font-black italic text-white/95 uppercase tracking-tighter leading-none group-hover:translate-x-2 transition-transform duration-300">{album.name}</h3>
                            <div className="h-0 group-hover:h-8 transition-all duration-300 overflow-hidden opacity-0 group-hover:opacity-100 flex items-center gap-2 mt-2">
                              <span className="text-[10px] text-purple-400 font-bold italic">Open Collection →</span>
                            </div>
                          </div>

                          {/* ── Glass Edge Highlight ── */}
                          <div className="absolute inset-px rounded-[2.5rem] border border-white/[0.08] pointer-events-none group-hover:border-purple-500/20 transition-colors" />
                        </div>
                      ))}
                    </div>

                    {/* ── Lower Media Strip ── */}
                    <div className="bg-white/[0.015] border border-white/[0.05] rounded-[2rem] p-6 flex flex-wrap items-center justify-between gap-6">
                      <div className="flex gap-10">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black italic uppercase text-gray-500 tracking-widest mb-1">Grid Density</span>
                           <span className="text-white/80 font-bold text-lg">High Res</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black italic uppercase text-gray-500 tracking-widest mb-1">Cloud State</span>
                           <span className="text-green-500 font-black italic uppercase tracking-widest text-xs">● Synced</span>
                        </div>
                      </div>
                      <div className="bg-black/40 rounded-2xl p-2 px-4 border border-white/5 flex items-center gap-4">
                        <span className="text-[10px] font-black italic uppercase text-gray-500">Storage Usage</span>
                        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="w-[64%] h-full bg-purple-600" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">6.4 / 10 GB</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ TECH RIDER ═══ */}
                {activeTab === "gear" && (
                  <div className="space-y-5">
                    {[
                      { title: "Hardware Rider", key: "equipment" },
                      { title: "Core Skills", key: "skills" },
                    ].map((sec) => (
                      <div key={sec.title} className="bg-gradient-to-b from-white/[0.025] to-transparent border border-white/[0.05] rounded-3xl p-7 md:p-10 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-black italic uppercase tracking-tight text-white/90 underline decoration-purple-600 decoration-[3px] underline-offset-8">{sec.title}</h3>
                          <div className="flex items-center gap-3">
                            <Button size="sm" onClick={() => addTag(sec.key)} variant="flat" className="text-purple-400 font-black italic uppercase tracking-widest text-[8px] rounded-full">+</Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {profile[sec.key].map((item) => (
                            <div key={item} className="bg-white/[0.02] px-6 py-4 rounded-2xl border border-white/[0.05] flex items-center justify-between group">
                              <span className="text-[13px] font-bold italic text-white/80 uppercase tracking-tight">{item}</span>
                              <button className="text-gray-700 hover:text-red-400 transition-colors" onClick={() => removeFrom(sec.key, item)}>✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ═══ VAULT: Razorpay Financial Node ═══ */}
                {activeTab === "vault" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    
                    {/* ── Settlement Overview ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-purple-600/20">
                         <div className="absolute top-0 right-0 p-8 opacity-20">
                            <span className="text-4xl font-black italic">RZP</span>
                         </div>
                         <div className="relative z-10 flex flex-col h-full">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Available for Withdrawal</span>
                            <div className="flex items-baseline gap-2">
                               <span className="text-sm font-bold opacity-60">₹</span>
                               <span className="text-5xl font-black italic tracking-tighter">{profile.vault.balance}</span>
                            </div>
                            <div className="mt-auto pt-10 flex items-center gap-4">
                               <Button className="bg-white text-purple-900 font-black italic uppercase tracking-widest text-[9px] rounded-xl px-10 h-12 shadow-xl hover:scale-105 transition-all">Withdraw Funds</Button>
                               <span className="text-[9px] font-bold italic opacity-60 text-white tracking-widest">Next Settlement: Tomorrow</span>
                            </div>
                         </div>
                         {/* ── Wave Graphic ── */}
                         <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                      </div>

                      <div className="bg-white/[0.02] border border-white/[0.06] rounded-[2.5rem] p-10 flex flex-col">
                         <div className="flex justify-between items-start mb-10">
                            <div>
                               <h4 className="text-xs font-black italic uppercase tracking-widest text-white/90">Linked Account</h4>
                               <p className="text-[10px] text-gray-500 mt-1 italic">Authorized Razorpay Merchant Node</p>
                            </div>
                            <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic">{profile.vault.status}</span>
                         </div>
                         <div className="space-y-6">
                            <div className="flex items-center gap-5">
                               <div className="w-12 h-12 rounded-2xl bg-[#3395FF]/10 flex items-center justify-center text-[#3395FF] border border-[#3395FF]/20">💳</div>
                               <div>
                                  <span className="block text-[10px] font-black uppercase tracking-widest text-gray-600">Merchant Identity</span>
                                  <span className="text-white font-bold opacity-80">{profile.vault.razorpayId}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-5">
                               <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-400 border border-purple-600/20">🏦</div>
                               <div>
                                  <span className="block text-[10px] font-black uppercase tracking-widest text-gray-600">Settlement Destination</span>
                                  <span className="text-white font-bold opacity-80">{profile.vault.bank}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* ── Transaction Ledger ── */}
                    <div className="bg-gradient-to-b from-white/[0.025] to-transparent border border-white/[0.05] rounded-[2.5rem] p-10 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-8">
                        <SectionTitle badge="History">Recent Settlements</SectionTitle>
                        <Button variant="flat" className="text-purple-400 font-black italic uppercase tracking-widest text-[8px] rounded-full border border-purple-400/20 px-6 h-9">Download Audit</Button>
                      </div>
                      <div className="space-y-4">
                        {[
                          { event: "Show Settlement", date: "12 Apr 2026", id: "TXN_482910", amt: "+ ₹ 4,200", status: "Completed" },
                          { event: "Merch Sales", date: "10 Apr 2026", id: "TXN_482909", amt: "+ ₹ 1,850", status: "Completed" },
                          { event: "Booking Escrow", date: "09 Apr 2026", id: "TXN_482908", amt: "+ ₹ 8,100", status: "Completed" },
                        ].map((txn, i) => (
                          <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-all group">
                             <div className="flex items-center gap-5">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs">💸</div>
                                <div>
                                   <span className="block text-sm font-black italic uppercase text-white/90">{txn.event}</span>
                                   <span className="text-[10px] text-gray-600 italic tracking-widest">{txn.date} · {txn.id}</span>
                                </div>
                             </div>
                             <div className="text-right">
                                <span className="block text-sm font-black italic text-green-500 tracking-tight">{txn.amt}</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Settled to Bank</span>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-[#050505]/95 backdrop-blur-3xl border-t border-white/[0.05] px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 flex justify-around items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex flex-col items-center gap-1.5 transition-all duration-300 py-1"
          >
            <div className={`text-[20px] transition-transform duration-300 ${activeTab === tab.id ? "scale-110 -translate-y-1" : "opacity-40"}`}>
              {tab.icon}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] italic transition-colors ${activeTab === tab.id ? "text-purple-400" : "text-gray-600"}`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="mobile-nav-glow"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute -inset-x-4 -inset-y-1 bg-purple-500/10 blur-xl rounded-full -z-10"
              />
            )}
          </button>
        ))}
      </nav>

      {/* ── UNIFIED UPLOAD MODAL ── */}
      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowUpload(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
            >
              <div className="p-8 md:p-12">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Ingest Media</h2>
                      <p className="text-gray-500 text-xs italic mt-1">Select visual or audio assets for the archive</p>
                    </div>
                    <button onClick={() => setShowUpload(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">✕</button>
                 </div>

                 {uploadProgress > 0 ? (
                   <div className="py-20 text-center space-y-8">
                      <div className="w-24 h-24 rounded-full border-4 border-purple-600/20 border-t-purple-600 animate-spin mx-auto" />
                      <div>
                        <span className="text-2xl font-black italic text-white">{uploadProgress}%</span>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">Uploading to encrypted vault...</p>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-8">
                      <div className="group relative border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-purple-600/30 rounded-[2rem] p-16 text-center transition-all cursor-pointer">
                        <span className="text-5xl block mb-6 group-hover:scale-110 transition-transform">📂</span>
                        <h4 className="text-sm font-black italic uppercase tracking-widest text-white/90">Drop High-Res Files</h4>
                        <p className="text-[10px] text-gray-600 italic mt-2">Maximum file size: 250MB (RAW, MP4, WAV)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4">Target Collection</label>
                           <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-purple-500/30 appearance-none">
                              {profile.albums.map(a => <option key={a.id}>{a.name}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4">Asset Type</label>
                           <select className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-purple-500/30 appearance-none">
                              <option>Visual (Photo/Video)</option>
                              <option>Audio Track</option>
                              <option>Press Document</option>
                           </select>
                        </div>
                      </div>

                      <Button onClick={startUpload} className="w-full bg-purple-600 hover:bg-purple-500 h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-purple-600/20 active:scale-95 transition-all">
                        Execute Archive Entry
                      </Button>
                   </div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
