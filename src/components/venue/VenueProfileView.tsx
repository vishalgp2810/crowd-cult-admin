// @ts-nocheck
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { BrandFooter } from "@/components/common/BrandFooter";
import { toast, Toaster } from "sonner";
import { fetchVenueBySlugThunk } from "@/features/venue/venueThunks";

const FALLBACK_COVER = "https://images.unsplash.com/photo-1514525253361-b550a5e24bca?auto=format&fit=crop&q=80&w=1600";
const FALLBACK_AVATAR = "https://img.rocket.new/generatedImages/rocket_gen_img_1033f69f3-1768739059863.png";

const MOCK_STATS = [
  { label: "Capacity", value: "500+" },
  { label: "Bookings", value: "1.2K" },
  { label: "Rating", value: "4.9 ★" },
  { label: "Vibe", value: "Elite" },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  };
}

/** Private GCS objects need the signed read URL from the API; raw `url` 403s in the browser. */
function mediaDisplayUrl(asset: { readUrl?: string; url?: string }) {
  const signed = asset.readUrl?.trim();
  if (signed) return signed;
  return asset.url?.trim() || "";
}

export function VenueProfileView({ slug }: { slug?: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.venue?.profile);
  const status = useAppSelector((s) => s.venue?.status);
  const [heroCoverFailed, setHeroCoverFailed] = React.useState(false);

  React.useEffect(() => {
    if (slug) {
      dispatch(fetchVenueBySlugThunk(slug));
    }
  }, [dispatch, slug]);

  React.useEffect(() => {
    setHeroCoverFailed(false);
  }, [slug, profile?.venueId]);

  const handleInquiry = () => {
    toast.success("Transmission Initiated", {
      description: "Redirecting to our secure booking protocol...",
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 animate-pulse italic">Scanning Property...</span>
        </div>
      </div>
    );
  }

  // Hydrate from Redux store if available, else use mock/defaults
  const p = profile
    ? {
        name: profile.businessName || "Elite Venue",
        venueType: profile.venueType || "Club / Lounge",
        city: profile.city || "—",
        capacity: profile.capacity ?? 0,
        bio: profile.bio || "",
        profileImageUrl: profile.profileImageUrl || FALLBACK_AVATAR,
        // No separate cover in DB is common; reuse signed profile art so the hero is not empty.
        coverImageUrl: heroCoverFailed
          ? FALLBACK_COVER
          : profile.coverImageUrl?.trim() ||
            profile.profileImageUrl?.trim() ||
            FALLBACK_COVER,
        amenities: profile.amenities || [],
        techSpecs: profile.techSpecs || [],
        mediaAssets: profile.mediaAssets || [],
      }
    : {
        name: "Neo-Aetherium",
        venueType: "Industrial Tech-Space",
        city: "Neo Tokyo",
        capacity: 850,
        bio: "A multi-dimensional eventspace designed for high-fidelity audio-visual experiences. Features 360-degree projections, Funktone-One audio arrays, and adaptive acoustic architecture.",
        profileImageUrl: FALLBACK_AVATAR,
        coverImageUrl: FALLBACK_COVER,
        amenities: ["VIP Lounge", "Valet Parking", "Full Bar", "Catering"],
        techSpecs: ["L-Acoustics K2", "GrandMA3", "LED Wall 4K"],
        mediaAssets: [],
      };

  const dynamicStats = [
    { label: "Capacity", value: `${p.capacity || '—'}` },
    { label: "Status", value: profile?.isVerified ? "Verified" : "Active" },
    { label: "Rating", value: "5.0 ★" },
    { label: "Network", value: "C&C Pro" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-500/30 overflow-x-hidden">
      <Toaster position="top-center" richColors />

      {/* ━━━ FLOATING NAV ━━━ */}
      <nav className="fixed top-0 left-0 right-0 z-[200] px-6 h-16 flex items-center justify-between">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <button
          onClick={() => router.push("/")}
          className="relative z-10 w-14 h-11 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:border-white transition-all duration-500 group"
        >
          <span className="font-black italic text-lg text-yellow-500 group-hover:text-black transition-colors tracking-tighter">C&C</span>
        </button>
        <div className="relative z-10 flex items-center gap-3">
          <Button
            onPress={() => router.push("/dashboard/venue")}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white font-black italic uppercase tracking-wider text-[9px] px-5 rounded-xl h-9 transition-all"
          >
            Manage Portal
          </Button>
          <Button 
            onPress={handleInquiry}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-black italic uppercase tracking-wider text-[9px] px-6 rounded-xl h-9 shadow-lg shadow-yellow-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            Book Venue
          </Button>
        </div>
      </nav>

      {/* ━━━ CINEMATIC HERO ━━━ */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={p.coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={() => setHeroCoverFailed(true)}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-14 pb-14 max-w-[1400px] mx-auto w-full">
          <div className="flex flex-col md:flex-row items-end gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="shrink-0"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-yellow-500/40 to-transparent blur-lg" />
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[24px] border-2 border-white/10 shadow-2xl relative z-10 overflow-hidden bg-[#050505]/50 backdrop-blur-md">
                  <img src={p.profileImageUrl} className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="flex-1 space-y-4"
            >
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-1 bg-yellow-500/90 backdrop-blur text-[9px] font-black italic uppercase tracking-[0.3em] rounded-full text-black">
                  {p.venueType}
                </span>
                <span className="px-4 py-1 bg-white/10 backdrop-blur border border-white/10 text-[9px] font-black italic uppercase tracking-[0.3em] rounded-full text-gray-300">
                  {p.city}
                </span>
              </div>
              <h1 className="text-6xl md:text-[96px] font-black italic uppercase leading-[0.88] tracking-tighter drop-shadow-2xl">
                {p.name.split(" ")[0]}
                {p.name.split(" ").slice(1).length > 0 && (
                  <>
                    <br />
                    <span className="opacity-30" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)", color: "transparent" }}>
                      {p.name.split(" ").slice(1).join(" ")}
                    </span>
                  </>
                )}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ STATS BAR ━━━ */}
      <section className="relative z-10 px-6 max-w-[1400px] mx-auto -mt-6">
        <motion.div
          {...fadeUp(0.1)}
          className="bg-[#0D0D0D]/90 backdrop-blur-2xl border border-white/[0.07] rounded-[28px] px-8 py-7 flex flex-wrap items-center justify-between gap-6 shadow-2xl"
        >
          {dynamicStats.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div className="flex-1 min-w-[100px] text-center group">
                <span className="block text-[9px] font-black uppercase tracking-[0.35em] text-gray-600 italic mb-1 group-hover:text-yellow-400 transition-colors">
                  {stat.label}
                </span>
                <span className="text-3xl font-black italic tracking-tighter">{stat.value}</span>
              </div>
              {i < dynamicStats.length - 1 && <div className="hidden lg:block h-10 w-[1px] bg-white/[0.06]" />}
            </React.Fragment>
          ))}
          <div className="flex-1 min-w-[180px] flex justify-center">
            <Button 
              onPress={handleInquiry}
              className="bg-white text-black font-black italic uppercase tracking-wider text-[10px] px-8 rounded-2xl h-12 hover:bg-yellow-500 transition-all duration-500 shadow-lg"
            >
              Request Specs
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ━━━ BODY ━━━ */}
      <section className="px-6 py-24 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 xl:col-span-8 space-y-20">
          {p.bio && (
            <motion.div {...fadeUp(0)} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-yellow-500 italic">Property Ethos</span>
                <div className="flex-1 h-[1px] bg-white/[0.04]" />
              </div>
              <p className="text-xl md:text-2xl font-medium leading-[1.75] text-gray-300 italic border-l-2 border-yellow-500/40 pl-8">
                {p.bio}
              </p>
            </motion.div>
          )}

          <motion.div {...fadeUp(0.15)} className="space-y-8">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-yellow-500 italic block mb-1">Architectural Digest</span>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Property Assets</h2>
              </div>
              <div className="flex-1 h-[1px] bg-white/[0.04]" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {p.mediaAssets.length === 0 ? (
                <>
                  <div className="aspect-video rounded-[24px] bg-white/[0.02] border border-white/5 overflow-hidden group relative">
                    <img src={p.coverImageUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                      <span className="text-[10px] font-black italic uppercase tracking-widest">
                        {profile?.coverImageUrl?.trim() ? "Cover preview" : "Brand preview"}
                      </span>
                    </div>
                  </div>
                   <div className="aspect-video rounded-[24px] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-2 px-6 text-center">
                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em]">
                      Gallery empty
                    </span>
                    <span className="text-gray-600 text-[10px] font-medium leading-snug">
                      Add venue photos or video in Manage Portal — nothing is stored for this property yet.
                    </span>
                  </div>
                </>
              ) : (
                p.mediaAssets.map((asset, idx) => {
                  const type = asset.assetType?.toLowerCase() || "image";
                  const src = mediaDisplayUrl(asset);
                  return (
                    <div key={idx} className="aspect-video rounded-[24px] bg-[#0A0A0A] border border-white/5 overflow-hidden group relative flex flex-col items-center justify-center">
                      {type === "video" ? (
                        <>
                          <video 
                            src={src} 
                            className="w-full h-full object-cover" 
                            controls
                            playsInline
                          />
                          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-[9px] font-black uppercase tracking-widest text-white/90">{asset.title || "Venue Asset"}</span>
                          </div>
                        </>
                      ) : type === "audio" ? (
                        <div className="w-full h-full flex flex-col items-center justify-between p-6 bg-gradient-to-br from-yellow-500/10 to-transparent">
                          <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xl">
                               <span className="text-2xl">🎵</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/90 text-center line-clamp-2 px-4 italic mb-2">
                              {asset.title || "Audio Signature"}
                            </span>
                          </div>
                          <audio src={src} controls className="w-full h-8 opacity-40 hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <>
                          <img 
                            src={src} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/90 italic">{asset.title || "Venue Asset"}</span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24 space-y-6">
            <motion.div {...fadeUp(0.2)} className="bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-[28px] p-8 space-y-8">
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-yellow-500 italic">Availability</span>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase">Open to Book</h3>
              </div>
              <Button 
                onPress={handleInquiry}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-black italic uppercase tracking-widest text-[10px] h-14 rounded-2xl shadow-xl shadow-yellow-600/25 hover:shadow-yellow-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Initiate Booking
              </Button>
            </motion.div>

            <motion.div {...fadeUp(0.3)} className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.07] rounded-[28px] p-7 space-y-7">
               <div className="space-y-5">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-yellow-500 italic block">Hospitality Standards</span>
                <div className="flex flex-wrap gap-2">
                  {p.amenities.map((item, i) => (
                    <Chip key={i} variant="flat" className="bg-white/5 border border-white/5 text-[9px] font-black italic uppercase tracking-widest h-8 px-4">
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="space-y-5 pt-7 border-t border-white/[0.05]">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-500 italic block">Technical rider</span>
                <div className="space-y-3">
                  {p.techSpecs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 group-hover:bg-yellow-500 transition-all" />
                       <span className="text-[11px] font-bold tracking-tight text-white/70 uppercase">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <BrandFooter className="mt-8" />
    </div>
  );
}
