"use client";

import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";

// ponytail: nama memakai nama sesuai foto di public/; kutipan masih placeholder.
const TESTIMONIALS = [
  {
    quote: "Identitas brand kami terliat jauh lebih profesional setelah bekerja sama dengan Logia Creative.",
    author: "Miyawaki Sakura",
    image: "/miyawaki sakura.webp",
    alt: "Miyawaki Sakura",
  },
  {
    quote: "Proses kerjanya rapi dan hasil desainnya konsisten dari awal sampai serah-terima.",
    author: "Kim Chaewon",
    image: "/kim chaewon.webp",
    alt: "Kim Chaewon",
  },
  {
    quote: "Website-nya cepat, rapi di mobile, dan mudah kami kelola sendiri setelahnya.",
    author: "Hong Eunchae",
    image: "/hong eunchae.webp",
    alt: "Hong Eunchae",
  },
  {
    quote: "Setiap detail visual dikerjakan dengan teliti, hasil akhirnya sesuai ekspektasi kami.",
    author: "Hwang Ye-ji",
    image: "/hwang ye-ji.webp",
    alt: "Hwang Ye-ji",
  },
  {
    quote: "Konten sosmed yang dibuat membuat feed kami terliat konsisten dan rapi.",
    author: "Enami Asa",
    image: "/enami asa.webp",
    alt: "Enami Asa",
  },
  {
    quote: "Otomatisasi yang dipasang menghemat waktu tim kami untuk hal-hal lain.",
    author: "Pham Hanni",
    image: "/pham hanni.webp",
    alt: "Pham Hanni",
  },
];

export function TestimonialSection() {
  return (
    <section id="testimoni" className="w-full py-14 md:py-28">
      <div className="mx-auto w-full max-w-4xl flex flex-col items-center px-4 sm:px-6">
        <h2 className="font-righteous tracking-normal text-[clamp(2.25rem,6vw,4.5rem)] text-center text-black dark:text-white mb-6 sm:mb-8 leading-[1.05]">
          Kata Mereka
        </h2>
        <TestimonialCarousel testimonials={TESTIMONIALS} />
      </div>
    </section>
  );
}
