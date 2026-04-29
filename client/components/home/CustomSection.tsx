import Link from "next/link";
import Image from "next/image";

export default function CustomSection() {
  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="bg-brand-black rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Text */}
        <div className="p-10 sm:p-14 flex flex-col justify-center">
          <p className="text-brand-red text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Made For You
          </p>
          <h2 className="font-heading font-black text-white text-3xl sm:text-5xl leading-tight mb-5">
            Custom 3D Prints
            <br />
            <span className="text-brand-red">Your Imagination.</span>
          </h2>
          <p className="text-gray-400 font-body text-base mb-6 max-w-md leading-relaxed">
            Want your name on a tumbler keychain? A personalized lamp? Or an entirely new 3D printed creation? We bring your ideas to life — one layer at a time.
          </p>
          <ul className="space-y-2 mb-8">
            {[
              "Custom name & text on any product",
              "Personalized lamps — Aurora or Luna style",
              "Unique gifts for any occasion",
              "Preview before we print — satisfaction guaranteed",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link href="/custom" className="btn-primary">
              Start Customizing
            </Link>
            <Link href="/contact" className="border border-gray-600 text-gray-300 px-6 py-3 text-sm font-semibold hover:border-white hover:text-white transition-colors">
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Right: 3D product preview */}
        <div className="relative aspect-square lg:aspect-auto min-h-64 bg-gray-900 overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dcyclqzvy/image/upload/v1777295871/shri_swami_samarth_cs0yvp.png"
            alt="Custom 3D product preview"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
