"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="relative overflow-hidden w-full" style={{ aspectRatio: "16/9", maxHeight: "90vh" }}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* 16:9 image — bg-cover will show 100% of image perfectly */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.10) 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-0.5 bg-brand-red" />
                  <span className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase font-body">
                    Trikriti Studio
                  </span>
                </div>

                <h1
                  className="font-heading font-black text-white leading-none mb-4"
                  style={{ fontSize: "clamp(1.6rem, 4vw, 3.8rem)", whiteSpace: "pre-line" }}
                >
                  {slide.headline}
                </h1>

                <p className="text-gray-200 font-body mb-6 max-w-sm leading-relaxed"
                  style={{ fontSize: "clamp(0.8rem, 1.4vw, 1.1rem)" }}
                >
                  {slide.sub}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link href={slide.ctaHref} className="btn-primary">
                    {slide.cta}
                  </Link>
                  <Link
                    href="/track-order"
                    className="border border-white text-white px-6 py-3 text-sm font-semibold hover:bg-white hover:text-brand-black transition-colors"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-brand-red transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-brand-red transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 ${
              i === current ? "w-8 h-1.5 bg-brand-red" : "w-2 h-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
