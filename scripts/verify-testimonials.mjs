import fs from "node:fs";
const sec = fs.readFileSync("src/components/sections/TestimonialSection.tsx", "utf8");
const fails = [];
if (sec.includes("ScrollReelTestimonials")) fails.push("must not use ScrollReelTestimonials");
if (!sec.includes("TestimonialCarousel")) fails.push("must use TestimonialCarousel");
let car = "";
try { car = fs.readFileSync("src/components/ui/testimonial-carousel.tsx", "utf8"); } catch { fails.push("carousel file missing"); }
if (car) {
  if (!car.includes("aria-roledescription") || !car.includes("carousel")) fails.push("needs carousel semantics");
  if (!car.includes("ArrowLeft") || !car.includes("ArrowRight")) fails.push("needs arrow nav");
  if (!car.includes("onKeyDown") && !car.includes("onKey")) fails.push("needs keyboard nav");
  if (!car.includes("pause") && !car.includes("Pause") && !car.includes("paused")) fails.push("needs pause-on-hover");
  if (car.includes("...testimonials, ...testimonials, ...testimonials")) fails.push("no 5x duplication allowed");
  if (!car.includes("alt")) fails.push("images need alt");
}
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("testimonials: ok");
