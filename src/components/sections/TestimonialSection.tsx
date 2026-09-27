"use client";

import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";

const TESTIMONIALS = [
  {
    quote: "Logia Creative transformed our brand completely. The result exceeded expectations.",
    author: "Ahmad Rizki - Founder Kopi Nusantara",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    alt: "Ahmad Rizki",
  },
  {
    quote: "Professional, creative, and very detail-oriented. Highly recommended.",
    author: "Sari Dewi - CEO Batik Modern",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    alt: "Sari Dewi",
  },
  {
    quote: "The best creative agency we've worked with. Fast delivery and great communication.",
    author: "Budi Santoso - Marketing Director",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff0e?w=400&h=400&fit=crop",
    alt: "Budi Santoso",
  },
  {
    quote: "Kualitas desain mereka membawa identitas brand kami ke level yang belum pernah kami bayangkan.",
    author: "Budi Santoso",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of Budi Santoso",
  },
  {
    quote: "Pengembangan website yang super cepat, responsif, dan sangat elegan. Konversi kami naik 40%.",
    author: "Dian Sastro",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of Dian Sastro",
  },
  {
    quote: "Pendekatan UI/UX yang mereka terapkan sangat berfokus pada pengguna nyata. Sangat memuaskan.",
    author: "Reza Rahadian",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of Reza Rahadian",
  },
  {
    quote: "Pendekatan strategis yang tajam. Brand kami kini jauh lebih dikenal.",
    author: "Arief Muhammad",
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of Arief Muhammad",
  },
  {
    quote: "Website yang dibangun sangat stabil walau traffic sedang memuncak.",
    author: "Nadiem Makarim",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of Nadiem Makarim",
  },
  {
    quote: "Desain UI/UX yang modern dan user-friendly. Sangat direkomendasikan!",
    author: "Putri Tanjung",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of Putri Tanjung",
  },
  {
    quote: "Otomatisasi alur kerja membuat tim kami 3x lebih produktif.",
    author: "William Tanuwijaya",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of William Tanuwijaya",
  },
  {
    quote: "Detail pada setiap pixel sangat diperhatikan. Hasil akhir sempurna.",
    author: "Alinea Fitri",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of Alinea Fitri",
  },
  {
    quote: "Kolaborasi yang luar biasa. Mereka mengerti visi kami dari hari pertama.",
    author: "Rio Dewanto",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of Rio Dewanto",
  },
  {
    quote: "Inovasi digital yang mereka bawa merubah total cara kami berbisnis.",
    author: "Susi Pudjiastuti",
    image: "https://images.unsplash.com/photo-1558898479-33c0057a5d12?q=80&w=800&auto=format&fit=crop",
    alt: "Portrait of Susi Pudjiastuti",
  },
];

export function TestimonialSection() {
  return (
    <section id="testimoni" className="w-full py-24 md:py-32 bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center relative z-10 border-t border-black/5 dark:border-white/5">
      <div className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center">
        <p className="text-[var(--accent-bronze)] uppercase tracking-[0.2em] text-xs font-semibold mb-4">
          Testimoni
        </p>
        <h2 className="font-display font-medium tracking-[-0.02em] text-[clamp(2rem,4vw,3.5rem)] text-black dark:text-white mb-12 text-center">
          Testimoni Klien
        </h2>
        <TestimonialCarousel testimonials={TESTIMONIALS} />
      </div>
    </section>
  );
}
