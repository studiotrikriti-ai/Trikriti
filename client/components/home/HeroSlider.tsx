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
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295870/custom_raj_mudra_qg7oca.png",
  },
  {
    id: 2,
    headline: "Aurora Prism\nLamp",
    sub: "Elegant geometric 3D printed table lamp. Soft ambient glow for any room. 40% OFF — ₹1200.",
    cta: "View Product",
    ctaHref: "/products",
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295873/Aurora_Prism_Lamp_evegpw.jpg",
  },
  {
    id: 3,
    headline: "Luna Swirl\nLamp",
    sub: "Flowing curves, warm light, tripod base. A statement piece for modern living. 40% OFF — ₹1300.",
    cta: "View Product",
    ctaHref: "/products",
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295869/Luna_Swirl_Lamp_2_x1jgg6.png",
  },
  {
    id: 4,
    headline: "Mini Tumbler\nKeychain",
    sub: "Carry your lip balm in style. Trendy 3D printed tumbler keychain — 40% OFF at just ₹150.",
    cta: "Shop Now",
    ctaHref: "/products",
    image: "https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295872/Mini_Tumbler_Lip_Balm_Holder_Keychain_1_g08yfm.jpg",
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
    <section className="relative overflow-hidden" style={{ height: "min(80vh, 600px)" }}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-0.5 bg-brand-red" />
                  <span className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase font-body">
                    Trikriti Studio
                  </span>
                </div>

                <h1
                  className="font-heading font-black text-white leading-none mb-4"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", whiteSpace: "pre-line" }}
                >
                  {slide.headline}
                </h1>

                <p className="text-gray-200 text-base sm:text-lg font-body mb-8 max-w-sm leading-relaxed">
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
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-brand-red transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 ${
              i === current ? "w-8 h-1.5 bg-brand-red" : "w-2 h-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
