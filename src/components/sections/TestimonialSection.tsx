"use client";

import React, { useEffect, useState } from "react";
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";
import { api, getMediaUrl, TestimonialItem } from "@/lib/api";

const DEFAULT_TESTIMONIALS = [
  {
    quote: "Identitas brand kami terliat jauh lebih profesional setelah bekerja sama dengan Logia Creative.",
    author: "Miyawaki Sakura",
    image: getMediaUrl("/uploads/miyawaki sakura.webp"),
    alt: "Miyawaki Sakura",
  },
  {
    quote: "Proses kerjanya rapi dan hasil desainnya konsisten dari awal sampai serah-terima.",
    author: "Kim Chaewon",
    image: getMediaUrl("/uploads/kim chaewon.webp"),
    alt: "Kim Chaewon",
  },
  {
    quote: "Website-nya cepat, rapi di mobile, dan mudah kami kelola sendiri setelahnya.",
    author: "Hong Eunchae",
    image: getMediaUrl("/uploads/hong eunchae.webp"),
    alt: "Hong Eunchae",
  },
  {
    quote: "Setiap detail visual dikerjakan dengan teliti, hasil akhirnya sesuai ekspektasi kami.",
    author: "Hwang Ye-ji",
    image: getMediaUrl("/uploads/hwang ye-ji.webp"),
    alt: "Hwang Ye-ji",
  },
  {
    quote: "Konten sosmed yang dibuat membuat feed kami terliat konsisten dan rapi.",
    author: "Enami Asa",
    image: getMediaUrl("/uploads/enami asa.webp"),
    alt: "Enami Asa",
  },
  {
    quote: "Otomatisasi yang dipasang menghemat waktu tim kami untuk hal-hal lain.",
    author: "Pham Hanni",
    image: getMediaUrl("/uploads/pham hanni.webp"),
    alt: "Pham Hanni",
  },
];

export function TestimonialSection() {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    let isMounted = true;
    api
      .getTestimonials()
      .then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          setTestimonials(
            res.data.map((t) => ({
              quote: t.quote,
              author: t.author,
              image: getMediaUrl(t.image),
              alt: t.alt || t.author,
            }))
          );
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_TESTIMONIALS if API is offline
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="testimoni" className="w-full py-14 md:py-28">
      <div className="mx-auto w-full max-w-4xl flex flex-col items-center px-4 sm:px-6">
        <h2 className="font-righteous tracking-normal text-[clamp(2.25rem,6vw,4.5rem)] text-center text-black dark:text-white mb-6 sm:mb-8 leading-[1.05]">
          Kata Mereka
        </h2>
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}
