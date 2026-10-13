"use client";

import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";

// ponytail: placeholder testimonials — role-only, no real-person names.
// Replace with real client quotes + photos when the owner supplies them.
const TESTIMONIALS = [
  {
    quote: "Identitas brand kami terliat jauh lebih profesional setelah bekerja sama dengan Logia Creative.",
    role: "Founder, UMKM Kuliner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    alt: "Ilustrasi placeholder klien UMKM",
  },
  {
    quote: "Proses kerjanya rapi dan hasil desainnya konsisten dari awal sampai serah-terima.",
    role: "Pemilik Brand Fashion Lokal",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    alt: "Ilustrasi placeholder klien brand fashion",
  },
  {
    quote: "Website-nya cepat, rapi di mobile, dan mudah kami kelola sendiri setelahnya.",
    role: "Marketing, Startup Layanan Jasa",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff0e?w=400&h=400&fit=crop",
    alt: "Ilustrasi placeholder klien startup",
  },
  {
    quote: "Setiap detail visual dikerjakan dengan teliti — hasil akhirnya sesuai ekspektasi kami.",
    role: "Direktur, Perusahaan Jasa Profesional",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop",
    alt: "Ilustrasi placeholder klien korporat",
  },
  {
    quote: "Konten sosmed yang dibuat membuat feed kami terliat konsisten dan rapi.",
    role: "Pemilik Bisnis Produk Digital",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    alt: "Ilustrasi placeholder klien produk digital",
  },
  {
    quote: "Otomatisasi yang dipasang menghemat waktu tim kami untuk hal-hal lain.",
    role: "Operasional, UMKM Distributor",
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop",
    alt: "Ilustrasi placeholder klien distributor",
  },
];

export function TestimonialSection() {
  return (
    <section id="testimoni" className="w-full py-24 md:py-32 bg-transparent flex flex-col items-center justify-center relative z-10 border-t border-black/5 dark:border-white/5">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        <h2 className="font-display font-medium tracking-[-0.02em] text-[clamp(2rem,4vw,3.5rem)] text-black dark:text-white mb-3 text-center">
          Testimoni Klien
        </h2>
        <p className="text-sm text-[#666666] dark:text-[#999999] mb-8 sm:mb-12 text-center max-w-md px-2">
          Kilas pengalaman kolaborasi bersama brand dan bisnis yang bertumbuh bersama Logia.
        </p>
        <TestimonialCarousel testimonials={TESTIMONIALS} />
      </div>
    </section>
  );
}
