"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";

type ContactUsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ContactUsModal({ isOpen, onClose }: ContactUsModalProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white underline decoration-purple-600 decoration-[3px] underline-offset-8">Contact Us</h2>
                  <p className="text-gray-500 text-[10px] italic mt-4">We respond to all urgent inquiries within 2 hours.</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">✕</button>
              </div>

              {status === "success" ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mx-auto text-green-400 text-2xl">✓</div>
                  <div>
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tight">Message Received</h3>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">Our team is reviewing your transmission.</p>
                  </div>
                  <Button onPress={onClose} className="bg-white text-black font-black italic uppercase tracking-widest text-[9px] rounded-xl px-8 h-10">Return to OS</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-gray-600 ml-1">Name</label>
                      <input
                        required
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 text-[11px] font-bold text-white outline-none focus:border-purple-500/30"
                        placeholder="Your Identity"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-gray-600 ml-1">Email</label>
                      <input
                        required
                        type="email"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 text-[11px] font-bold text-white outline-none focus:border-purple-500/30"
                        placeholder="Return Channel"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-600 ml-1">Subject</label>
                    <input
                      required
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 text-[11px] font-bold text-white outline-none focus:border-purple-500/30"
                      placeholder="Transmission Topic"
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-gray-600 ml-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 text-[11px] font-bold text-white outline-none focus:border-purple-500/30 resize-none"
                      placeholder="Detailed Intel..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <Button
                    type="submit"
                    isPending={status === "submitting"}
                    className="w-full bg-purple-600 hover:bg-purple-500 h-14 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-xl shadow-purple-600/20 active:scale-95 transition-all text-white"
                  >
                    Send Transmission
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
