"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, CheckCircle2, Phone, Mail, MapPin } from "lucide-react";

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const serviceOptions = [
  "Brand Identity & Visual Design",
  "Social Media & Content Production",
  "UI/UX & Web Development",
  "Reporting & Workflow Automation",
  "Integrated Creative + Tech Package",
];

const budgetRanges = [
  "< Rp 5 Juta",
  "Rp 5 - 15 Juta",
  "Rp 15 - 35 Juta",
  "> Rp 35 Juta",
];

export function CollaborationModal({ isOpen, onClose }: CollaborationModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Integrated Creative + Tech Package",
  ]);
  const [selectedBudget, setSelectedBudget] = useState("Rp 5 - 15 Juta");
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    contact: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Fire Confetti dynamically in browser
    try {
      if (typeof window !== "undefined") {
        const confettiModule = await import("canvas-confetti");
        const confetti = confettiModule.default || confettiModule;
        if (typeof confetti === "function") {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#0EA5E9", "#67C7D2", "#A8E6D7", "#1E3A8A", "#ffffff"],
          });
        }
      }
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: "", brandName: "", contact: "", notes: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#0c1f38] border border-brand-primary/30 dark:border-brand-aqua/25 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 my-8 overflow-hidden"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-brand-mint/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-mint/20 text-brand-aqua flex items-center justify-center shadow-glass-glow">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Terima Kasih, {formData.name || "Mitra Hebat"}!
                </h3>
                <p className="text-sm text-foreground/75 max-w-md mx-auto">
                  Informasi proyek Anda telah diterima tim konsultan Logia Creative. Kami akan menghubungi Anda melalui kontak yang dicantumkan dalam 1x24 jam kerja.
                </p>

                <div className="pt-6">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Selesai & Tutup
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary dark:text-brand-aqua text-xs font-semibold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Creative Partnership
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Mulai Kolaborasi Bersama Logia
                  </h2>
                  <p className="text-xs sm:text-sm text-foreground/70 mt-1">
                    Diskusikan ide besar bisnis Anda. Kami bantu formulasi strategi kreatif dan implementasi teknologinya.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Service Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                      Pilih Kebutuhan Layanan
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map((srv) => {
                        const active = selectedServices.includes(srv);
                        return (
                          <button
                            type="button"
                            key={srv}
                            onClick={() => toggleService(srv)}
                            className={`text-xs px-3 py-1.5 rounded-xl border transition-all text-left ${
                              active
                                ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                                : "bg-foreground/[0.03] text-foreground/70 border-foreground/10 hover:border-brand-primary/40"
                            }`}
                          >
                            {srv}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Brand */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Diandra Cahya"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-foreground/[0.03] dark:bg-black/20 border border-foreground/15 dark:border-white/10 text-sm focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">
                        Nama Brand / Usaha
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kopi Nusantara"
                        value={formData.brandName}
                        onChange={(e) =>
                          setFormData({ ...formData, brandName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-foreground/[0.03] dark:bg-black/20 border border-foreground/15 dark:border-white/10 text-sm focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  {/* Contact & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">
                        WhatsApp / Email *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="0812xxxx / email@anda.com"
                        value={formData.contact}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-foreground/[0.03] dark:bg-black/20 border border-foreground/15 dark:border-white/10 text-sm focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground/80 mb-1">
                        Estimasi Budget
                      </label>
                      <select
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-foreground/[0.03] dark:bg-brand-navy border border-foreground/15 dark:border-white/10 text-sm focus:outline-none focus:border-brand-primary"
                      >
                        {budgetRanges.map((b) => (
                          <option key={b} value={b} className="dark:bg-brand-navy">
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                      Catatan Singkat / Ringkasan Ide Proyek
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Jelaskan kebutuhan utama, timeline target, atau tantangan bisnis saat ini..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-foreground/[0.03] dark:bg-black/20 border border-foreground/15 dark:border-white/10 text-sm focus:outline-none focus:border-brand-primary resize-none"
                    />
                  </div>

                  {/* Fast Contact Channels & Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-foreground/10">
                    <div className="flex items-center gap-3 text-xs text-foreground/60">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-brand-primary" />
                        hello@logia.id
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-brand-aqua" />
                        +62 812-3456-7890
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-primary via-brand-aqua to-brand-slate text-white text-sm font-semibold shadow-lg hover:shadow-brand-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Kirim Diskusi Proyek
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
