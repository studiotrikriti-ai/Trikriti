"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    eyebrow: "New Collection",
    headline: "Where Ideas\nGet Printed.",
    sub: "Premium 3D printed home decor, accessories & personalized gifts — crafted with care.",
    cta: "Shop Now",
    ctaHref: "/products",
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1779907254/ShivMudra2_f5xxee.png",
    tag: "Featured",
  },
  {
    id: 2,
    eyebrow: "Lighting · 40% OFF",
    headline: "Aurora Prism\nLamp",
    sub: "Elegant geometric 3D printed table lamp. Soft ambient glow for any room.",
    cta: "View Product",
    ctaHref: "/products",
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1779907253/lamp_rek6g3.png",
    tag: "₹1200",
  },
  {
    id: 3,
    eyebrow: "Lighting · 40% OFF",
    headline: "Luna Swirl\nLamp",
    sub: "Flowing curves, warm light, tripod base. A statement piece for modern living.",
    cta: "View Product",
    ctaHref: "/products",
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1779907253/Luna_Swirl_Lamp_2_jszpoz.png",
    tag: "₹1300",
  },
  {
    id: 4,
    eyebrow: "Accessories · 40% OFF",
    headline: "Mini Tumbler\nKeychain",
    sub: "Carry your lip balm in style. Trendy 3D printed tumbler keychain.",
    cta: "Shop Now",
    ctaHref: "/products",
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1779907253/MiniTumbler_g9e1wd.png",
    tag: "₹150",
  },
];

const DURATION = 6000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const goTo = useCallback((i: number) => {
    setCurrent(((i % slides.length) + slides.length) % slides.length);
    setProgress(0);
    startRef.current = performance.now();
  }, []);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - startRef.current) / DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        setCurrent((c) => (c + 1) % slides.length);
        startRef.current = performance.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [current]);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden">

      {/* ─── MOBILE: full-cover image with overlay ─── */}
      <div className="lg:hidden relative h-[100svh] min-h-[580px] max-h-[780px]">

        {/* Background images — stacked, crossfade */}
        {slides.map((s, i) => (
          <div
            key={s.id}
            aria-hidden={i !== current}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              backgroundImage: `url(${s.image})`,
              opacity: i === current ? 1 : 0,
            }}
          />
        ))}

        {/* Dark gradient overlay — strong at bottom, fades to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        {/* TOP BAR — brand + price tag */}
        

        {/* BOTTOM CONTENT — floats over image */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8">

          {/* Eyebrow */}
          <div
            key={`eyebrow-${slide.id}`}
            className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-[10px] uppercase tracking-[0.18em] text-white/80 animate-[fadeUp_500ms_ease-out]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            {slide.eyebrow}
          </div>

          {/* Headline */}
          <h1
            key={`headline-${slide.id}`}
            className="font-serif text-[2.6rem] leading-[0.94] tracking-tight whitespace-pre-line text-white mb-3 animate-[fadeUp_600ms_ease-out]"
          >
            {slide.headline}
          </h1>

          {/* Sub */}
          <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-xs">
            {slide.sub}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href={slide.ctaHref}
              className="group inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 pl-5 pr-1.5 py-1.5 text-sm font-semibold hover:bg-rose-50 transition-colors"
            >
              {slide.cta}
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900 text-white group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={15} />
              </span>
            </Link>
            <Link
              href="/track-order"
              className="inline-flex items-center px-4 py-2.5 rounded-full text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Track Order →
            </Link>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
            >
              <ArrowRight size={15} />
            </button>
            <div className="flex-1 h-[1.5px] bg-white/20 relative overflow-hidden rounded-full">
              <div
                className="absolute inset-y-0 left-0 bg-white rounded-full"
                style={{ width: `${progress * 100}%`, transition: "width 80ms linear" }}
              />
            </div>
            <span className="text-xs text-white/50 tabular-nums min-w-[28px] text-right">
              {current + 1} / {slides.length}
            </span>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`relative shrink-0 w-11 h-11 rounded-xl overflow-hidden border-2 transition-all ${
                  i === current
                    ? "border-white scale-105"
                    : "border-white/25 opacity-55 hover:opacity-80"
                }`}
              >
                <div
                  className="absolute inset-0 bg-neutral-800 bg-cover bg-center"
                  style={{ backgroundImage: `url(${s.image})` }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── DESKTOP: original side-by-side layout (unchanged) ─── */}
      <div className="hidden lg:grid grid-cols-12 bg-neutral-50 text-neutral-900 min-h-[720px]">
        {/* LEFT — content */}
        <div className="col-span-6 xl:col-span-5 relative flex flex-col justify-between px-10 lg:px-14 py-16 z-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-brand-red font-serif text-2xl tracking-tight font-bold">Trikriti</span>
            <span className="text-neutral-900 font-serif text-2xl tracking-tight">Studio</span>
          </div>

          <div key={slide.id} className="py-10 animate-[fadeUp_700ms_ease-out]">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-neutral-200 bg-white/60 backdrop-blur text-[11px] uppercase tracking-[0.2em] text-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {slide.eyebrow}
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight whitespace-pre-line animate-[fadeUp_0.7s_ease-out]">
              <span className="bg-gradient-to-r from-brand-red via-rose-500 to-amber-500 bg-clip-text text-transparent">
                {slide.headline}
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base sm:text-lg text-neutral-600 leading-relaxed">
              {slide.sub}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href={slide.ctaHref}
                className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white pl-6 pr-2 py-2 text-sm font-medium hover:bg-rose-600 transition-colors"
              >
                {slide.cta}
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-neutral-900 group-hover:rotate-45 transition-transform">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
              <Link
                href="/track-order"
                className="inline-flex items-center px-5 py-3 rounded-full text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                Track Order →
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="w-11 h-11 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="w-11 h-11 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="flex-1 h-px bg-neutral-200 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-neutral-900"
                style={{ width: `${progress * 100}%`, transition: "width 80ms linear" }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT — image */}
        <div className="col-span-6 xl:col-span-7 relative bg-neutral-100 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-rose-200 via-amber-100 to-transparent blur-3xl opacity-70" />

          {slides.map((s, i) => (
            <div
              key={s.id}
              aria-hidden={i !== current}
              className={`absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                i === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              <div
                className="absolute inset-0 bg-center bg-no-repeat bg-contain lg:bg-cover"
                style={{ backgroundImage: `url(${s.image})` }}
              />
            </div>
          ))}

          <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-white text-sm font-medium text-neutral-900 shadow-sm">
            {slide.tag}
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex gap-3 overflow-x-auto">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                  i === current
                    ? "border-neutral-900 scale-105"
                    : "border-white/70 opacity-70 hover:opacity-100"
                }`}
              >
                <div
                  className="absolute inset-0 bg-white bg-center bg-cover"
                  style={{ backgroundImage: `url(${s.image})` }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
