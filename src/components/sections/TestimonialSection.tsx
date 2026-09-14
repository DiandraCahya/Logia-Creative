"use client";

import { ScrollReelTestimonials } from "@/components/ui/scroll-reel-testimonials";

const TESTIMONIALS = [
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
    <section className="w-full min-h-[100vh] pt-20 bg-transparent flex flex-col items-center justify-center relative z-10 pointer-events-none">
      <div className="pointer-events-auto w-full flex flex-col items-center h-full">
        <h2 className="text-3xl md:text-5xl font-black mb-12 uppercase text-slate-900 dark:text-white tracking-tighter px-4 text-center">Testimoni dari mereka</h2>
        <ScrollReelTestimonials testimonials={TESTIMONIALS} className="flex-1 w-full" />
      </div>
    </section>
  );
}
