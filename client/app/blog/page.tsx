"use client";

import { useEffect } from "react";

const reels = [
  {
    id: 1,
    shortcode: "DU-2aIeDK0F",
    title: "Start of our idea to print journey",
    date: "May 2025",
    desc: "From concept to creation — how Trikriti Studio came to life.",
  },
  // Add more reels by adding their Instagram shortcode below
  // e.g. shortcode: "ABC123xyz" from https://www.instagram.com/reel/ABC123xyz/
  {
    id: 2,
    shortcode: "DVD_fSzjJfl", // placeholder — replace with real shortcode
    title: "Our Special product",
    date: "May 2025",
    desc: "A peek into our printing studio and quality control process.",
  },
  {
    id: 3,
    shortcode: "DXPUgRsDFfV", // placeholder — replace with real shortcode
    title: "Behind the Scenes",
    date: "Jun 2025",
    desc: "Learn how to create print-ready designs that look amazing on fabric.",
  },
];



function InstagramEmbed({ shortcode, title }: { shortcode: string; title: string }) {
  useEffect(() => {
    // Load Instagram embed script dynamically
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // @ts-ignore
        if (window.instgrm) window.instgrm.Embeds.process();
      };

      // If already loaded, just process
      // @ts-ignore
      if (window.instgrm) window.instgrm.Embeds.process();

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [shortcode]);

  return (
    <div className="instagram-embed-wrapper">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`https://www.instagram.com/reel/${shortcode}/`}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: 0,
          boxShadow: "none",
          display: "block",
          margin: "0 auto",
          minWidth: "100%",
          padding: 0,
          width: "100%",
        }}
      >
        <a
          href={`https://www.instagram.com/reel/${shortcode}/`}
          target="_blank"
          rel="noreferrer"
          className="text-brand-red text-sm font-semibold"
        >
          Watch on Instagram →
        </a>
      </blockquote>
    </div>
  );
}

function ReelPlaceholder({ title }: { title: string }) {
  return (
    <a
      href="https://www.instagram.com/trikriti.studio"
      target="_blank"
      rel="noreferrer"
      className="flex flex-col items-center justify-center gap-3 h-64 bg-gray-50 border border-dashed border-gray-200 text-center px-6 hover:bg-gray-100 transition-colors"
    >
      {/* Instagram gradient icon via CSS */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/>
          <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2"/>
          <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
        </svg>
      </div>
      <span className="text-gray-500 text-sm font-medium">Watch on Instagram</span>
      <span className="text-gray-400 text-xs">@trikriti.studio</span>
    </a>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-brand-white">
      {/* Header */}
      <div className="bg-brand-black text-white py-16 px-4 sm:px-6 text-center">
        <p className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-3">Learn & Explore</p>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-4">Blog & Reels</h1>
        <p className="text-gray-400 font-body">Tips, inspiration, and behind-the-scenes from Trikriti Studio</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

        {/* ── Reels Section ── */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-2">Instagram Reels</p>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl">Watch & Learn</h2>
            </div>
            <a
              href="https://www.instagram.com/trikriti.studio"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-brand-black hover:text-brand-red transition-colors"
            >
              Follow on Instagram →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reels.map((reel) => (
              <article key={reel.id} className="bg-white border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 overflow-hidden">
                  {reel.shortcode ? (
                    <InstagramEmbed shortcode={reel.shortcode} title={reel.title} />
                  ) : (
                    <ReelPlaceholder title={reel.title} />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-1">{reel.date}</p>
                  <h2 className="font-heading font-semibold text-base leading-snug mb-1">{reel.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-2">{reel.desc}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile follow link */}
          <div className="mt-6 sm:hidden">
            <a
              href="https://www.instagram.com/trikriti.studio"
              target="_blank"
              rel="noreferrer"
              className="block text-center text-sm font-semibold text-brand-red"
            >
              Follow us on Instagram →
            </a>
          </div>
        </div>

       

        {/* ── Instagram Profile CTA ── */}
        <div className="bg-brand-black text-white p-10 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
            </svg>
          </div>
          <h2 className="font-heading font-bold text-2xl mb-3">See More on Instagram</h2>
          <p className="text-gray-400 mb-6 font-body">We post reels, tips, and behind-the-scenes every week.</p>
          <a
            href="https://www.instagram.com/trikriti.studio"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-brand-red text-white font-semibold text-sm px-8 py-3 hover:opacity-90 transition-opacity"
          >
            Follow @trikriti.studio
          </a>
        </div>

      </div>
    </div>
  );
}
