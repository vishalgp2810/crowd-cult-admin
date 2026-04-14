// @ts-nocheck
"use client";

import React, { useState, useRef, useCallback } from "react";
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
  });

  const [isSaving, setIsSaving] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const savedProfile = useRef(JSON.parse(JSON.stringify(profile)));

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
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-lg font-black italic uppercase tracking-tight text-white/90 underline decoration-purple-600 decoration-[3px] underline-offset-8">
        {children}
      </h3>
      <div className="flex items-center gap-3">
        {badge && !dirty && (
          <span className="text-[8px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full bg-purple-600/10 text-purple-400 border border-purple-500/20 italic">
            {badge}
          </span>
        )}
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

      {/* ━━━ HEADER — Absolute Zero Fix ━━━ */}
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
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 pt-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 pt-6">

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

          {/* ── Content Area — spring transitions ── */}
          <main className="flex-1 min-w-0 min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
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

                {/* ═══ MEDIA ═══ */}
                {activeTab === "media" && (
                  <div className="bg-gradient-to-b from-white/[0.025] to-transparent border border-white/[0.05] rounded-3xl p-7 md:p-10 backdrop-blur-sm">
                    <SectionTitle badge="Portfolio">Media Vault</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { icon: "📸", label: "Photos", desc: "Promo & live shots" },
                        { icon: "🎥", label: "Videos", desc: "Performance clips" },
                        { icon: "🎙️", label: "Audio", desc: "Mixes & tracks" },
                      ].map((item) => (
                        <div key={item.label} className="bg-white/[0.02] border-2 border-dashed border-white/[0.06] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/30 transition-all min-h-[200px] group active:scale-95">
                          <span className="text-5xl mb-5 group-hover:scale-110 transition-transform">{item.icon}</span>
                          <span className="text-sm font-black italic uppercase tracking-tight text-white/90 mb-1">{item.label}</span>
                          <span className="text-[9px] text-gray-600 italic">{item.desc}</span>
                        </div>
                      ))}
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

                {/* ═══ VAULT — High End Financial State ═══ */}
                {activeTab === "vault" && (
                  <div className="space-y-5">
                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 via-[#0a0a0a] to-[#0a0a0a] border border-white/[0.08] rounded-3xl p-8 md:p-12">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-[80px]" />
                      <div className="relative z-10 text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-tr from-purple-600/20 to-yellow-500/10 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-inner mb-10">
                          <span className="text-4xl">💎</span>
                        </div>
                        <SectionTitle>Elite Vault Content</SectionTitle>
                        <p className="text-gray-500 text-sm max-w-[400px] mx-auto italic font-medium leading-relaxed mb-10">
                          Your premium settlements, contract history, and escrow balances are secured with bank-grade encryption.
                        </p>
                        <button className="px-12 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase italic tracking-[0.3em] text-gray-300 hover:bg-white/10 transition-all shadow-xl active:scale-95">
                          Request Decryption
                        </button>
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
    </div>
  );
}
