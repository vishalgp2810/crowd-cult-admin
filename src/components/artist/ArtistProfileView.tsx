// @ts-nocheck
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { BrandFooter } from "@/components/common/BrandFooter";
import { toast, Toaster } from "sonner";
import { fetchVenueProfileThunk } from "@/features/venue/venueThunks";
import { fetchArtistBySlugThunk } from "@/features/artist/artistThunks";
import { formatCurrency } from "@/lib/constants/currency";

const FALLBACK_COVER = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1600";
const FALLBACK_AVATAR = "https://img.rocket.new/generatedImages/rocket_gen_img_1033f69f3-1768739059863.png";

const MOCK_STATS = [
  { label: "Bookings", value: "240+" },
  { label: "Followers", value: "12.8K" },
  { label: "Experience", value: "10 Yrs" },
  { label: "Rating", value: "5.0 ★" },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  };
}

export function ArtistProfileView({ slug }: { slug?: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hubProfile = useAppSelector((s) => s.artist?.profile);
  const venueProfile = useAppSelector((s) => s.venue?.profile);
  const userRole = useAppSelector((s) => s.auth?.roleCode);

  React.useEffect(() => {
    if (slug) {
      dispatch(fetchArtistBySlugThunk(slug));
    }
  }, [dispatch, slug]);

  React.useEffect(() => {
    if (userRole === "VENUE" && !venueProfile) {
      dispatch(fetchVenueProfileThunk());
    }
  }, [dispatch, userRole, venueProfile]);

  const handleBooking = () => {
    if (userRole === "ARTIST") {
      toast.info("Collaborative Mode Only", {
        description: "Artists cannot book other artists in this current build version.",
      });
      return;
    }

    if (!venueProfile || venueProfile.status !== "APPROVED") {
      toast.error("Profile Activation Required", {
        description: "Your property must be 'C&C Pro Verified' before you can initiate bookings with elite talent.",
        action: {
          label: "Resolve Status",
          onClick: () => router.push("/dashboard/venue"),
        },
        duration: 6000,
      });
      return;
    }
    
    // Proceed with booking (Future implementation)
    toast.success("Initiating Secure Transmission", {
      description: "Redirecting to escrow and contract generation...",
    });
  };

  const mediaAssets = Array.isArray(hubProfile?.mediaAssets)
    ? hubProfile.mediaAssets
    : [];
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [playingAssetId, setPlayingAssetId] = React.useState<number | null>(null);
  
  // ... rest of the component
  
  // Inside the return, add Toaster and update Button:
  // <Button onPress={handleBooking} ...>Initiate Booking</Button>
  // See below for the specific chunk replacement.

  const toggleAudio = async (asset) => {
    if (!asset?.url) return;
    const id = Number(asset.mediaAssetId);
    if (!audioRef.current) return;
    if (playingAssetId === id) {
      audioRef.current.pause();
      setPlayingAssetId(null);
      return;
    }
    audioRef.current.src = asset.url;
    try {
      await audioRef.current.play();
      setPlayingAssetId(id);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Transmission Error:", err);
      }
    }
  };

  // Hydrate from Redux store if available, else use mock
  const p = hubProfile
    ? {
        name: hubProfile.stageName || "Artist",
        genre: hubProfile.genre || "Electronic",
        city: hubProfile.city || "—",
        hourlyRate: hubProfile.hourlyRate ?? 0,
        bio: hubProfile.bio || "",
        available: Boolean(hubProfile.available),
        profileImageUrl: hubProfile.profileImageUrl || FALLBACK_AVATAR,
        coverImageUrl: hubProfile.coverImageUrl || FALLBACK_COVER,
        tags: hubProfile.tags || [],
        skills: hubProfile.skills || [],
        equipment: hubProfile.equipment || [],
      }
    : {
        name: "Nyx Solaris",
        genre: "Electronic / Techno",
        city: "Berlin, DE",
        hourlyRate: 320,
        bio: "Berlin-trained DJ with 10+ years on the underground circuit. Nyx brings a unique blend of dark techno and ethereal synth-wave — building hypnotic atmospheres that transport audiences into another dimension.",
        available: true,
        profileImageUrl: FALLBACK_AVATAR,
        coverImageUrl: FALLBACK_COVER,
        tags: ["Hypnotic", "Dark Techno", "Vinyl Purist", "Analog Specialist"],
        skills: ["Ableton Live", "Analog Gear", "Modular Synthesis", "Vinyl DJing"],
        equipment: ["Pioneer CDJ-3000 ×4", "Allen & Heath Xone:96", "Hologram Microcosm", "Moog Subsequent 37"],
      };

  const firstName = p.name.split(" ")[0];
  const lastName = p.name.split(" ").slice(1).join(" ");

  if (useAppSelector(s => s.artist.status) === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 animate-pulse italic">Synchronizing...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden">
      <Toaster position="top-center" richColors />
      <audio ref={audioRef} onEnded={() => setPlayingAssetId(null)} />

      {/* ━━━ FLOATING NAV ━━━ */}
      <nav className="fixed top-0 left-0 right-0 z-[200] px-6 h-16 flex items-center justify-between">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <button
          onClick={() => router.push("/")}
          className="relative z-10 w-9 h-9 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center hover:bg-purple-600 transition-all duration-300"
        >
          <span className="font-black italic text-sm">G</span>
        </button>
        <div className="relative z-10 flex items-center gap-3">
          <Button
            onPress={() => router.push("/dashboard/artist")}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white font-black italic uppercase tracking-wider text-[9px] px-5 rounded-xl h-9 transition-all"
          >
            Edit Profile
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-black italic uppercase tracking-wider text-[9px] px-6 rounded-xl h-9 shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all">
            Book Now
          </Button>
        </div>
      </nav>

      {/* ━━━ CINEMATIC HERO ━━━ */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Cover Photo */}
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
          />
        </motion.div>

        {/* Gradient overlays — layered for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-[#050505]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#050505] to-transparent" />

        {/* Availability badge */}
        {p.available && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute top-24 left-6 md:left-12 flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-emerald-500/20 px-4 py-2 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 italic">Available</span>
          </motion.div>
        )}

        {/* Hero content — bottom left */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-14 pb-14 max-w-[1400px] mx-auto w-full">
          <div className="flex flex-col md:flex-row items-end gap-8">

            {/* Profile Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="shrink-0"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-purple-600/60 to-transparent blur-lg" />
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[24px] border-2 border-white/10 shadow-2xl relative z-10 overflow-hidden bg-[#050505]/50 backdrop-blur-md">
                  <img
                    src={p.profileImageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Name & Meta */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 space-y-4"
            >
              {/* Genre pill */}
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-1 bg-purple-600/90 backdrop-blur text-[9px] font-black italic uppercase tracking-[0.3em] rounded-full">
                  {p.genre}
                </span>
                <span className="px-4 py-1 bg-white/10 backdrop-blur border border-white/10 text-[9px] font-black italic uppercase tracking-[0.3em] rounded-full text-gray-300">
                  {p.city}
                </span>
              </div>

              {/* Name */}
              <h1 className="text-6xl md:text-[96px] font-black italic uppercase leading-[0.88] tracking-tighter drop-shadow-2xl">
                {firstName}
                {lastName && (
                  <>
                    <br />
                    <span
                      className="opacity-30"
                      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.8)", color: "transparent" }}
                    >
                      {lastName}
                    </span>
                  </>
                )}
              </h1>

              {/* Rate */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black italic text-yellow-400 tracking-tighter">
                  {formatCurrency(p.hourlyRate)}
                </span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">/hr</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-20 z-10"
        >
          <div className="w-[1px] h-8 bg-white" />
          <span className="text-[7px] font-black uppercase tracking-[0.4em]" style={{ writingMode: "vertical-rl" }}>Scroll</span>
        </motion.div>
      </section>

      {/* ━━━ STATS BAR ━━━ */}
      <section className="relative z-10 px-6 max-w-[1400px] mx-auto -mt-6">
        <motion.div
          {...fadeUp(0.1)}
          className="bg-[#0D0D0D]/90 backdrop-blur-2xl border border-white/[0.07] rounded-[28px] px-8 py-7 flex flex-wrap items-center justify-between gap-6 shadow-2xl"
        >
          {MOCK_STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div className="flex-1 min-w-[100px] text-center group">
                <span className="block text-[9px] font-black uppercase tracking-[0.35em] text-gray-600 italic mb-1 group-hover:text-purple-400 transition-colors">
                  {stat.label}
                </span>
                <span className="text-3xl font-black italic tracking-tighter">{stat.value}</span>
              </div>
              {i < MOCK_STATS.length - 1 && (
                <div className="hidden lg:block h-10 w-[1px] bg-white/[0.06]" />
              )}
            </React.Fragment>
          ))}
          <div className="hidden lg:block h-10 w-[1px] bg-white/[0.06]" />
          <div className="flex-1 min-w-[180px] flex justify-center">
            <Button className="bg-white text-black font-black italic uppercase tracking-wider text-[10px] px-8 rounded-2xl h-12 hover:bg-purple-600 hover:text-white transition-all duration-500 shadow-lg">
              Follow
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ━━━ BODY ━━━ */}
      <section className="px-6 py-24 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Left: Bio, Tags, Media */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-20">

          {/* Bio */}
          {p.bio && (
            <motion.div {...fadeUp(0)} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-purple-400 italic">The Narrative</span>
                <div className="flex-1 h-[1px] bg-white/[0.04]" />
              </div>
              <blockquote className="text-xl md:text-2xl font-medium leading-[1.75] text-gray-300 italic border-l-2 border-purple-600/40 pl-8">
                "{p.bio}"
              </blockquote>
            </motion.div>
          )}

          {/* Tags */}
          {p.tags.length > 0 && (
            <motion.div {...fadeUp(0.1)} className="space-y-6">
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-600 italic">Signature Frequency</span>
              <div className="flex flex-wrap gap-3">
                {p.tags.map((tag, i) => (
                  <motion.div
                    key={`${tag}-${i}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="px-6 py-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[10px] font-black italic uppercase tracking-widest hover:border-purple-500/40 hover:bg-purple-500/5 cursor-default transition-all duration-300"
                  >
                    {tag}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Visual Feed */}
          <motion.div {...fadeUp(0.15)} className="space-y-8">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-purple-400 italic block mb-1">Capturing the energy</span>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Visual Feed</h2>
              </div>
              <div className="flex-1 h-[1px] bg-white/[0.04]" />
            </div>
            {mediaAssets.length === 0 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-video rounded-[20px] overflow-hidden group cursor-pointer border border-white/[0.06]">
                  <img
                    src={p.coverImageUrl}
                    alt="Live"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-5 left-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <span className="text-[10px] font-black italic uppercase tracking-[0.3em]">Live Performance</span>
                  </div>
                </div>
                <div className="relative aspect-video rounded-[20px] overflow-hidden group cursor-pointer border border-white/[0.06] bg-white/[0.02] flex items-center justify-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-700 italic">More coming soon</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {mediaAssets.map((asset, idx) => {
                  const type = String(asset?.assetType || "").toLowerCase();
                  const isImage = type === "image" && asset?.url;
                  const isVideo = type === "video" && asset?.url;
                  const isAudio = type === "audio" && asset?.url;
                  const cardTitle = asset?.title || "Media Asset";
                  return (
                    <div
                      key={`${asset?.mediaAssetId || idx}`}
                      className="relative aspect-video rounded-[20px] overflow-hidden group cursor-pointer border border-white/[0.06] bg-white/[0.02]"
                    >
                      {isImage ? (
                        <img
                          src={asset.url}
                          alt={cardTitle}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : isVideo ? (
                        <video
                          src={asset.url}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          autoPlay
                          muted
                          loop
                          playsInline
                          onCanPlay={(e) => {
                            const promise = e.currentTarget.play();
                            if (promise !== undefined) {
                              promise.catch(err => {
                                if (err.name !== 'AbortError') console.error('Video Error:', err);
                              });
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.01]">
                          <div className={type === "audio" ? "text-purple-500/40 animate-pulse" : "text-gray-600/40"}>
                            {type === "audio" ? (
                              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                            ) : (
                              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full bg-black/60 border border-white/10 text-[8px] font-black uppercase tracking-widest text-purple-300">
                          {type || "media"}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-[10px] font-black italic uppercase tracking-[0.18em] text-white/90 line-clamp-1">
                          {cardTitle}
                        </span>
                      </div>
                      {isAudio ? (
                        <>
                          {playingAssetId === Number(asset.mediaAssetId) ? (
                            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                              <div className="flex items-end gap-1.5 h-8 bg-black/35 rounded-full px-3 py-2 backdrop-blur-sm mt-14">
                                {[0, 1, 2, 3, 4].map((bar) => (
                                  <motion.span
                                    key={bar}
                                    animate={{ height: [5, 18, 8, 20, 5] }}
                                    transition={{
                                      duration: 0.9,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                      delay: bar * 0.08,
                                    }}
                                    className="w-1 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.85)]"
                                  />
                                ))}
                              </div>
                            </div>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => toggleAudio(asset)}
                            className="absolute right-3 bottom-3 z-20 w-10 h-10 rounded-full bg-black/70 border border-white/15 hover:border-purple-400/40 hover:bg-purple-600/30 flex items-center justify-center text-white text-sm transition-all"
                          >
                            {playingAssetId === Number(asset.mediaAssetId) ? (
                              <motion.span
                                animate={{ scale: [1, 1.18, 1] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                              >
                                ❚❚
                              </motion.span>
                            ) : (
                              "▶"
                            )}
                          </button>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right: Booking Card + Rider */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24 space-y-6">

            {/* Booking CTA Card */}
            <motion.div
              {...fadeUp(0.2)}
              className="bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-[28px] p-8 space-y-8"
            >
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-purple-400 italic">Settlement</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black italic text-yellow-400 tracking-tighter">{formatCurrency(p.hourlyRate)}</span>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">/hour</span>
                </div>
              </div>

              <Button 
                onPress={handleBooking}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-black italic uppercase tracking-widest text-[10px] h-14 rounded-2xl shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Initiate Booking
              </Button>
              <p className="text-[8px] text-gray-600 text-center uppercase tracking-[0.25em] italic font-black">
                Escrow Protected · Crowd&Cult Verified
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.05]">
                {[
                  { label: "Genre", value: p.genre },
                  { label: "Location", value: p.city },
                  { label: "Status", value: p.available ? "Open to Book" : "Unavailable" },
                  { label: "Network", value: "Pro Verified" },
                ].map((item) => (
                  <div key={item.label} className="space-y-0.5">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-600 italic block">{item.label}</span>
                    <span className="text-[11px] font-black uppercase tracking-tight text-white/80">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tech Rider Card */}
            {(p.equipment.length > 0 || p.skills.length > 0) && (
              <motion.div
                {...fadeUp(0.3)}
                className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.07] rounded-[28px] p-7 space-y-7 min-w-0 overflow-hidden"
              >
                {p.equipment.length > 0 && (
                  <div className="space-y-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-purple-400 italic block">Hardware Rider</span>
                    {p.equipment.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 group min-w-0">
                        <div className="w-1.5 h-1.5 mt-1.5 shrink-0 rounded-full bg-purple-600 group-hover:scale-150 group-hover:shadow-[0_0_6px_rgba(147,51,234,0.8)] transition-all" />
                        <span className="min-w-0 text-[11px] font-bold tracking-tight text-white/70 group-hover:text-white transition-colors uppercase break-words">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {p.skills.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/[0.05] min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-600 italic block">Core Competencies</span>
                    <div className="flex flex-wrap gap-2 min-w-0">
                      {p.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="inline-block max-w-full px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[9px] font-black italic uppercase tracking-widest whitespace-normal break-words leading-snug"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <BrandFooter className="mt-8" />
    </div>
  );
}
