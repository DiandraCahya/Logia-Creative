"use client"

// Sebuah galeri karya yang digerakkan oleh satu "filmstrip".
//
// Setiap kartu berbagi satu sisi atas yang sama. Kartu terfokus memanjang penuh
// sementara tetangganya tetap terpotong sedikit lebih pendek, sehingga strip
// terbaca sebagai deretan thumbnail terpangkas dengan satu karya utuh berdiri di
// tengahnya. Memindahkan fokus menukar seluruh panggung ke karya itu.
//
// Geometri diukur, tidak pernah di-hardcode: satu ResizeObserver membaca panggung
// dan setiap ukuran di bawah adalah rasio darinya, sehingga komponen yang sama
// identik piksel demi piksel baik di kotak preview 600px maupun di layar 4K.
//
// Bahasa visualnya mengikuti sistem monokrom "minimalist-luxury" situs: satu kartu
// terfokus berwarna penuh, tetangganya diredupkan ke abu-abu, dan satu aksen
// bronze pada indikator aktif. Panggungnya theme-aware — panel gelap di dark mode,
// panel terang hangat di light mode — supaya menyatu dengan halaman di kedua tema.
import * as React from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"

export interface HeroCarouselItem {
  /** Stable key; falls back to the index. @default undefined */
  id?: string | number
  /** Headline for the active slide. Newlines become separate reveal lines. */
  title: string
  /** Image URL, used both in the card and as the background. */
  image: string
  /** One-line description shown under the headline. @default undefined */
  description?: string
  /** Small label shown above the headline, e.g. "Branding". @default undefined */
  category?: string
  /** Facts shown as pills, e.g. ["Meta Ads", "Social Media"]. @default undefined */
  meta?: string[]
  /** Live project URL; renders a "Kunjungi Proyek" link on the active slide. @default undefined */
  href?: string
  /**
   * Set when the image is a cut-out on transparency (not a photo). The stage
   * then keeps its solid plate and shows the artwork as a contained, sharp
   * figure on the right instead of washing it across the whole backdrop —
   * a transparent PNG used as a full-bleed wash leaves ~70% of the panel empty
   * and the plate collapses into the page colour.
   * @default false
   */
  figure?: boolean
  /** @deprecated kept for API compatibility; no longer used for colour grading. */
  accent?: string
  /** @deprecated no longer rendered. */
  credit?: string
}

export interface HeroCarouselProps {
  /** Slides, in strip order. */
  items: HeroCarouselItem[]
  /** Focused slide when controlled. Leave unset for internal state. @default undefined */
  index?: number
  /** Focused slide on mount when uncontrolled. @default 0 */
  defaultIndex?: number
  /** Fires on every focus change, from any input. @default undefined */
  onIndexChange?: (index: number) => void
  /** @deprecated no longer rendered. */
  brand?: React.ReactNode
  /** @deprecated no longer rendered. */
  onBack?: () => void
  /** @deprecated no longer rendered. */
  onMenu?: () => void
  /** Advance on a timer. Pauses on hover, drag and focus. @default false */
  autoplay?: boolean
  /** Milliseconds between autoplay steps. @default 4000 */
  autoplayDelay?: number
  /** Extra classes for the stage. @default undefined */
  className?: string
}

/* Ratios lifted from the reference layout, all relative to the stage box. */
const CARD_H = 0.30 // active card height ÷ stage height
const CARD_AR = 0.75 // active card is 3:4
const GAP = 0.038 // gap ÷ card width
const STRIP_TOP = 0.54 // strip's shared top edge, down the stage
const TITLE = 0.067 // headline cap size ÷ stage height
const PAD = 0.017 // page gutter ÷ stage width

/** Wheel distance that commits to a step, and the lockout after one. */
const WHEEL_THRESHOLD = 60
const WHEEL_COOLDOWN = 420

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

