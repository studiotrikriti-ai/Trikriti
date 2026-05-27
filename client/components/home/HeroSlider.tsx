"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    headline: "Where Ideas\nGet Printed.",
    sub: "Premium 3D printed home decor, accessories & personalized gifts — crafted with care.",
    cta: "Shop Now",
    ctaHref: "/products",
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1779907254/ShivMudra2_f5xxee.png",
  },
  {
    id: 2,
    headline: "Aurora Prism\nLamp",
    sub: "Elegant geometric 3D printed table lamp. Soft ambient glow for any room. 40% OFF — ₹1200.",
    cta: "View Product",
    ctaHref: "/products",
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1779907253/lamp_rek6g3.png",
  },
  {
    id: 3,
    headline: "Luna Swirl\nLamp",
    sub: "Flowing curves, warm light, tripod base. A statement piece for modern living. 40% OFF — ₹1300.",
    cta: "View Product",
    ctaHref: "/products",
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1779907253/Luna_Swirl_Lamp_2_jszpoz.png",
  },
  {
    id: 4,
    headline: "Mini Tumbler\nKeychain",
    sub: "Carry your lip balm in style. Trendy 3D printed tumbler keychain — 40% OFF at just ₹150.",
    cta: "Shop Now",
    ctaHref: "/products",
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1779907253/MiniTumbler_g9e1wd.png",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden">
      {/*
        Padding-bottom trick: maintains aspect ratio responsively.
        56.25% = 9/16 * 100 → 16:9 on all screen widths.
        On very tall/narrow mobile screens we cap with min-height so content
        never gets crushed. Remove min-h if you don't want that.
      */}
      <div
        className="relative w-full min-h-[420px] sm:min-h-0"
        style={{ paddingBottom: "56.25%" }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            aria-hidden={i !== current}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.48) 50%, rgba(0,0,0,0.12) 100%)",
              }}
            />

            {/* Text content */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full max-w-7xl mx-auto px-5 sm:px-10">
                <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl">
                  {/* Brand eyebrow */}
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-6 sm:w-8 h-0.5 bg-brand-red" />
                    <span className="text-brand-red text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase font-body">
                      Trikriti Studio
                    </span>
                  </div>

                  {/* Headline */}
                  <h1
                    className="font-heading font-black text-white leading-none mb-3 sm:mb-4 whitespace-pre-line"
                    style={{ fontSize: "clamp(1.4rem, 5vw, 3.8rem)" }}
                  >
                    {slide.headline}
                  </h1>

                  {/* Sub-text */}
                  <p
                    className="text-gray-200 font-body mb-5 sm:mb-6 leading-relaxed"
                    style={{ fontSize: "clamp(0.72rem, 1.5vw, 1.05rem)" }}
                  >
                    {slide.sub}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Link href={slide.ctaHref} className="btn-primary">
                      {slide.cta}
                    </Link>
                    <Link
                      href="/track-order"
                      className="border border-white text-white px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold hover:bg-white hover:text-brand-black transition-colors"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-brand-red transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-brand-red transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-sm ${
                i === current
                  ? "w-6 sm:w-8 h-1.5 bg-brand-red"
                  : "w-2 h-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
