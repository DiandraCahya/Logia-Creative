"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, CheckCircle2, Phone, Mail } from "lucide-react";

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

    try {
      if (typeof window !== "undefined") {
        const confettiModule = await import("canvas-confetti");
        const confetti = confettiModule.default || confettiModule;
        if (typeof confetti === "function") {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#2563eb", "#7c3aed", "#ec4899"],
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
            className="relative w-full max-w-2xl z-10 my-8 overflow-hidden"
          >
            <div className="glass-container p-6 sm:p-8 !rounded-3xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors btn-press z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary">
                    Terima Kasih, {formData.name || "Mitra Hebat"}!
                  </h3>
                  <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                    Informasi proyek Anda telah diterima tim konsultan Logia Creative. Kami akan menghubungi Anda melalui kontak yang dicantumkan dalam 1x24 jam kerja.
                  </p>

                  <div className="pt-6">
                    <button
                      onClick={handleReset}
                      className="px-8 py-3 rounded-full btn-collaborate text-white font-semibold text-sm btn-press"
                    >
                      Selesai & Tutup
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-xs font-semibold uppercase tracking-wider mb-3">
                      <Sparkles className="w-3.5 h-3.5" />
                      Creative Partnership
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                      Mulai Kolaborasi Bersama Logia
                    </h2>
                    <p className="text-sm text-text-secondary">
                      Diskusikan ide besar bisnis Anda. Kami bantu formulasi strategi kreatif dan implementasi teknologinya.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Service Selection */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
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
                              className={`text-xs px-4 py-2 rounded-full border transition-all btn-press ${
                                active
                                  ? "bg-accent-primary text-white border-accent-primary"
                                  : "bg-bg-primary text-text-secondary border-gray-200 dark:border-gray-800 hover:border-accent-primary/50"
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
                        <label className="block text-xs font-semibold text-text-primary mb-2">
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
                          className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:border-accent-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-2">
                          Nama Brand / Usaha
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Kopi Nusantara"
                          value={formData.brandName}
                          onChange={(e) =>
                            setFormData({ ...formData, brandName: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:border-accent-primary transition-colors"
                        />
                      </div>
                    </div>

                    {/* Contact & Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-2">
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
                          className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:border-accent-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-2">
                          Estimasi Budget
                        </label>
                        <select
                          value={selectedBudget}
                          onChange={(e) => setSelectedBudget(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:border-accent-primary transition-colors"
                        >
                          {budgetRanges.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-2">
                        Catatan Singkat / Ringkasan Ide Proyek
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Jelaskan kebutuhan utama, timeline target, atau tantangan bisnis saat ini..."
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:border-accent-primary resize-none transition-colors"
                      />
                    </div>

                    {/* Fast Contact Channels & Submit Button */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-xs text-text-secondary">
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-accent-primary" />
                          hello@logia.id
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-accent-secondary" />
                          +62 812-3456-7890
                        </span>
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3 rounded-full btn-collaborate text-white text-sm font-semibold btn-press flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Kirim Pesan
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
