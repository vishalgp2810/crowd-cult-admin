// @ts-nocheck
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"venue" | "artist">("venue");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loginStep, setLoginStep] = useState<"role" | "credentials">("role");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    
    if (email && password) {
      toast.success(authMode === 'login' ? 'Welcome back!' : 'Account created!');
      setTimeout(() => router.push(role === "venue" ? "/dashboard/venue" : "/dashboard/artist"), 800);
    } else {
      toast.error("Please fill in all fields");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="top-center" richColors />
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] blur-[120px] rounded-full transition-colors duration-1000 ${role === 'venue' ? 'bg-yellow-500/10' : 'bg-purple-600/10'}`} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-8 cursor-pointer group" onClick={() => router.push("/")}>
          <div className="bg-purple-600 p-3 rounded-2xl mb-4 group-hover:rotate-12 transition-transform shadow-2xl shadow-purple-600/20">
            <span className="text-white text-3xl font-black italic">GP</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic">GIG<span className="text-yellow-500">PAY</span></h1>
        </div>

        <motion.div layout className="bg-[#121212] border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-3xl overflow-hidden">
           <AnimatePresence mode="wait">
             {loginStep === "role" ? (

               <motion.div 
                 key="role-step"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="space-y-8"
               >
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black tracking-tight">{authMode === 'login' ? 'Sign In' : 'Sign Up'}</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Select your path</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => setRole("venue")} className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all gap-4 ${role === 'venue' ? 'bg-yellow-500/10 border-yellow-500' : 'bg-[#1A1A1A] border-transparent opacity-40'}`}>
                        <span className="text-4xl">🏛️</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Venue</span>
                     </button>
                     <button onClick={() => setRole("artist")} className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all gap-4 ${role === 'artist' ? 'bg-purple-600/10 border-purple-600' : 'bg-[#1A1A1A] border-transparent opacity-40'}`}>
                        <span className="text-4xl">🎸</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Artist</span>
                     </button>
                  </div>
                  <button onClick={() => setLoginStep("credentials")} className={`w-full py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-xs ${role === 'venue' ? 'bg-yellow-500 text-black' : 'bg-purple-600 text-white'}`}>
                    Continue
                  </button>
               </motion.div>
             ) : (
               <motion.form key="login-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSubmit} className="space-y-6">
                  <button type="button" onClick={() => setLoginStep("role")} className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">← Back</button>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black tracking-tight">{authMode === 'login' ? 'Welcome Back' : 'Sign Up Free'}</h2>
                    <p className="text-gray-500 text-sm font-medium italic">{role === 'venue' ? 'Venue Manager' : 'Independent Artist'}</p>
                  </div>
                  <div className="space-y-4">
                    {authMode === "signup" && (
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                            <input required className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold shadow-inner" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{role === 'venue' ? 'Venue Name' : 'Stage Name'}</label>
                            <input required className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold shadow-inner" placeholder={role === 'venue' ? 'Sunset Lounge' : 'Cosmic Beats'} value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                         </div>
                      </div>
                    )}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
                       <input required type="email" className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold shadow-inner" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                       <input required type="password" className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold shadow-inner" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                  </div>
                  <button disabled={isLoading} type="submit" className={`w-full py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-xs ${role === 'venue' ? 'bg-yellow-500 text-black' : 'bg-purple-600 text-white'}`}>
                    {isLoading ? "Communicating..." : authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
               </motion.form>
             )}
           </AnimatePresence>
        </motion.div>

        <div className="mt-8 text-center">
           <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
             {authMode === 'login' ? "New to the vault?" : "Joined already?"} 
             <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setLoginStep("role"); }} className="ml-2 text-purple-500 hover:text-white transition-colors">
               {authMode === 'login' ? "Sign up free" : "Log in instead"}
             </button>
           </p>
        </div>
      </motion.div>
    </div>
  );
}
