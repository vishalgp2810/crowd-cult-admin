// @ts-nocheck
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EscrowModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  artistName: string;
  totalCost: number;
  onSuccess: () => void;
}

export function EscrowModal({
  isOpen,
  onOpenChange,
  artistName,
  totalCost,
  onSuccess,
}: EscrowModalProps) {
  const [step, setStep] = useState<"details" | "processing" | "success">("details");
  const escrowFee = totalCost * 0.05;
  const grandTotal = totalCost + escrowFee;

  const handleConfirm = async () => {
    setStep("processing");
    await new Promise((r) => setTimeout(r, 2000));
    setStep("success");
    setTimeout(() => {
      onSuccess();
      onOpenChange(false);
      setTimeout(() => setStep("details"), 500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[50px] overflow-hidden shadow-[0_0_100px_rgba(147,51,234,0.15)]"
        >
          {/* Close Button */}
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors z-20 text-xl font-bold"
          >
            ✕
          </button>

          <div className="p-12 md:p-16">
            <AnimatePresence mode="wait">
              {step === "details" && (
                <motion.div 
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                   <div>
                      <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-2">SECURE <span className="text-purple-500">ESCROW</span></h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 italic">Bridging Funds for {artistName}</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                      <div className="space-y-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Method</label>
                            <div className="bg-[#111] border border-purple-600/30 p-5 rounded-3xl flex items-center justify-between shadow-inner">
                               <div className="flex items-center gap-4">
                                  <span className="text-2xl">⚡</span>
                                  <span className="text-xs font-black tracking-widest uppercase italic">GP Wallet</span>
                               </div>
                               <span className="text-white text-[10px] font-black bg-white/5 px-2 py-1 rounded">Active</span>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                               <span>Booking Fee</span>
                               <span className="text-white">${totalCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                               <span>Vault Utility (5%)</span>
                               <span className="text-white">${escrowFee.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="flex justify-between items-end">
                               <span className="text-[10px] uppercase font-black tracking-widest text-gray-700 italic">Charge Amount</span>
                               <span className="text-4xl text-yellow-500 font-black italic leading-none">${grandTotal.toFixed(2)}</span>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="bg-purple-600/5 p-8 rounded-[40px] border border-purple-600/10 space-y-4 relative overflow-hidden">
                            <div className="absolute top-[-20%] right-[-20%] text-6xl opacity-5 italic font-black">VAULT</div>
                            <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                               <span className="text-purple-500">✓</span> Protected by GigPay
                            </div>
                            <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                               <span className="text-purple-500">✓</span> Instant Lock Enabled
                            </div>
                            <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                               <span className="text-purple-500">✓</span> 24/7 Dispute Access
                            </div>
                         </div>
                         <button 
                           onClick={handleConfirm}
                           className="w-full py-6 bg-purple-600 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all text-white"
                         >
                           Lock Funds in Vault
                         </button>
                      </div>
                   </div>
                </motion.div>
              )}

              {step === "processing" && (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-24 flex flex-col items-center justify-center text-center space-y-12"
                >
                   <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full border-t-4 border-purple-600"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-3xl">🔒</div>
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black italic tracking-tighter uppercase">Initializing Vault</h3>
                      <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.3em]">Bridging Secure Network...</p>
                   </div>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-24 flex flex-col items-center justify-center text-center space-y-12"
                >
                   <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-5xl shadow-[0_0_60px_rgba(22,163,74,0.4)] text-white">
                      ✓
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-5xl font-black italic tracking-tighter uppercase">FUNDS SECURED</h3>
                      <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.4em] italic mb-4">Vault Lock Active / ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                      <div className="bg-green-600/10 text-green-500 text-[10px] font-black uppercase px-4 py-1.5 rounded-full border border-green-500/20 inline-block">Booking Confirmed</div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
