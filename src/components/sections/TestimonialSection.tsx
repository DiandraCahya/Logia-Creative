"use client";

import React, { useState, useEffect } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { Quote, MessageSquareQuote, Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Ahmad Rizky",
    role: "Founder, Kopi Kawan Lama",
    content: "Identitas visual baru yang dirancang Logia benar-benar mengubah cara pelanggan melihat brand kami. Kesan murahan hilang, berganti dengan image premium yang membuat kami berani menaikkan harga jual 30% tanpa kehilangan pelanggan.",
    rating: 5,
  },
  {
    name: "Sarah Wijaya",
    role: "CEO, TechSphere Solutions",
    content: "Pengalaman bekerja sama dengan Logia sangat mulus. Website SaaS kami sekarang tidak hanya cantik secara desain, tapi juga loading sangat cepat. Conversion rate pendaftaran trial kami naik signifikan dalam bulan pertama rilis.",
    rating: 5,
  },
  {
    name: "Budi Santoso",
    role: "Direktur Marketing, Nusantara Rasa",
    content: "Materi kampanye dan sosial media yang dibuat sangat tepat sasaran. Tim Logia mengerti betul cara menyampaikan nilai produk tradisional dengan gaya visual modern yang mudah diterima oleh generasi milenial.",
    rating: 5,
  },
  {
    name: "Dian Permatasari",
    role: "Owner, Lumina Skincare",
    content: "Otomasi sistem pelaporan pesanan dari web ke spreadsheet menghemat waktu admin saya hingga 3 jam sehari. Sangat efisien, investasi teknologi yang langsung terasa ROI-nya di minggu pertama.",
    rating: 5,
  },
];

export function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { ref: sectionRef, isInView: sectionVisible } = useScrollReveal();

  // Auto-play slider
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
    setTouchStart(0);
    setTouchEnd(0);
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square bg-gradient-to-tr from-brand-primary/5 to-brand-aqua/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div
          ref={sectionRef}
          className={`text-center mb-16 heading-entrance ${sectionVisible ? 'revealed' : ''}`}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-container border border-brand-aqua/20 text-xs font-semibold uppercase tracking-wider text-brand-aqua mb-4">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            Testimoni
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-3xl mx-auto">
            Apa Kata Mereka
          </h2>
        </div>

        {/* Featured Slider */}
        <div className={`transition-all duration-1000 transform ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div
            className="glass-container p-8 sm:p-12 md:p-16 max-w-4xl mx-auto text-center border border-slate-200 dark:border-white/10 shadow-xl relative micro-lift group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-container opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 dark:hover:bg-white/5 hidden md:block"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-container opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 dark:hover:bg-white/5 hidden md:block"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-6 h-6 text-slate-900 dark:text-white" />
            </button>

            {/* Quote mark decoration */}
            <Quote className="w-12 h-12 text-brand-primary/20 mx-auto mb-6 transform -scale-x-100" />

            {/* Rating */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(activeTestimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>

            {/* Slider Content */}
            <div className="min-h-[180px] sm:min-h-[140px] flex items-center justify-center">
              <div className="w-full transition-all duration-500 ease-in-out">
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 leading-relaxed italic mb-10 max-w-3xl mx-auto transition-opacity duration-300">
                  "{activeTestimonial.content}"
                </p>

                <div className="flex items-center justify-center gap-4 transition-opacity duration-300">
                  {/* Avatar (Initial fallback with gradient) */}
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-brand-primary to-brand-aqua flex items-center justify-center text-white font-bold text-xl shadow-inner">
                    {activeTestimonial.name.charAt(0)}
                  </div>

                  <div className="text-left">
                    <p className="font-bold text-slate-900 dark:text-white text-base">
                      {activeTestimonial.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {activeTestimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2.5 mt-12">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'w-8 bg-gradient-to-r from-brand-primary to-brand-aqua'
                      : 'w-2 bg-slate-200 dark:bg-white/20 hover:bg-slate-300 dark:hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