export function HeroCarousel({
  items,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  autoplay = false,
  autoplayDelay = 4000,
  className,
}: HeroCarouselProps) {
  const stageRef = React.useRef<HTMLDivElement>(null)
  const [box, setBox] = React.useState({ w: 0, h: 0 })
  const [uncontrolled, setUncontrolled] = React.useState(defaultIndex)
  const [dragging, setDragging] = React.useState(false)
  const [paused, setPaused] = React.useState(false)
  const reduced = useReducedMotion()

  const last = items.length - 1
  const index = clamp(controlled ?? uncontrolled, 0, Math.max(0, last))

  const go = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, Math.max(0, last))
      if (controlled === undefined) setUncontrolled(clamped)
      if (clamped !== index) onIndexChange?.(clamped)
    },
    [controlled, index, last, onIndexChange]
  )

  // One observer feeds every measurement below.
  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const read = () =>
      setBox({ w: stage.clientWidth, h: stage.clientHeight })
    read()
    const ro = new ResizeObserver(read)
    ro.observe(stage)
    return () => ro.disconnect()
  }, [])

  // Panggung sempit (mobile) butuh kartu proporsional lebih tinggi, kalau tidak
  // strip-nya kecil dan menyisakan rongga kosong besar di bawah headline.
  const compact = box.w > 0 && box.w < 640
  const fullH = clamp(box.h * (compact ? 0.36 : CARD_H), compact ? 132 : 96, 360)
  // Tetangga sengaja tidak dipotong separuh: 0.78 menjaga hierarki filmstrip
  // tanpa mengubah rasio kartu sampai terlihat "terpotong".
  const neighborH = Math.round(fullH * 0.78)
  const cardW = fullH * CARD_AR
  const gap = Math.max(4, Math.round(cardW * GAP))
  const step = cardW + gap
  const pad = Math.max(16, Math.round(box.w * PAD))

  // Centre the focused card: the track slides, the card never moves itself.
  const xFor = React.useCallback(
    (i: number) => box.w / 2 - (i * step + cardW / 2),
    [box.w, step, cardW]
  )
  const x = useMotionValue(0)
  const target = xFor(index)

  const swing = reduced || compact
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 80, damping: 20, mass: 0.8 }
  const spring = reduced || compact
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 34, mass: 0.9 }

  // The track is driven by a motion value rather than an `animate` prop so a
  // drag that starts mid-spring reads the real position, not where the spring
  // was headed - otherwise the release snaps a card off.
  React.useEffect(() => {
    if (dragging) return
    const run = animate(x, target, spring)
    return () => run.stop()
    // `spring` is a literal, so `reduced` (all it derives from) stands in for it.
  }, [target, dragging, reduced, x]) // eslint-disable-line react-hooks/exhaustive-deps

  // Wheel and trackpad. Both axes step the strip.
  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let acc = 0
    let until = 0

    const onWheel = (e: WheelEvent) => {
      // Trackpads report the dominant axis; take whichever is stronger.
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      // Scroll chaining: once the strip is against an end, hand the gesture
      // back to the page. Without this a full-height carousel is a scroll trap
      // with no way past it.
      const stuck = (delta > 0 && index === last) || (delta < 0 && index === 0)
      if (stuck) {
        acc = 0
        return
      }
      e.preventDefault()
      const now = e.timeStamp
      if (now < until) return
      acc += delta
      if (Math.abs(acc) < WHEEL_THRESHOLD) return
      go(index + Math.sign(acc))
      acc = 0
      until = now + WHEEL_COOLDOWN
    }

    stage.addEventListener("wheel", onWheel, { passive: false })
    return () => stage.removeEventListener("wheel", onWheel)
  }, [go, index, last])

  React.useEffect(() => {
    if (!autoplay || paused || dragging || items.length < 2) return
    const id = window.setTimeout(
      () => go(index === last ? 0 : index + 1),
      autoplayDelay
    )
    return () => window.clearTimeout(id)
  }, [autoplay, autoplayDelay, dragging, go, index, items.length, last, paused])

  const active = items[index]
  if (!active) return null

  const lines = active.title.split("\n")

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Karya pilihan"
      onKeyDown={(e) => {
        const keys: Record<string, number> = {
          ArrowLeft: index - 1,
          ArrowRight: index + 1,
          Home: 0,
          End: last,
        }
        if (!(e.key in keys)) return
        e.preventDefault()
        go(keys[e.key]!)
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "relative h-full min-h-[24rem] w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] select-none",
        // Satu langkah tone di atas --bg-primary (#FAFAF8) supaya tepi panel terbaca
        // tanpa bergantung pada border. Panel gelap dark mode memakai #0a0a0a.
        "bg-[#e8e3d9] text-black border border-black/10",
        "dark:bg-[#0a0a0a] dark:text-white dark:border-white/10",
        "outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50 focus-visible:ring-inset",
        className
      )}
    >
      {/* ── Backdrop: karya terfokus. Di light mode ia jadi tekstur samar; di dark
          mode ia digelapkan agar panggung tetap netral. Karya berupa cut-out
          transparan tidak di-wash — lihat cabang `active.figure`. ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={swing}
        >
          {active.figure ? (
            /* Cut-out: `bg-black` di belakang gambar mengisi 72% area transparan,
               jadi panggung tetap punya isi seperti slide foto lain (bukan plate
               kosong) dan patungnya terbaca sebagai marble di atas hitam.
               Untuk foto biasa class ini tak berpengaruh — gambarnya opaque. */
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ scale: reduced || compact ? 1.1 : 1.2 }}
              animate={{ scale: 1.1 }}
              transition={reduced || compact ? { duration: 0 } : { duration: 8, ease: "linear" }}
            >
              <Image
                src={active.image}
                alt=""
                aria-hidden
                draggable={false}
                fill
                sizes="100vw"
                quality={90}
                priority={index === 0}
                className="object-cover grayscale opacity-100"
              />
            </motion.div>
          ) : (
            /* The backdrop is heavily scaled and darkened, so its detail is
                largely destroyed anyway - run it through next/image so the browser
                fetches a viewport-sized variant instead of the full-resolution
                original. The scale lives on the wrapper; `fill` keeps the photo
                edge-to-edge inside it. */
            <motion.div
              className="absolute inset-0"
              initial={{ scale: reduced || compact ? 1.1 : 1.2 }}
              animate={{ scale: 1.1 }}
              transition={reduced || compact ? { duration: 0 } : { duration: 8, ease: "linear" }}
            >
              <Image
                src={active.image}
                alt=""
                aria-hidden
                draggable={false}
                fill
                sizes="100vw"
                quality={60}
                priority={index === 0}
                className="object-cover grayscale opacity-100"
              />
            </motion.div>
          )}
          {/* Scrim netral per tema: menahan luminansi tanpa mewarnai panggung. */}
          <div className="absolute inset-0 bg-[#faf8f3]/70 dark:bg-black/70" />
          {/* Veil kedua: rongga atas dibiarkan paling tipis supaya tekstur karya
              terbaca (peran yang sama dengan black/30 di dark mode), lalu dipadatkan
              ke bawah supaya headline + deskripsi duduk di bidang bersih. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f3]/0 via-[#faf8f3]/40 to-[#faf8f3]/55 dark:from-black/30 dark:via-transparent dark:to-black/80" />{/* taste-skill-ignore: neutral scrim over the photo, the skill's allowed exception */}
        </motion.div>
      </AnimatePresence>

      {/* ── Blok headline, duduk tepat di atas sisi atas strip ── */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col justify-end"
        style={{
          height: `${STRIP_TOP * 100}%`,
          paddingLeft: pad,
          paddingRight: pad,
          paddingBottom: Math.round(box.h * 0.055),
        }}
      >
        <div className="min-w-0 max-w-[46rem]">
          {active.category ? (
            <motion.span
              key={`cat-${index}`}
              className="mb-3 inline-block rounded-full border border-black/15 bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-black/70 dark:border-white/25 dark:bg-white/15 dark:text-white/90"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20 }}
            >
              {active.category}
            </motion.span>
          ) : null}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h3
              key={index}
              className="font-display font-medium leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: Math.max(24, Math.round(box.h * TITLE)) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
            >
              {lines.map((line, i) => (
                // Each line wipes up from behind its own edge.
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 120, damping: 20, delay: i * 0.05 }
                    }
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h3>
          </AnimatePresence>

          {active.description ? (
            <motion.p
              key={`desc-${index}`}
              className="mt-3 max-w-[40rem] text-sm leading-relaxed text-black/70 dark:text-white/70"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20, delay: 0.08 }}
            >
              {active.description}
            </motion.p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {active.meta?.map((tag, i) => (
              <motion.span
                key={`${index}-${tag}`}
                className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-medium text-black/70 dark:border-white/15 dark:bg-white/5 dark:text-white/85"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduced ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20, delay: 0.1 + i * 0.05 }
                }
              >
                {tag}
              </motion.span>
            ))}
            {active.href ? (
              <motion.a
                key={`link-${index}`}
                href={active.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.97] dark:bg-white dark:text-black"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduced ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20, delay: 0.1 + (active.meta?.length ?? 0) * 0.05 }
                }
              >
                <span>Kunjungi Proyek</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </motion.a>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Strip: satu sisi atas bersama, kartu terfokus lebih tinggi ── */}
      <div
        className="absolute inset-x-0"
        style={{ top: `${STRIP_TOP * 100}%`, height: fullH }}
      >
        <motion.div
          className="flex items-start"
          style={{ gap, x, cursor: dragging ? "grabbing" : "grab" }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={{ left: xFor(last), right: xFor(0) }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false)
            // Land on whatever card the release sits nearest, nudged by throw
            // velocity so a flick clears more than one card.
            const thrown = x.get() + info.velocity.x * 0.12
            go(Math.round((box.w / 2 - thrown - cardW / 2) / step))
          }}
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id ?? i}
              type="button"
              aria-label={item.title.replace(/\n/g, " ")}
              aria-current={i === index}
              onClick={() => go(i)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-black/5 ring-1 transition-[box-shadow] duration-300 dark:bg-white/5",
                i === index ? "ring-black/30 dark:ring-white/40" : "ring-black/10 dark:ring-white/10"
              )}
              style={{ width: cardW }}
              animate={{ height: i === index ? fullH : neighborH, opacity: i === index ? 1 : 0.55 }}
              transition={spring}
            >
              <Image
                src={item.image}
                alt=""
                draggable={false}
                fill
                sizes={`${Math.round(cardW)}px`}
                quality={60}
                loading="lazy"
                className={cn(
                  "h-full w-full object-cover transition-[filter] duration-500",
                  i === index ? "grayscale-0" : "grayscale"
                )}
                style={{ objectPosition: item.figure ? "50% 100%" : "50% 26%" }}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* ── Kontrol: titik indikator + tombol sebelumnya/berikutnya ── */}
      <div
        className="absolute flex items-center justify-between gap-4"
        style={{ left: pad, right: pad, bottom: Math.max(16, Math.round(box.h * 0.03)) }}
      >
        <div className="flex items-center gap-1.5" role="group" aria-label="Pilih karya">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ke karya ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className="flex h-8 items-center justify-center"
            >
              <span
                className={cn(
                  "block rounded-full transition-[width,background-color] duration-300",
                  i === index
                    ? "h-2 w-6 bg-[var(--accent-bronze)]"
                    : "h-2 w-2 bg-black/20 hover:bg-black/40 dark:bg-white/40 dark:hover:bg-white/75"
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Karya sebelumnya"
            disabled={index === 0}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Karya berikutnya"
            disabled={index === last}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
