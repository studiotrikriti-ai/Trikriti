"use client";

import Link from "next/link";
import { useEffect } from "react";

// 👇 Add your real Instagram reel shortcodes here
// Shortcode = the ID in the URL: instagram.com/reel/SHORTCODE/
const reels = [
  {
    id: 1,
    shortcode: "DM-tRD8xggA", // ✅ real reel
    title: "Start of our idea to print journey",
  },
  {
    id: 2,
    shortcode: "DWhANTJEf4r", //✅ real reel 
    title: "Shiv Mudra",
  },
  {
    id: 3,
    shortcode:"DW-2RPqkRCh", // 🔲 add shortcode when available
    title: "Behind the Scenes: How We Print Your Orders",
  },
];

function InstagramEmbed({ shortcode }: { shortcode: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // @ts-ignore
    if (window.instgrm) {
      // @ts-ignore
      window.instgrm.Embeds.process();
      return;
    }

    const existing = document.getElementById("instagram-embed-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        if (window.instgrm) window.instgrm.Embeds.process();
      };
      document.body.appendChild(script);
    }
  }, [shortcode]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={`https://www.instagram.com/reel/${shortcode}/`}
      data-instgrm-version="14"
      data-instgrm-captioned
      style={{
        background: "#FFF",
        border: 0,
        borderRadius: 0,
        boxShadow: "none",
        display: "block",
        margin: 0,
        padding: 0,
        width: "100%",
        minWidth: "100%",
      }}
    >
      <a
        href={`https://www.instagram.com/reel/${shortcode}/`}
        target="_blank"
        rel="noreferrer"
        className="block text-center text-brand-red text-sm font-semibold py-4"
      >
        Watch on Instagram →
      </a>
    </blockquote>
  );
}

function ReelPlaceholder({ title }: { title: string }) {
  return (
    <a
      href="https://www.instagram.com/trikriti.studio"
      target="_blank"
      rel="noreferrer"
      className="flex flex-col items-center justify-center gap-2 h-48 bg-gray-50 hover:bg-gray-100 transition-colors"
      aria-label={`Watch ${title} on Instagram`}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="white" strokeWidth="2"/>
          <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2"/>
          <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
        </svg>
      </div>
      <span className="text-gray-400 text-xs">Coming soon on Instagram</span>
    </a>
  );
}

export default function BlogTeaser() {
  return (
    <section className="py-16 sm:py-20 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-2">Blog & Reels</p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl">Latest From Studio</h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:block text-sm font-medium text-brand-black hover:text-brand-red transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="bg-white border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Embed or placeholder */}
              <div className="border-b border-gray-100 overflow-hidden">
                {reel.shortcode ? (
                  <InstagramEmbed shortcode={reel.shortcode} />
                ) : (
                  <ReelPlaceholder title={reel.title} />
                )}
              </div>

              {/* Title + link */}
              <div className="p-4">
                <h3 className="font-heading font-semibold text-base leading-snug mb-3 line-clamp-2">
                  {reel.title}
                </h3>
                <a
                  href={
                    reel.shortcode
                      ? `https://www.instagram.com/reel/${reel.shortcode}/`
                      : "https://www.instagram.com/trikriti.studio"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-red text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Watch on Instagram →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: View All */}
        <div className="mt-8 sm:hidden text-center">
          <Link href="/blog" className="text-sm font-medium text-brand-black hover:text-brand-red transition-colors">
            View All →
          </Link>
        </div>
      </div>
    </section>
  );
}