import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-brand-red py-14 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading font-black text-white text-3xl sm:text-5xl leading-tight mb-4">
          Ready to Print Your Ideas?
        </h2>
        <p className="text-red-100 font-body text-base sm:text-lg mb-8">
          Join thousands of happy customers. Start your order today.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/products"
            className="bg-white text-brand-red font-semibold px-8 py-3 hover:bg-brand-black hover:text-white transition-colors duration-200"
          >
            Shop Now
          </Link>
          <Link
            href="/custom"
            className="border-2 border-white text-white font-semibold px-8 py-3 hover:bg-white hover:text-brand-red transition-colors duration-200"
          >
            Custom Order
          </Link>
        </div>
      </div>
    </section>
  );
}
