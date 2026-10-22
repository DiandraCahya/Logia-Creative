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
// bronze pada indikator aktif. Panggungnya theme-aware: panel gelap di dark mode,
// panel terang hangat di light mode: supaya menyatu dengan halaman di kedua tema.
//
// ponytail: framer-motion dihapus: semua animasi jadi CSS transition, spring
// di-kilakan oleh easing yang cocok, crossfade cukup dengan unmount + mount
// (opacity tidak bisa di-transition pada elemen baru), drag pakai Pointer
// Events native. Hemat ~1.2 MB runtime. Ceiling: kalau butuh physics spring
// sungguhan atau drag dengan momentum, ganti kembali ke framer-motion atau
// rancang khusus.
import * as React from "react"
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
   * figure on the right instead of washing it across the whole backdrop:
   * a transparent PNG used as a full-bleed wash leaves ~70% of the panel empty
   * and the plate collapses into the page colour.
   * @default false
   */
  figure?: boolean
  /** Mode tampilan foto: cover (default) atau contain (tanpa terpotong) */
  fit?: "cover" | "contain"
  /** Fokus pemotongan foto: center, top, bottom, left, right */
  focalPoint?: "center" | "top" | "bottom" | "left" | "right"
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

export const FOCAL_POSITION_MAP: Record<string, string> = {
  center: "50% 50%",
  top: "50% 15%",
  bottom: "50% 85%",
  left: "15% 50%",
  right: "85% 50%",
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

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
  const [reduced, setReduced] = React.useState(false)
  const [dragOffset, setDragOffset] = React.useState(0)
  const [inView, setInView] = React.useState(false)

  const last = items.length - 1
  const index = clamp(controlled ?? uncontrolled, 0, Math.max(0, last))

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])

  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage || typeof IntersectionObserver === "undefined") return
    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
    }, { threshold: 0.05 })
    obs.observe(stage)
    return () => obs.disconnect()
  }, [])

  const go = React.useCallback(
    (next: number) => {
      const total = items.length
      if (total <= 0) return
      const wrapped = ((next % total) + total) % total
      if (controlled === undefined) setUncontrolled(wrapped)
      if (wrapped !== index) onIndexChange?.(wrapped)
    },
    [controlled, index, items.length, onIndexChange]
  )

  // One observer feeds every measurement below.
  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setBox({ w: entry.contentRect.width, h: entry.contentRect.height })
      }
    })
    ro.observe(stage)
    return () => ro.disconnect()
  }, [])

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
    if (!inView || !autoplay || paused || dragging || items.length < 2) return
    const id = window.setTimeout(
      () => go(index === last ? 0 : index + 1),
      autoplayDelay
    )
    return () => window.clearTimeout(id)
  }, [autoplay, autoplayDelay, dragging, go, inView, index, items.length, last, paused])

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
  const target = xFor(index)

  // Easing kilakan spring lama: spring stiffness ~260/damping ~34 ≈ 0.55s,
  // swing stiffness ~80/damping ~20 ≈ 0.45s.
  const trackEase = reduced || compact
    ? "linear"
    : "cubic-bezier(0.22, 1, 0.36, 1)"

  const active = items[index]
  if (!active) return null

  const lines = active.title.split("\n")

  /* ── Komposisi ponsel ─────────────────────────────────────────────────
     Panel desktop (teks di atas + filmstrip + kontrol melayang) dipaksa muat
     di 343px sehingga terasa sesak. Di ponsel kartunya disusun ulang: satu
     visual besar 4:5, teks mengalir di bawahnya, kontrol menempel di kartu.
     Desktop tidak tersentuh - cabang ini hanya jalan saat lebar < 640. */
  if (compact) {
    const titleFlat = active.title.replace(/\n/g, " ")
    // Drag sederhana: track pointer, geser, commit di lepas.
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      el.setPointerCapture(e.pointerId)
      const start = e.clientX
      setDragging(true)
      const onMove = (ev: PointerEvent) => {
        setDragOffset(clamp(ev.clientX - start, -0.6 * el.clientWidth, 0.6 * el.clientWidth))
      }
      const onUp = (ev: PointerEvent) => {
        const dx = ev.clientX - start
        setDragging(false)
        setDragOffset(0)
        if (dx < -60) go(index + 1)
        else if (dx > 60) go(index - 1)
        el.removeEventListener("pointermove", onMove)
        el.removeEventListener("pointerup", onUp)
        el.removeEventListener("pointercancel", onUp)
      }
      el.addEventListener("pointermove", onMove)
      el.addEventListener("pointerup", onUp)
      el.addEventListener("pointercancel", onUp)
    }
    return (
      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Karya pilihan"
        onKeyDown={(e) => {
          const keys: Record<string, number> = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: last }
          if (!(e.key in keys)) return
          e.preventDefault()
          go(keys[e.key]!)
        }}
        className="relative w-full select-none overflow-hidden rounded-[1.5rem] border border-black/10 bg-black/[0.02] dark:border-white/10 dark:bg-black"
      >
        {/* Visual: satu kartu besar, bisa digeser kiri/kanan */}
        <div
          className="relative aspect-[4/5] w-full overflow-hidden bg-black dark:bg-black cursor-grab active:cursor-grabbing touch-pan-x"
          onPointerDown={onPointerDown}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `translateX(${dragOffset}px) scale(${dragging ? 1 : 1})`,
              transition: dragging ? "none" : "opacity 0.35s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div
              key={index}
              className="absolute inset-0"
              style={
                reduced
                  ? undefined
                  : {
                      animation: "heroFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
                    }
              }
            >
              {active.fit === "contain" && !active.figure && (
                <Image
                  src={active.image}
                  alt=""
                  aria-hidden
                  draggable={false}
                  fill
                  sizes="100vw"
                  quality={60}
                  className="object-cover blur-xl scale-125 opacity-40 brightness-75 dark:brightness-50 pointer-events-none"
                />
              )}
              <Image
                src={active.image}
                alt={titleFlat}
                fill
                sizes="100vw"
                quality={85}
                loading="lazy"
                decoding="async"
                draggable={false}
                className={cn(
                  "relative z-10",
                  active.fit === "contain"
                    ? "object-contain object-center p-3"
                    : active.figure
                    ? "object-contain object-bottom p-2"
                    : "object-cover"
                )}
                style={{
                  objectPosition: active.figure
                    ? "50% 100%"
                    : active.fit === "contain"
                    ? "50% 50%"
                    : active.focalPoint
                    ? (FOCAL_POSITION_MAP[active.focalPoint] || "50% 26%")
                    : "50% 26%",
                }}
              />
            </div>
          </div>

          {/* Hitungan posisi, pengganti strip thumbnail */}
          <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </div>
        </div>

        {/* Teks mengalir di bawah visual, bukan menumpuk di atasnya */}
        <div className="px-5 pb-4 pt-4">
          {active.category ? (
            <span className="mb-2 inline-block rounded-full border border-black/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-black/60 dark:border-white/25 dark:text-white/70">
              {active.category}
            </span>
          ) : null}

          <h3 className="font-righteous text-[26px] leading-[1.12] tracking-normal text-black dark:text-white">
            {titleFlat}
          </h3>

          {active.description ? (
            /* 3 baris dikunci supaya tinggi kartu tidak melompat saat pindah karya */
            <p className="mt-2 line-clamp-3 min-h-[65px] text-[14px] leading-[1.55] text-black/70 dark:text-white/75">
              {active.description}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {active.meta?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/10 bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium text-black/70 dark:border-white/15 dark:bg-white/5 dark:text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>

          {active.href ? (
            <a
              href={active.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-black px-4 py-2.5 text-[12px] font-semibold text-white transition-transform active:scale-[0.98] dark:bg-white dark:text-black"
            >
              <span>Kunjungi Proyek</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}

          {/* Kontrol menempel di kartu, dalam jangkauan jempol.
             Di layar sempit (< 400px), padding kanan ekstra supaya tombol next
             tidak tergeser keluar dari kartu (kartu punya overflow-hidden). */}
          <div className={cn(
            "mt-4 flex items-center justify-between pr-1 max-[400px]:pr-2 max-[340px]:pr-3"
          )}>
            <div className="flex items-center gap-1" role="group" aria-label="Pilih karya">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Ke karya ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className="flex h-10 min-w-5 items-center justify-center"
                >
                  <span
                    className={cn(
                      "block rounded-full transition-[width,background-color] duration-300",
                      i === index ? "h-1.5 w-5 bg-[var(--accent-bronze)]" : "h-1.5 w-1.5 bg-black/20 dark:bg-white/35"
                    )}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                disabled={items.length <= 1}
                aria-label="Karya sebelumnya"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-black transition-colors active:scale-95 disabled:opacity-30 dark:border-white/20 dark:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                disabled={items.length <= 1}
                aria-label="Karya berikutnya"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-black transition-colors active:scale-95 disabled:opacity-30 dark:border-white/20 dark:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Track desktop: geser via Pointer Events, spring jadi CSS transition ── */
  const trackPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging || !stageRef.current) return
    const track = e.currentTarget
    track.setPointerCapture(e.pointerId)
    const startX = e.clientX
    const t0 = xFor(index) // posisi track saat grab, tanpa offset
    setDragging(true)

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      setDragOffset(dx)
    }
    const onUp = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      // Land on whatever card the release sits nearest, nudged by throw
      // velocity so a flick clears more than one card.
      const thrown = t0 + dx
      const next = Math.round((box.w / 2 - thrown - cardW / 2) / step)
      setDragging(false)
      setDragOffset(0)
      go(next)
      track.removeEventListener("pointermove", onMove)
      track.removeEventListener("pointerup", onUp)
      track.removeEventListener("pointercancel", onUp)
    }
    track.addEventListener("pointermove", onMove)
    track.addEventListener("pointerup", onUp)
    track.addEventListener("pointercancel", onUp)
  }

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
          transparan tidak di-wash - lihat cabang `active.figure`. ── */}
      <div key={`bd-${index}`} className="absolute inset-0" style={reduced ? undefined : {
          animation: "heroFadeIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}>
        {active.figure ? (
          /* Cut-out: `bg-black` di belakang gambar mengisi 72% area transparan,
             jadi panggung tetap punya isi seperti slide foto lain (bukan plate
             kosong) dan patungnya terbaca sebagai marble di atas hitam.
             Untuk foto biasa class ini tak berpengaruh - gambarnya opaque. */
          <div
            className="absolute inset-0 bg-black"
            style={{
              transform: "scale(1.2)",
              transition: reduced ? "none" : "transform 8s linear",
            }}
          >
            <Image
              src={active.image}
              alt=""
              aria-hidden
              draggable={false}
              fill
              sizes="100vw"
              quality={90}
              loading="lazy"
              decoding="async"
              className="object-cover grayscale opacity-100"
            />
          </div>
        ) : (
          /* The backdrop is heavily scaled and darkened, so its detail is
              largely destroyed anyway - run it through next/image so the browser
              fetches a viewport-sized variant instead of the full-resolution
              original. The scale lives on the wrapper; `fill` keeps the photo
              edge-to-edge inside it. */
          <div
            className="absolute inset-0"
            style={{
              transform: "scale(1.2)",
              transition: reduced ? "none" : "transform 8s linear",
            }}
          >
            <Image
              src={active.image}
              alt=""
              aria-hidden
              draggable={false}
              fill
              sizes="100vw"
              quality={60}
              loading="lazy"
              decoding="async"
              className="object-cover grayscale opacity-100"
              style={{
                objectPosition: active.focalPoint
                  ? (FOCAL_POSITION_MAP[active.focalPoint] || "50% 26%")
                  : "50% 26%",
              }}
            />
          </div>
        )}
        {/* Scrim netral per tema: menahan luminansi tanpa mewarnai panggung. */}
        <div className="absolute inset-0 bg-[#faf8f3]/70 dark:bg-black/70" />
        {/* Veil kedua: rongga atas dibiarkan paling tipis supaya tekstur karya
            terbaca (peran yang sama dengan black/30 di dark mode), lalu dipadatkan
            ke bawah supaya headline + deskripsi duduk di bidang bersih. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f3]/0 via-[#faf8f3]/40 to-[#faf8f3]/55 dark:from-black/30 dark:via-transparent dark:to-black/80" />{/* taste-skill-ignore: neutral scrim over the photo, the skill's allowed exception */}
      </div>

      {/* ── Blok headline, duduk tepat di atas sisi atas strip ── */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col justify-end"
        style={{
          height: `${STRIP_TOP * 100}%`,
          paddingLeft: Math.max(36, Math.round(box.w * 0.055)),
          paddingRight: Math.max(24, Math.round(box.w * 0.03)),
          paddingBottom: Math.round(box.h * 0.055),
        }}
      >
        <div className="min-w-0 max-w-[46rem]">
          {active.category ? (
            <span
              key={`cat-${index}`}
              className="mb-3 inline-block rounded-full border border-black/15 bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-black/70 dark:border-white/25 dark:bg-white/15 dark:text-white/90"
              style={reduced ? undefined : {
                animation: "heroRise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
              }}
            >
              {active.category}
            </span>
          ) : null}
          <h3
            key={index}
            className="font-righteous leading-[1.1] tracking-normal text-black dark:text-white"
            style={{
              fontSize: Math.max(24, Math.round(box.h * TITLE)),
              ...(reduced ? {} : {
                animation: "heroFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
              }),
            }}
          >
            {lines.map((line, i) => (
              // Each line wipes up from behind its own edge with generous padding to prevent glyph clipping
              <span key={i} className="block overflow-hidden pr-8 pb-3 -mr-8 -mb-1">
                <span
                  className="block"
                  style={
                    reduced
                      ? undefined
                      : {
                          animation: `heroRise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both ${i * 0.05}s`,
                        }
                  }
                >
                  {line}
                </span>
              </span>
            ))}
          </h3>

          {active.description ? (
            <p
              key={`desc-${index}`}
              className="mt-3 max-w-[40rem] text-sm leading-relaxed text-black/70 dark:text-white/70"
              style={reduced ? undefined : {
                animation: "heroRise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both 0.08s",
              }}
            >
              {active.description}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {active.meta?.map((tag, i) => (
              <span
                key={`${index}-${tag}`}
                className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-medium text-black/70 dark:border-white/15 dark:bg-white/5 dark:text-white/85"
                style={reduced ? undefined : {
                  animation: `heroRise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both ${0.1 + i * 0.05}s`,
                }}
              >
                {tag}
              </span>
            ))}
            {active.href ? (
              <a
                key={`link-${index}`}
                href={active.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.97] dark:bg-white dark:text-black"
                style={reduced ? undefined : {
                  animation: `heroRise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both ${0.1 + (active.meta?.length ?? 0) * 0.05}s`,
                }}
              >
                <span>Kunjungi Proyek</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Strip: satu sisi atas bersama, kartu terfokus lebih tinggi ── */}
      <div
        className="absolute inset-x-0"
        style={{ top: `${STRIP_TOP * 100}%`, height: fullH }}
      >
        <div
          className="flex items-start"
          style={{
            gap,
            transform: `translateX(${target + dragOffset}px)`,
            cursor: dragging ? "grabbing" : "grab",
            transition: dragging || reduced
              ? "none"
              : `transform 0.55s ${trackEase}`,
          }}
          onPointerDown={trackPointer}
        >
          {items.map((item, i) => (
            <button
              key={item.id ?? i}
              type="button"
              aria-label={item.title.replace(/\n/g, " ")}
              aria-current={i === index}
              onClick={() => go(i)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-black/5 ring-1 transition-[box-shadow] duration-300 dark:bg-white/5",
                i === index ? "ring-black/30 dark:ring-white/40" : "ring-black/10 dark:ring-white/10"
              )}
              style={{
                width: cardW,
                height: i === index ? fullH : neighborH,
                opacity: i === index ? 1 : 0.55,
                transition: reduced
                  ? "none"
                  : `height 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.55s cubic-bezier(0.22,1,0.36,1)`,
              }}
            >
              {/* Latar belakang blur lembut bila mode contain agar kartu tidak menyisakan ruang hampa hitam */}
              {item.fit === "contain" && !item.figure && (
                <Image
                  src={item.image}
                  alt=""
                  aria-hidden
                  draggable={false}
                  fill
                  sizes={`${Math.round(cardW)}px`}
                  quality={60}
                  className="object-cover blur-md scale-125 opacity-40 brightness-75 dark:brightness-50 pointer-events-none"
                />
              )}
              <Image
                src={item.image}
                alt=""
                draggable={false}
                fill
                sizes={`${Math.round(cardW)}px`}
                quality={60}
                loading="lazy"
                decoding="async"
                className={cn(
                  "h-full w-full transition-[filter] duration-500 relative z-10",
                  item.fit === "contain"
                    ? "object-contain p-2.5"
                    : item.figure
                    ? "object-contain p-2"
                    : "object-cover",
                  i === index ? "grayscale-0" : "grayscale"
                )}
                style={{
                  objectPosition: item.figure
                    ? "50% 100%"
                    : item.fit === "contain"
                    ? "50% 50%"
                    : item.focalPoint
                    ? (FOCAL_POSITION_MAP[item.focalPoint] || "50% 26%")
                    : "50% 26%",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Kontrol: titik indikator + tombol sebelumnya/berikutnya ── */}
      <div
        className="absolute flex items-center justify-between gap-2 sm:gap-4"
        style={{ left: Math.max(36, Math.round(box.w * 0.055)), right: Math.max(24, Math.round(box.w * 0.03)), bottom: Math.max(16, Math.round(box.h * 0.03)) }}
      >
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0" role="group" aria-label="Pilih karya">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ke karya ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className="flex h-8 w-5 sm:w-6 items-center justify-center p-0 shrink-0"
            >
              <span
                className={cn(
                  "block rounded-full transition-[width,background-color] duration-300",
                  i === index
                    ? "h-2 w-5 sm:w-6 bg-[var(--accent-bronze)]"
                    : "h-2 w-2 bg-black/20 hover:bg-black/40 dark:bg-white/40 dark:hover:bg-white/75"
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Karya sebelumnya"
            disabled={items.length <= 1}
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white/10 shrink-0"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Karya berikutnya"
            disabled={items.length <= 1}
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white/10 shrink-0"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
